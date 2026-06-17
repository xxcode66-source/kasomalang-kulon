import { Hono } from 'hono'
import { prisma } from '../lib/prisma'
import { authMiddleware, roleMiddleware } from './auth.routes'

export const pbbRoutes = new Hono()

// Get PBB by NOP (Public)
pbbRoutes.get('/pbb/cek/:nop', async (c) => {
  try {
    const { nop } = c.req.param()

    const wajibPajak = await prisma.wajibPajak.findUnique({
      where: { nop },
      include: {
        penduduk: {
          select: {
            fullName: true,
          },
        },
        rt: {
          include: {
            rw: {
              include: {
                dusun: true,
              },
            },
          },
        },
      },
    })

    if (!wajibPajak) {
      return c.json({ error: 'NOP not found' }, 404)
    }

    const pbbRecords = await prisma.pbb.findMany({
      where: { wajibPajakId: wajibPajak.id },
      orderBy: { year: 'desc' },
      include: {
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    })

    // Format years 2020-2026
    const years = [2020, 2021, 2022, 2023, 2024, 2025, 2026]
    const statusPerTahun: any = {}

    years.forEach((year) => {
      const record = pbbRecords.find((r) => r.year === year)
      if (record) {
        let status = record.status
        const payment = record.payments[0]
        
        if (payment && payment.status === 'PENDING') {
          status = 'PENDING_APPROVAL'
        }

        statusPerTahun[year] = {
          status,
          tagihan: record.tagihan,
          paidAmount: payment?.amount || 0,
          paymentDate: payment?.paymentDate || null,
        }
      } else {
        statusPerTahun[year] = {
          status: 'BELUM_ADA_DATA',
          tagihan: 0,
          paidAmount: 0,
          paymentDate: null,
        }
      }
    })

    return c.json({
      success: true,
      data: {
        nop: wajibPajak.nop,
        namaWajibPajak: wajibPajak.penduduk.fullName,
        alamat: wajibPajak.objectAddress,
        rt: wajibPajak.rt.name,
        rw: wajibPajak.rt.rw.name,
        dusun: wajibPajak.rt.rw.dusun.name,
        statusPerTahun,
      },
    })
  } catch (error: any) {
    return c.json({ error: error.message || 'Failed to fetch PBB data' }, 500)
  }
})

// Get all PBB records (Admin only)
pbbRoutes.get('/pbb', authMiddleware, roleMiddleware('SUPER_ADMIN', 'ADMIN_DESA'), async (c) => {
  try {
    const { year, status, dusunId, rwId, rtId, page = '1', limit = '20' } = c.req.query()

    const where: any = {}
    
    if (year) where.year = parseInt(year)
    if (status) where.status = status

    if (rtId) {
      where.wajibPajak = { rtId }
    } else if (rwId) {
      where.wajibPajak = {
        rt: { rwId },
      }
    } else if (dusunId) {
      where.wajibPajak = {
        rt: {
          rw: { dusunId },
        },
      }
    }

    const pbbRecords = await prisma.pbb.findMany({
      where,
      include: {
        wajibPajak: {
          include: {
            penduduk: { select: { fullName: true } },
            rt: {
              include: {
                rw: { include: { dusun: true } },
              },
            },
          },
        },
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
      orderBy: { year: 'desc' },
    })

    const total = await prisma.pbb.count({ where })

    return c.json({
      success: true,
      data: {
        items: pbbRecords,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      },
    })
  } catch (error: any) {
    return c.json({ error: error.message || 'Failed to fetch PBB data' }, 500)
  }
})

// Upload PBB payment (RT/Kolektor)
pbbRoutes.post('/pbb/payment/upload', authMiddleware, async (c) => {
  try {
    const user = c.get('user')
    const body = await c.req.parseBody()
    
    const { nop, year, amount, notes } = body as any
    
    if (!nop || !year) {
      return c.json({ error: 'NOP and year are required' }, 400)
    }

    const wajibPajak = await prisma.wajibPajak.findUnique({
      where: { nop },
    })

    if (!wajibPajak) {
      return c.json({ error: 'NOP not found' }, 404)
    }

    // Check if RT can only upload for their RT
    if (user.role === 'RT') {
      const rtUser = await prisma.user.findUnique({
        where: { id: user.userId },
        select: { rtId: true },
      })

      if (rtUser?.rtId !== wajibPajak.rtId) {
        return c.json({ error: 'You can only upload payment for your RT' }, 403)
      }
    }

    const pbbRecord = await prisma.pbb.findFirst({
      where: {
        year: parseInt(year),
        wajibPajakId: wajibPajak.id,
      },
    })

    if (!pbbRecord) {
      return c.json({ error: 'PBB record not found for this year' }, 404)
    }

    // Handle file upload
    const file = body['proofImage'] as File
    let proofImagePath = '/uploads/default-proof.jpg'
    
    if (file) {
      // In production, save to S3 or local storage
      proofImagePath = `/uploads/pbb/${nop}-${year}-${Date.now()}.jpg`
    }

    const payment = await prisma.pbbPayment.create({
      data: {
        pbbId: pbbRecord.id,
        wajibPajakId: wajibPajak.id,
        paymentDate: new Date(),
        amount: parseFloat(amount) || pbbRecord.tagihan,
        proofImage: proofImagePath,
        notes: notes as string,
        status: 'PENDING',
      },
    })

    // Update PBB status
    await prisma.pbb.update({
      where: { id: pbbRecord.id },
      data: { status: 'BELUM_BAYAR' }, // Will be updated after approval
    })

    return c.json({
      success: true,
      data: { payment },
      message: 'Payment uploaded successfully. Waiting for verification.',
    })
  } catch (error: any) {
    return c.json({ error: error.message || 'Failed to upload payment' }, 500)
  }
})

// Verify PBB payment (Admin)
pbbRoutes.post('/pbb/payment/:id/verify', authMiddleware, roleMiddleware('SUPER_ADMIN', 'ADMIN_DESA'), async (c) => {
  try {
    const { id } = c.req.param()
    const { action, rejectionReason } = await c.req.json()

    if (!['APPROVE', 'REJECT'].includes(action)) {
      return c.json({ error: 'Invalid action' }, 400)
    }

    const payment = await prisma.pbbPayment.findUnique({
      where: { id },
      include: { pbb: true },
    })

    if (!payment) {
      return c.json({ error: 'Payment not found' }, 404)
    }

    const user = c.get('user')

    // Update payment
    await prisma.pbbPayment.update({
      where: { id },
      data: {
        status: action === 'APPROVE' ? 'APPROVED' : 'REJECTED',
        verifiedBy: user.userId,
        verifiedAt: new Date(),
        rejectionReason: action === 'REJECT' ? rejectionReason : null,
      },
    })

    // Create verification log
    await prisma.pbbVerification.create({
      data: {
        paymentId: id,
        verifiedBy: user.userId,
        action,
        notes: action === 'REJECT' ? rejectionReason : 'Payment verified and approved',
      },
    })

    // Update PBB status if approved
    if (action === 'APPROVE') {
      await prisma.pbb.update({
        where: { id: payment.pbbId },
        data: { status: 'LUNAS' },
      })
    }

    return c.json({
      success: true,
      message: `Payment ${action.toLowerCase()}d successfully`,
    })
  } catch (error: any) {
    return c.json({ error: error.message || 'Failed to verify payment' }, 500)
  }
})

// Get pending payments
pbbRoutes.get('/pbb/payments/pending', authMiddleware, roleMiddleware('SUPER_ADMIN', 'ADMIN_DESA'), async (c) => {
  try {
    const payments = await prisma.pbbPayment.findMany({
      where: { status: 'PENDING' },
      include: {
        wajibPajak: {
          include: {
            penduduk: { select: { fullName: true } },
            rt: {
              include: {
                rw: { include: { dusun: true } },
              },
            },
          },
        },
        pbb: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return c.json({
      success: true,
      data: { payments },
    })
  } catch (error: any) {
    return c.json({ error: error.message || 'Failed to fetch pending payments' }, 500)
  }
})
