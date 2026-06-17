import { Hono } from 'hono'
import { prisma } from '../lib/prisma'
import { authMiddleware, roleMiddleware } from './auth.routes'

export const suratRoutes = new Hono()

// Get all surat templates
suratRoutes.get('/surat', async (c) => {
  try {
    const templates = await prisma.surat.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    })

    return c.json({ success: true, data: { templates } })
  } catch (error: any) {
    return c.json({ error: error.message || 'Failed to fetch surat templates' }, 500)
  }
})

// Create surat request
suratRoutes.post('/surat/request', authMiddleware, async (c) => {
  try {
    const user = c.get('user')
    const { suratId, purpose, attachments } = await c.req.json()

    // Generate request number
    const date = new Date()
    const requestNumber = `SR/${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(Date.now()).slice(-6)}`

    const request = await prisma.suratRequest.create({
      data: {
        requestNumber,
        suratId,
        pemohonId: user.userId,
        pemohonName: user.fullName,
        pemohonNik: user.nik || '',
        pemohonPhone: user.phone,
        pemohonEmail: user.email,
        purpose,
        attachments: JSON.stringify(attachments || []),
        status: 'DIAJUKAN',
      },
    })

    return c.json({
      success: true,
      data: { request },
      message: 'Surat request submitted successfully',
    })
  } catch (error: any) {
    return c.json({ error: error.message || 'Failed to create surat request' }, 500)
  }
})

// Verify surat with QR code
suratRoutes.get('/surat/verify/:qrCode', async (c) => {
  try {
    const { qrCode } = c.req.param()

    const request = await prisma.suratRequest.findFirst({
      where: { qrCode },
      include: { surat: true },
    })

    if (!request) {
      return c.json({ error: 'Surat not found' }, 404)
    }

    return c.json({
      success: true,
      data: {
        valid: true,
        requestNumber: request.requestNumber,
        suratName: request.surat.name,
        pemohonName: request.pemohonName,
        status: request.status,
        issuedAt: request.completedAt,
      },
    })
  } catch (error: any) {
    return c.json({ error: error.message || 'Verification failed' }, 500)
  }
})
