import { Hono } from 'hono'
import { prisma } from '../lib/prisma'

export const publicRoutes = new Hono()

// Get profil desa
publicRoutes.get('/public/profil-desa', async (c) => {
  try {
    const profilData = await prisma.profilDesa.findMany({
      orderBy: { category: 'asc' },
    })

    // Group by category
    const grouped: any = {}
    profilData.forEach((item) => {
      if (!grouped[item.category]) {
        grouped[item.category] = {}
      }
      grouped[item.category][item.key] = item.value
    })

    return c.json({ success: true, data: { profil: grouped } })
  } catch (error: any) {
    return c.json({ error: error.message || 'Failed to fetch profil desa' }, 500)
  }
})

// Get statistik desa
publicRoutes.get('/public/statistik', async (c) => {
  try {
    const [totalPenduduk, totalKK, totalDusun, totalRW, totalRT] = await Promise.all([
      prisma.penduduk.count({ where: { deletedAt: null, status: 'ACTIVE' } }),
      prisma.keluarga.count(),
      prisma.dusun.count(),
      prisma.rw.count(),
      prisma.rt.count(),
    ])

    // Gender distribution
    const genderStats = await prisma.penduduk.groupBy({
      by: ['gender'],
      where: { deletedAt: null, status: 'ACTIVE' },
      _count: true,
    })

    // Age distribution
    const currentYear = new Date().getFullYear()
    
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
        gender: genderStats.reduce((acc: any, stat) => {
          acc[stat.gender] = stat._count
          return acc
        }, {}),
      },
    })
  } catch (error: any) {
    return c.json({ error: error.message || 'Failed to fetch statistics' }, 500)
  }
})

// Get berita terbaru
publicRoutes.get('/public/berita', async (c) => {
  try {
    const { category, limit = '6' } = c.req.query()
    const where: any = { isPublished: true }
    
    if (category) {
      where.category = category
    }

    const berita = await prisma.berita.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      take: parseInt(limit),
      include: {
        author: {
          select: { fullName: true },
        },
      },
    })

    return c.json({ success: true, data: { berita } })
  } catch (error: any) {
    return c.json({ error: error.message || 'Failed to fetch berita' }, 500)
  }
})

// Get pengumuman
publicRoutes.get('/public/pengumuman', async (c) => {
  try {
    const pengumuman = await prisma.berita.findMany({
      where: { isPublished: true, category: 'PENGUMUMAN' },
      orderBy: { publishedAt: 'desc' },
      take: 5,
    })

    return c.json({ success: true, data: { pengumuman } })
  } catch (error: any) {
    return c.json({ error: error.message || 'Failed to fetch pengumuman' }, 500)
  }
})

// Get agenda
publicRoutes.get('/public/agenda', async (c) => {
  try {
    const agenda = await prisma.berita.findMany({
      where: { isPublished: true, category: 'AGENDA' },
      orderBy: { publishedAt: 'desc' },
      take: 5,
    })

    return c.json({ success: true, data: { agenda } })
  } catch (error: any) {
    return c.json({ error: error.message || 'Failed to fetch agenda' }, 500)
  }
})

// Submit pengaduan
publicRoutes.post('/public/pengaduan', async (c) => {
  try {
    const body = await c.req.json()
    const date = new Date()
    const reportNumber = `ADU/${date.getFullYear()}/${String(Date.now()).slice(-6)}`

    const pengaduan = await prisma.pengaduan.create({
      data: {
        ...body,
        reportNumber,
        pelaporName: body.isAnonymous ? 'Anonim' : body.pelaporName,
      },
    })

    return c.json({
      success: true,
      data: { pengaduan },
      message: 'Pengaduan berhasil dikirim',
    })
  } catch (error: any) {
    return c.json({ error: error.message || 'Failed to submit pengaduan' }, 500)
  }
})

// Track pengaduan
publicRoutes.get('/public/pengaduan/:reportNumber', async (c) => {
  try {
    const { reportNumber } = c.req.param()

    const pengaduan = await prisma.pengaduan.findUnique({
      where: { reportNumber },
    })

    if (!pengaduan) {
      return c.json({ error: 'Pengaduan not found' }, 404)
    }

    return c.json({
      success: true,
      data: {
        reportNumber: pengaduan.reportNumber,
        title: pengaduan.title,
        category: pengaduan.category,
        status: pengaduan.status,
        createdAt: pengaduan.createdAt,
        response: pengaduan.response,
        resolvedAt: pengaduan.resolvedAt,
      },
    })
  } catch (error: any) {
    return c.json({ error: error.message || 'Failed to track pengaduan' }, 500)
  }
})

// Get bantuan sosial publik
publicRoutes.get('/public/bantuan', async (c) => {
  try {
    const programs = await prisma.bantuanSosial.findMany({
      where: { status: 'ACTIVE' },
      select: {
        id: true,
        name: true,
        type: true,
        year: true,
        description: true,
        quota: true,
      },
      orderBy: { year: 'desc' },
    })

    return c.json({ success: true, data: { programs } })
  } catch (error: any) {
    return c.json({ error: error.message || 'Failed to fetch bantuan programs' }, 500)
  }
})
