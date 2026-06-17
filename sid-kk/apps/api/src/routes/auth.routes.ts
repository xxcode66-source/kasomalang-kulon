import { Hono } from 'hono'
import { sign, verify } from 'jsonwebtoken'
import { hash, verify as verifyArgon2 } from 'argon2'
import { prisma } from '../lib/prisma'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

// Middleware untuk autentikasi
export const authMiddleware = async (c: any, next: any) => {
  const authHeader = c.req.header('Authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = verify(token, process.env.JWT_SECRET || 'secret') as any
    c.set('user', decoded)
    await next()
  } catch (error) {
    return c.json({ error: 'Invalid token' }, 401)
  }
}

// Middleware untuk role-based access
export const roleMiddleware = (...allowedRoles: string[]) => {
  return async (c: any, next: any) => {
    const user = c.get('user')
    
    if (!user || !allowedRoles.includes(user.role)) {
      return c.json({ error: 'Forbidden' }, 403)
    }
    
    await next()
  }
}

// Login schema
const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
})

// Register schema (only for masyarakat)
const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3),
  password: z.string().min(6),
  fullName: z.string().min(3),
  phone: z.string().optional(),
  nik: z.string().length(16).optional(),
})

export const authRoutes = new Hono()

// Login
authRoutes.post('/auth/login', zValidator('json', loginSchema), async (c) => {
  try {
    const { username, password } = c.req.valid('json')

    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        role: true,
        rt: {
          include: {
            rw: {
              include: { dusun: true }
            }
          }
        }
      },
    })

    if (!user || !user.isActive) {
      return c.json({ error: 'Invalid credentials' }, 401)
    }

    const validPassword = await verifyArgon2(user.password, password)
    
    if (!validPassword) {
      return c.json({ error: 'Invalid credentials' }, 401)
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        lastLoginIp: c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown',
      },
    })

    // Log login history
    await prisma.loginHistory.create({
      data: {
        userId: user.id,
        ipAddress: c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown',
        userAgent: c.req.header('user-agent') || 'unknown',
        status: 'SUCCESS',
      },
    })

    // Generate tokens
    const tokenPayload = {
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role.name,
      roleId: user.roleId,
    }

    const accessToken = sign(tokenPayload, process.env.JWT_SECRET || 'secret', {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    })

    const refreshToken = sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' }
    )

    // Save session
    await prisma.session.create({
      data: {
        userId: user.id,
        token: accessToken,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        ipAddress: c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown',
        userAgent: c.req.header('user-agent') || 'unknown',
      },
    })

    return c.json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          phone: user.phone,
          avatar: user.avatar,
          role: user.role.name,
          roleId: user.roleId,
          rt: user.rt ? {
            id: user.rt.id,
            name: user.rt.name,
            code: user.rt.code,
            rw: {
              name: user.rt.rw.name,
              dusun: {
                name: user.rt.rw.dusun.name,
              }
            }
          } : null,
        },
        tokens: {
          accessToken,
          refreshToken,
        },
      },
    })
  } catch (error: any) {
    console.error('Login error:', error)
    return c.json({ error: error.message || 'Login failed' }, 500)
  }
})

// Register (for masyarakat only)
authRoutes.post('/auth/register', zValidator('json', registerSchema), async (c) => {
  try {
    const { email, username, password, fullName, phone, nik } = c.req.valid('json')

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    })

    if (existingUser) {
      return c.json({ error: 'Email or username already exists' }, 400)
    }

    // Get MASYARAKAT role
    const masyarakatRole = await prisma.role.findUnique({
      where: { name: 'MASYARAKAT' },
    })

    if (!masyarakatRole) {
      return c.json({ error: 'Role not found' }, 500)
    }

    // Hash password
    const hashedPassword = await hash(password)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        fullName,
        phone,
        roleId: masyarakatRole.id,
      },
      include: { role: true },
    })

    return c.json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          role: user.role.name,
        },
      },
      message: 'Registration successful. Please login.',
    })
  } catch (error: any) {
    console.error('Register error:', error)
    return c.json({ error: error.message || 'Registration failed' }, 500)
  }
})

// Refresh token
authRoutes.post('/auth/refresh', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const refreshToken = authHeader.split(' ')[1]

    const decoded = verify(refreshToken, process.env.JWT_SECRET || 'secret') as any

    const session = await prisma.session.findUnique({
      where: { refreshToken },
    })

    if (!session || session.expiresAt < new Date()) {
      return c.json({ error: 'Invalid refresh token' }, 401)
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: { role: true },
    })

    if (!user || !user.isActive) {
      return c.json({ error: 'User not found or inactive' }, 401)
    }

    const tokenPayload = {
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role.name,
      roleId: user.roleId,
    }

    const accessToken = sign(tokenPayload, process.env.JWT_SECRET || 'secret', {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    })

    return c.json({
      success: true,
      data: {
        accessToken,
      },
    })
  } catch (error: any) {
    return c.json({ error: error.message || 'Token refresh failed' }, 500)
  }
})

// Logout
authRoutes.post('/auth/logout', authMiddleware, async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    const token = authHeader?.split(' ')[1]

    if (token) {
      await prisma.session.deleteMany({
        where: { token },
      })
    }

    return c.json({
      success: true,
      message: 'Logout successful',
    })
  } catch (error: any) {
    return c.json({ error: error.message || 'Logout failed' }, 500)
  }
})

// Get current user
authRoutes.get('/auth/me', authMiddleware, async (c) => {
  try {
    const user = c.get('user')

    const userData = await prisma.user.findUnique({
      where: { id: user.userId },
      include: {
        role: true,
        rt: {
          include: {
            rw: {
              include: { dusun: true }
            }
          }
        },
      },
    })

    if (!userData) {
      return c.json({ error: 'User not found' }, 404)
    }

    return c.json({
      success: true,
      data: {
        user: {
          id: userData.id,
          username: userData.username,
          email: userData.email,
          fullName: userData.fullName,
          phone: userData.phone,
          avatar: userData.avatar,
          role: userData.role.name,
          roleId: userData.roleId,
          rt: userData.rt ? {
            id: userData.rt.id,
            name: userData.rt.name,
            code: userData.rt.code,
            rw: {
              name: userData.rt.rw.name,
              dusun: {
                name: userData.rt.rw.dusun.name,
              }
            }
          } : null,
        },
      },
    })
  } catch (error: any) {
    return c.json({ error: error.message || 'Failed to get user data' }, 500)
  }
})
