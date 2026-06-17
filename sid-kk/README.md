# 🏛️ SID-KK - Sistem Informasi Desa Kasomalang Kulon

Sistem Informasi Desa berbasis web modern untuk Pemerintah Desa Kasomalang Kulon, Kecamatan Kasomalang, Kabupaten Indramayu.

## 🚀 Fitur Utama

### Modul Publik
- **Landing Page** - Halaman depan profesional dengan statistik desa
- **Cek PBB Online** - Cek status pembayaran PBB tanpa login
- **Pengaduan Masyarakat** - Kirim dan track pengaduan
- **Berita & Pengumuman** - Informasi terbaru dari desa
- **Bantuan Sosial** - Info program bantuan

### Modul Admin (Login Required)
- **Dashboard Analytics** - Statistik real-time dengan grafik
- **Manajemen PBB** - Kelola data wajib pajak dan verifikasi pembayaran
- **Surat Menyurat** - Pengajuan dan approval surat online
- **Data Penduduk** - Master data kependudukan
- **Bantuan Sosial** - Kelola penerima bantuan
- **Pengaduan** - Respon pengaduan masyarakat

### Role-Based Access Control
1. **Super Admin** - Akses penuh sistem
2. **Admin Desa** - Kelola data dan verifikasi
3. **RT** - Upload pembayaran PBB wilayah RT
4. **Kolektor PBB** - Monitoring pembayaran
5. **Masyarakat** - Layanan online

## 🛠️ Tech Stack

### Frontend
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Shadcn/UI Components
- TanStack Query
- Zustand (State Management)
- Recharts (Analytics)

### Backend
- Hono (Lightweight Web Framework)
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Argon2 Password Hashing

### DevOps
- Docker & Docker Compose
- Environment Configuration
- Database Migrations

## 📦 Instalasi

### Prerequisites
- Node.js >= 18
- PostgreSQL >= 15
- Docker (optional)

### Quick Start dengan Docker

```bash
# Clone repository
git clone <repository-url>
cd sid-kk

# Copy environment file
cp .env.example .env

# Generate JWT secret
echo "JWT_SECRET=$(openssl rand -hex 32)" >> .env

# Start all services
docker-compose up -d

# Run database migrations
docker-compose exec api npm run db:migrate

# Seed database
docker-compose exec api npm run db:seed
```

### Manual Installation

```bash
# Install dependencies
npm install

# Setup database
cp packages/database/.env.example packages/database/.env
# Edit DATABASE_URL in .env

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database
npm run db:seed

# Start development servers
npm run dev
```

## 🔑 Default Credentials

Setelah seeding database, gunakan credentials berikut:

| Username | Password | Role |
|----------|----------|------|
| superadmin | admin123 | Super Admin |
| admindesa | admin123 | Admin Desa |
| rt01 | admin123 | Ketua RT 01 |
| rt02 | admin123 | Ketua RT 02 |
| kolektor01 | admin123 | Kolektor PBB |

## 📁 Struktur Folder

```
sid-kk/
├── apps/
│   ├── api/              # Backend API (Hono)
│   │   └── src/
│   │       ├── routes/   # API endpoints
│   │       ├── middleware/
│   │       ├── services/
│   │       └── lib/
│   └── web/              # Frontend (Next.js)
│       └── src/
│           ├── app/      # App Router pages
│           ├── components/
│           ├── lib/
│           └── stores/
├── packages/
│   ├── database/         # Prisma schema & migrations
│   │   └── prisma/
│   │       ├── schema.prisma
│   │       └── seed.ts
│   ├── ui/               # Shared UI components
│   └── config/           # Shared configurations
├── docker-compose.yml
└── package.json
```

## 🗄️ Database Schema

Schema lengkap tersedia di `packages/database/prisma/schema.prisma`

### Tabel Utama:
- users, roles, permissions
- dusun, rw, rt
- penduduk, keluarga
- wajib_pajak, pbb, pbb_payment
- surat, surat_request
- bantuan_sosial, bantuan_penerima
- berita, pengaduan
- audit_logs, notifications

## 🔌 API Endpoints

### Public APIs
- `GET /api/public/profil-desa` - Profil desa
- `GET /api/public/statistik` - Statistik desa
- `GET /api/public/berita` - Berita terbaru
- `GET /api/pbb/cek/:nop` - Cek PBB by NOP

### Authenticated APIs
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register (masyarakat)
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/pbb` - Data PBB
- `POST /api/pbb/payment/upload` - Upload pembayaran
- `POST /api/surat/request` - Ajukan surat

Dokumentasi lengkap: `http://localhost:4000/api/docs`

## 🔐 Security Features

- JWT Authentication with Refresh Token
- Role-Based Access Control (RBAC)
- Password Hashing (Argon2)
- SQL Injection Protection (Prisma ORM)
- CORS Protection
- Rate Limiting Ready
- Audit Logging
- Login History Tracking

## 📊 Dashboard Features

- Real-time statistics
- PBB analytics per tahun/dusun/RW/RT
- Grafik trend pembayaran
- Drill-down capability
- Export ready data

## 🎯 Workflow PBB

1. **RT/Kolektor** upload bukti pembayaran
2. Status → **PENDING**
3. **Admin Desa** verifikasi
4. Status → **APPROVED** atau **REJECTED**
5. Jika approved → PBB status → **LUNAS**

## 📝 Surat Menyurat

Jenis surat tersedia:
- Surat Keterangan Usaha (SKU)
- Surat Keterangan Domisili (SKT)
- Surat Keterangan Tidak Mampu (SKTM)
- Surat Pengantar KTP/KK
- Dan 6 jenis surat lainnya

Status tracking:
- DIAJUKAN → DIPROSES → DISETUJUI → SELESAI
- QR Code verification untuk surat yang diterbitkan

## 🤝 Kontribusi

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

Copyright © 2024 Pemerintah Desa Kasomalang Kulon

## 📞 Support

Untuk bantuan teknis:
- Email: admin@kasomalkulon.desa.id
- Telp: 0234-123456

---

**Dibangun dengan ❤️ untuk Desa Kasomalang Kulon**
