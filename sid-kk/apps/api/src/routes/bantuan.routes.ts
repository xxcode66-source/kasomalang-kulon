import { Hono } from 'hono'
import { prisma } from '../lib/prisma'

export const bantuanRoutes = new Hono()
export const pendudukRoutes = new Hono()
export const pengaduanRoutes = new Hono()
export const beritaRoutes = new Hono()
export const wilayahRoutes = new Hono()

// Placeholder routes - implement similar to pbb.routes.ts
bantuanRoutes.get('/bantuan', async (c) => {
  try {
    const programs = await prisma.bantuanSosial.findMany({
      where: { status: 'ACTIVE' },
      include: { penerima: true },
      orderBy: { year: 'desc' },
    })
    return c.json({ success: true, data: { programs } })
  } catch (error: any) {
    return c.json({ error: error.message || 'Failed to fetch bantuan data' }, 500)
  }
})

pendudukRoutes.get('/penduduk', async (c) => {
  try {
    const { page = '1', limit = '20' } = c.req.query()
    const penduduk = await prisma.penduduk.findMany({
      where: { deletedAt: null },
      include: { family: true },
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
    })
    const total = await prisma.penduduk.count({ where: { deletedAt: null } })
    return c.json({ 
      success: true, 
      data: { 
        items: penduduk,
        pagination: { page: parseInt(page), limit: parseInt(limit), total }
      } 
    })
  } catch (error: any) {
    return c.json({ error: error.message || 'Failed to fetch penduduk data' }, 500)
  }
})

pengaduanRoutes.post('/pengaduan', async (c) => {
  try {
    const body = await c.req.json()
    const date = new Date()
    const reportNumber = `ADU/${date.getFullYear()}/${String(Date.now()).slice(-6)}`
    
    const pengaduan = await prisma.pengaduan.create({
      data: { ...body, reportNumber },
    })
    return c.json({ success: true, data: { pengaduan } })
  } catch (error: any) {
    return c.json({ error: error.message || 'Failed to create pengaduan' }, 500)
  }
})

beritaRoutes.get('/berita', async (c) => {
  try {
    const { category } = c.req.query()
    const where: any = { isPublished: true }
    if (category) where.category = category
    
    const berita = await prisma.berita.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      take: 10,
    })
    return c.json({ success: true, data: { berita } })
  } catch (error: any) {
    return c.json({ error: error.message || 'Failed to fetch berita' }, 500)
  }
})

wilayahRoutes.get('/wilayah/dusun', async (c) => {
  try {
    const dusun = await prisma.dusun.findMany({
      include: { rws: { include: { rts: true } } },
      orderBy: { name: 'asc' },
    })
    return c.json({ success: true, data: { dusun } })
  } catch (error: any) {
    return c.json({ error: error.message || 'Failed to fetch wilayah data' }, 500)
  }
})
