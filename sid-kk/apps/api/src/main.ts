import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { errorHandler } from 'hono/error-handler'
import { swaggerUI } from '@hono/swagger-ui'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Import routes
import { authRoutes } from './routes/auth.routes'
import { pbbRoutes } from './routes/pbb.routes'
import { suratRoutes } from './routes/surat.routes'
import { bantuanRoutes } from './routes/bantuan.routes'
import { pendudukRoutes } from './routes/penduduk.routes'
import { pengaduanRoutes } from './routes/pengaduan.routes'
import { beritaRoutes } from './routes/berita.routes'
import { wilayahRoutes } from './routes/wilayah.routes'
import { dashboardRoutes } from './routes/dashboard.routes'
import { publicRoutes } from './routes/public.routes'

// Create Hono app
const app = new Hono()

// Global middleware
app.use('*', logger())
app.use('*', cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
}))
app.use('/api/*', errorHandler())

// API Base route
app.get('/api', (c) => {
  return c.json({
    name: 'SID-KK API',
    version: '1.0.0',
    description: 'Sistem Informasi Desa Kasomalang Kulon',
    endpoints: {
      auth: '/api/auth',
      pbb: '/api/pbb',
      surat: '/api/surat',
      bantuan: '/api/bantuan',
      penduduk: '/api/penduduk',
      pengaduan: '/api/pengaduan',
      berita: '/api/berita',
      wilayah: '/api/wilayah',
      dashboard: '/api/dashboard',
      public: '/api/public',
    },
  })
})

// Swagger UI
app.get('/api/docs', swaggerUI({ url: '/api/doc' }))

// Routes
const routes = [
  authRoutes,
  pbbRoutes,
  suratRoutes,
  bantuanRoutes,
  pendudukRoutes,
  pengaduanRoutes,
  beritaRoutes,
  wilayahRoutes,
  dashboardRoutes,
  publicRoutes,
]

routes.forEach((route) => {
  app.route('/api', route)
})

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Start server
const port = parseInt(process.env.PORT || '4000')

console.log(`🚀 SID-KK API Server starting on port ${port}...`)

serve({
  fetch: app.fetch,
  port,
}, (info) => {
  console.log(`✅ Server is running on http://localhost:${info.port}`)
  console.log(`📚 API Documentation: http://localhost:${info.port}/api/docs`)
})

export default app
