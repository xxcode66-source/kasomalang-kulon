import { Hono } from 'hono'
import { prisma } from '../lib/prisma'
import { authMiddleware, roleMiddleware } from './auth.routes'

export const dashboardRoutes = new Hono()

// Dashboard statistics for admin
dashboardRoutes.get('/dashboard/stats', authMiddleware, async (c) => {
  try {
    const user = c.get('user')
    const currentYear = new Date().getFullYear()

    // Get counts based on role
    let whereClause: any = {}
    
    if (user.role === 'RT') {
      const rtUser = await prisma.user.findUnique({
        where: { id: user.userId },
        select: { rtId: true },
      })
      whereClause = { rtId: rtUser?.rtId }
    } else if (user.role === 'KOLEKTOR_PBB') {
      // Kolektor can see all PBB in their area
      // Implement based on kolektorPbb configuration
    }

    // Population stats
    const totalPenduduk = await prisma.penduduk.count({
      where: { deletedAt: null, ...whereClause },
    })

    const totalKK = await prisma.keluarga.count({
      where: whereClause,
    })

    const totalDusun = await prisma.dusun.count()
    const totalRW = await prisma.rw.count()
    const totalRT = await prisma.rt.count()

    // PBB stats for current year
    const pbbStats = await prisma.pbb.groupBy({
      by: ['status'],
      where: { year: currentYear },
      _count: true,
      _sum: { tagihan: true },
    })

    const pbbTotalTagihan = pbbStats.reduce((acc, stat) => acc + Number(stat._sum.tagihan || 0), 0)
    const pbbSudahBayar = pbbStats.find(s => s.status === 'LUNAS')?._count || 0
    const pbbBelumBayar = pbbStats.find(s => s.status === 'BELUM_BAYAR')?._count || 0
    const pbbMenunggak = pbbStats.find(s => s.status === 'MENUNGGAK')?._count || 0

    const realisasiPercent = totalPenduduk > 0 
      ? ((pbbSudahBayar / (pbbSudahBayar + pbbBelumBayar + pbbMenunggak)) * 100).toFixed(2)
      : 0

    // Surat stats
    const suratStats = await prisma.suratRequest.groupBy({
      by: ['status'],
      _count: true,
    })

    // Bantuan stats
    const bantuanActiveCount = await prisma.bantuanSosial.count({
      where: { status: 'ACTIVE', year: currentYear },
    })

    const bantuanPenerimaCount = await prisma.bantuanPenerima.count({
      where: { status: 'VERIFIED' },
    })

    // Pengaduan stats
    const pengaduanStats = await prisma.pengaduan.groupBy({
      by: ['status'],
      _count: true,
    })

    const pengaduanAktif = pengaduanStats
      .filter(s => s.status !== 'SELESAI' && s.status !== 'DITOLAK')
      .reduce((acc, stat) => acc + stat._count, 0)

    return c.json({
      success: true,
      data: {
        kependudukan: {
          totalPenduduk,
          totalKK,
          totalDusun,
          totalRW,
          totalRT,
        },
        pbb: {
          tahun: currentYear,
          totalTagihan: pbbTotalTagihan,
          sudahBayar: pbbSudahBayar,
          belumBayar: pbbBelumBayar,
          menunggak: pbbMenunggak,
          realisasiPercent: parseFloat(realisasiPercent as string),
        },
        surat: {
          total: suratStats.reduce((acc, stat) => acc + stat._count, 0),
          diproses: suratStats.find(s => s.status === 'DIPROSES')?._count || 0,
          disetujui: suratStats.find(s => s.status === 'DISETUJUI')?._count || 0,
          ditolak: suratStats.find(s => s.status === 'DITOLAK')?._count || 0,
        },
        bantuan: {
          programAktif: bantuanActiveCount,
          totalPenerima: bantuanPenerimaCount,
        },
        pengaduan: {
          aktif: pengaduanAktif,
          selesai: pengaduanStats.find(s => s.status === 'SELESAI')?._count || 0,
        },
      },
    })
  } catch (error: any) {
    return c.json({ error: error.message || 'Failed to fetch dashboard stats' }, 500)
  }
})

// PBB Analytics by Dusun
dashboardRoutes.get('/dashboard/pbb/dusun', authMiddleware, async (c) => {
  try {
    const { year } = c.req.query()
    const targetYear = year ? parseInt(year) : new Date().getFullYear()

    const dusunStats = await prisma.pbbStatDusun.findMany({
      where: { year: targetYear },
      include: { dusun: true },
      orderBy: { realisasiPercent: 'desc' },
    })

    return c.json({
      success: true,
      data: { dusunStats },
    })
  } catch (error: any) {
    return c.json({ error: error.message || 'Failed to fetch dusun stats' }, 500)
  }
})

// PBB Analytics by RW
dashboardRoutes.get('/dashboard/pbb/rw', authMiddleware, async (c) => {
  try {
    const { year, dusunId } = c.req.query()
    const targetYear = year ? parseInt(year) : new Date().getFullYear()

    const where: any = { year: targetYear }
    if (dusunId) {
      where.rw = { dusunId }
    }

    const rwStats = await prisma.pbbStatRw.findMany({
      where,
      include: { 
        rw: {
          include: { dusun: true }
        }
      },
      orderBy: { realisasiPercent: 'desc' },
    })

    return c.json({
      success: true,
      data: { rwStats },
    })
  } catch (error: any) {
    return c.json({ error: error.message || 'Failed to fetch rw stats' }, 500)
  }
})

// PBB Analytics by RT
dashboardRoutes.get('/dashboard/pbb/rt', authMiddleware, async (c) => {
  try {
    const { year, rwId } = c.req.query()
    const targetYear = year ? parseInt(year) : new Date().getFullYear()

    const where: any = { year: targetYear }
    if (rwId) {
      where.rt = { rwId }
    }

    const rtStats = await prisma.pbbStatRt.findMany({
      where,
      include: { 
        rt: {
          include: { 
            rw: {
              include: { dusun: true }
            }
          }
        }
      },
      orderBy: { realisasiPercent: 'desc' },
    })

    return c.json({
      success: true,
      data: { rtStats },
    })
  } catch (error: any) {
    return c.json({ error: error.message || 'Failed to fetch rt stats' }, 500)
  }
})

// PBB Trend per Tahun
dashboardRoutes.get('/dashboard/pbb/trend', authMiddleware, async (c) => {
  try {
    const years = [2020, 2021, 2022, 2023, 2024, 2025, 2026]
    
    const trendData = await Promise.all(
      years.map(async (year) => {
        const stats = await prisma.pbb.groupBy({
          by: ['status'],
          where: { year },
          _count: true,
        })

        const totalTagihan = await prisma.pbb.aggregate({
          where: { year },
          _sum: { tagihan: true },
        })

        return {
          year,
          total: stats.reduce((acc, s) => acc + s._count, 0),
          lunas: stats.find(s => s.status === 'LUNAS')?._count || 0,
          belumBayar: stats.find(s => s.status === 'BELUM_BAYAR')?._count || 0,
          menunggak: stats.find(s => s.status === 'MENUNGGAK')?._count || 0,
          totalTagihan: Number(totalTagihan._sum.tagihan || 0),
        }
      })
    )

    return c.json({
      success: true,
      data: { trend: trendData },
    })
  } catch (error: any) {
    return c.json({ error: error.message || 'Failed to fetch trend data' }, 500)
  }
})
