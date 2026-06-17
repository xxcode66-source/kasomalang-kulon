/**
 * Seed Database untuk SID-KK
 * Sistem Informasi Desa Kasomalang Kulon
 */

import { PrismaClient, Gender, StatusPerkawinan, SuratType, BantuanType } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // ============================================
  // 1. CREATE ROLES
  // ============================================
  console.log('📋 Creating roles...')

  const roles = await Promise.all([
    prisma.role.upsert({
      where: { name: 'SUPER_ADMIN' },
      update: {},
      create: {
        name: 'SUPER_ADMIN',
        displayName: 'Super Admin Desa',
        description: 'Hak akses penuh ke semua fitur sistem',
      },
    }),
    prisma.role.upsert({
      where: { name: 'ADMIN_DESA' },
      update: {},
      create: {
        name: 'ADMIN_DESA',
        displayName: 'Admin Desa',
        description: 'Mengelola data masyarakat, surat, bantuan sosial, dan verifikasi PBB',
      },
    }),
    prisma.role.upsert({
      where: { name: 'RT' },
      update: {},
      create: {
        name: 'RT',
        displayName: 'Ketua RT',
        description: 'Login khusus PBB untuk mengelola wilayah RT nya',
      },
    }),
    prisma.role.upsert({
      where: { name: 'KOLEKTOR_PBB' },
      update: {},
      create: {
        name: 'KOLEKTOR_PBB',
        displayName: 'Kolektor PBB',
        description: 'Login khusus PBB untuk mengumpulkan pembayaran',
      },
    }),
    prisma.role.upsert({
      where: { name: 'MASYARAKAT' },
      update: {},
      create: {
        name: 'MASYARAKAT',
        displayName: 'Masyarakat',
        description: 'Portal masyarakat untuk layanan online',
      },
    }),
  ])

  // ============================================
  // 2. CREATE PERMISSIONS
  // ============================================
  console.log('🔐 Creating permissions...')

  const permissions = [
    // PBB Permissions
    { name: 'pbb.read', displayName: 'Lihat Data PBB', module: 'pbb' },
    { name: 'pbb.write', displayName: 'Kelola Data PBB', module: 'pbb' },
    { name: 'pbb.payment.upload', displayName: 'Upload Pembayaran PBB', module: 'pbb' },
    { name: 'pbb.payment.approve', displayName: 'Approve Pembayaran PBB', module: 'pbb' },
    { name: 'pbb.payment.reject', displayName: 'Reject Pembayaran PBB', module: 'pbb' },
    { name: 'pbb.dashboard.view', displayName: 'Lihat Dashboard PBB', module: 'pbb' },
    
    // Surat Permissions
    { name: 'surat.read', displayName: 'Lihat Data Surat', module: 'surat' },
    { name: 'surat.write', displayName: 'Kelola Data Surat', module: 'surat' },
    { name: 'surat.request.create', displayName: 'Ajukan Surat', module: 'surat' },
    { name: 'surat.request.approve', displayName: 'Approve Surat', module: 'surat' },
    { name: 'surat.request.reject', displayName: 'Reject Surat', module: 'surat' },
    
    // Bantuan Sosial Permissions
    { name: 'bantuan.read', displayName: 'Lihat Data Bantuan', module: 'bantuan' },
    { name: 'bantuan.write', displayName: 'Kelola Data Bantuan', module: 'bantuan' },
    { name: 'bantuan.verify', displayName: 'Verifikasi Penerima Bantuan', module: 'bantuan' },
    
    // Penduduk Permissions
    { name: 'penduduk.read', displayName: 'Lihat Data Penduduk', module: 'penduduk' },
    { name: 'penduduk.write', displayName: 'Kelola Data Penduduk', module: 'penduduk' },
    
    // Pengaduan Permissions
    { name: 'pengaduan.read', displayName: 'Lihat Pengaduan', module: 'pengaduan' },
    { name: 'pengaduan.write', displayName: 'Kelola Pengaduan', module: 'pengaduan' },
    { name: 'pengaduan.respond', displayName: 'Respon Pengaduan', module: 'pengaduan' },
    
    // Berita Permissions
    { name: 'berita.read', displayName: 'Lihat Berita', module: 'berita' },
    { name: 'berita.write', displayName: 'Kelola Berita', module: 'berita' },
    
    // Master Data Permissions
    { name: 'master.dusun.write', displayName: 'Kelola Dusun', module: 'master' },
    { name: 'master.rw.write', displayName: 'Kelola RW', module: 'master' },
    { name: 'master.rt.write', displayName: 'Kelola RT', module: 'master' },
    { name: 'master.user.write', displayName: 'Kelola Pengguna', module: 'master' },
  ]

  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { name: perm.name },
      update: {},
      create: perm,
    })
  }

  // Assign permissions to roles
  const superAdminRole = await prisma.role.findUnique({ where: { name: 'SUPER_ADMIN' } })
  if (superAdminRole) {
    const allPermissions = await prisma.permission.findMany()
    await prisma.role.update({
      where: { id: superAdminRole.id },
      data: {
        permissions: {
          connect: allPermissions.map(p => ({ id: p.id })),
        },
      },
    })
  }

  // ============================================
  // 3. CREATE WILAYAH ADMINISTRATIF
  // ============================================
  console.log('🗺️  Creating wilayah administratif...')

  // Create Dusun
  const dusunA = await prisma.dusun.upsert({
    where: { code: 'DUSUN_A' },
    update: {},
    create: {
      name: 'Dusun A',
      code: 'DUSUN_A',
      description: 'Dusun A - Wilayah Utara',
      headName: 'Bapak Sutrisno',
      headPhone: '081234567890',
    },
  })

  const dusunB = await prisma.dusun.upsert({
    where: { code: 'DUSUN_B' },
    update: {},
    create: {
      name: 'Dusun B',
      code: 'DUSUN_B',
      description: 'Dusun B - Wilayah Selatan',
      headName: 'Bapak Widodo',
      headPhone: '081234567891',
    },
  })

  const dusunC = await prisma.dusun.upsert({
    where: { code: 'DUSUN_C' },
    update: {},
    create: {
      name: 'Dusun C',
      code: 'DUSUN_C',
      description: 'Dusun C - Wilayah Timur',
      headName: 'Bapak Hartono',
      headPhone: '081234567892',
    },
  })

  // Create RW
  const rw01 = await prisma.rw.upsert({
    where: { code: 'RW_01' },
    update: {},
    create: {
      name: 'RW 01',
      code: 'RW_01',
      dusunId: dusunA.id,
    },
  })

  const rw02 = await prisma.rw.upsert({
    where: { code: 'RW_02' },
    update: {},
    create: {
      name: 'RW 02',
      code: 'RW_02',
      dusunId: dusunA.id,
    },
  })

  const rw03 = await prisma.rw.upsert({
    where: { code: 'RW_03' },
    update: {},
    create: {
      name: 'RW 03',
      code: 'RW_03',
      dusunId: dusunB.id,
    },
  })

  const rw04 = await prisma.rw.upsert({
    where: { code: 'RW_04' },
    update: {},
    create: {
      name: 'RW 04',
      code: 'RW_04',
      dusunId: dusunC.id,
    },
  })

  // Create RT
  const rts = []
  for (let i = 1; i <= 10; i++) {
    const rwId = i <= 4 ? rw01.id : i <= 6 ? rw02.id : i <= 8 ? rw03.id : rw04.id
    const rt = await prisma.rt.upsert({
      where: { code: `RT_${String(i).padStart(2, '0')}` },
      update: {},
      create: {
        name: `RT ${String(i).padStart(2, '0')}`,
        code: `RT_${String(i).padStart(2, '0')}`,
        rwId: rwId,
      },
    })
    rts.push(rt)
  }

  // ============================================
  // 4. CREATE USERS
  // ============================================
  console.log('👤 Creating users...')

  const hashedPassword = await hash('admin123', 10)

  // Super Admin
  await prisma.user.upsert({
    where: { username: 'superadmin' },
    update: {},
    create: {
      email: 'superadmin@kasonmalkulon.desa.id',
      username: 'superadmin',
      password: hashedPassword,
      fullName: 'Administrator Desa',
      phone: '081234567800',
      roleId: roles[0].id,
      isActive: true,
    },
  })

  // Admin Desa
  await prisma.user.upsert({
    where: { username: 'admindesa' },
    update: {},
    create: {
      email: 'admin@kasomalkulon.desa.id',
      username: 'admindesa',
      password: hashedPassword,
      fullName: 'Admin Desa Kasomalang Kulon',
      phone: '081234567801',
      roleId: roles[1].id,
      isActive: true,
    },
  })

  // RT Users
  for (let i = 0; i < 5; i++) {
    await prisma.user.upsert({
      where: { username: `rt${String(i + 1).padStart(2, '0')}` },
      update: {},
      create: {
        email: `rt${String(i + 1).padStart(2, '0')}@kasomalkulon.desa.id`,
        username: `rt${String(i + 1).padStart(2, '0')}`,
        password: hashedPassword,
        fullName: `Ketua RT ${String(i + 1).padStart(2, '0')}`,
        phone: `0812345678${String(10 + i)}`,
        roleId: roles[2].id,
        rtId: rts[i].id,
        isActive: true,
      },
    })
  }

  // Kolektor PBB
  const kolektorPbb = await prisma.kolektorPbb.upsert({
    where: { code: 'KOLEKTOR_01' },
    update: {},
    create: {
      name: 'Tim Kolektor PBB 01',
      code: 'KOLEKTOR_01',
      phone: '081234567850',
      areaDesc: 'Wilayah Dusun A',
      isActive: true,
    },
  })

  await prisma.user.upsert({
    where: { username: 'kolektor01' },
    update: {},
    create: {
      email: 'kolektor01@kasomalkulon.desa.id',
      username: 'kolektor01',
      password: hashedPassword,
      fullName: 'Kolektor PBB 01',
      phone: '081234567850',
      roleId: roles[3].id,
      kolektorPbbId: kolektorPbb.id,
      isActive: true,
    },
  })

  // ============================================
  // 5. CREATE PENDUDUK & KELUARGA SAMPLE
  // ============================================
  console.log('👨‍👩‍👧‍👦 Creating sample penduduk and families...')

  const families = []
  for (let i = 0; i < 20; i++) {
    const family = await prisma.keluarga.create({
      data: {
        noKk: `33230420000${String(i + 1).padStart(5, '0')}`,
        address: `Jl. Raya Kasomalang No. ${i + 1}`,
        rtId: rts[i % 10].id,
        postalCode: '33230',
        phone: `0812345679${String(i)}`,
      },
    })
    families.push(family)

    // Kepala Keluarga
    await prisma.penduduk.create({
      data: {
        nik: `332304${i % 2 === 0 ? '01' : '02'}${String(i + 1).padStart(6, '0')}`,
        noKk: family.noKk,
        familyId: family.id,
        fullName: `Penduduk ${i + 1}`,
        birthPlace: 'Indramayu',
        birthDate: new Date(1980 + (i % 20), i % 12, (i % 28) + 1),
        gender: i % 2 === 0 ? Gender.LAKI_LAKI : Gender.PEREMPUAN,
        religion: 'ISLAM',
        education: i % 3 === 0 ? 'SMA' : i % 3 === 1 ? 'S1' : 'SMP',
        occupation: ['Petani', 'Pedagang', 'Karyawan', 'Wiraswasta'][i % 4],
        maritalStatus: StatusPerkawinan.KAWIN,
        isHeadOfFamily: true,
        status: 'ACTIVE',
      },
    })

    // Istri/Suami
    await prisma.penduduk.create({
      data: {
        nik: `332304${i % 2 === 0 ? '02' : '01'}${String(i + 1).padStart(6, '0')}`,
        noKk: family.noKk,
        familyId: family.id,
        fullName: `Pasangan Penduduk ${i + 1}`,
        birthPlace: 'Indramayu',
        birthDate: new Date(1982 + (i % 18), i % 12, (i % 28) + 1),
        gender: i % 2 === 0 ? Gender.PEREMPUAN : Gender.LAKI_LAKI,
        religion: 'ISLAM',
        education: i % 3 === 0 ? 'SMP' : i % 3 === 1 ? 'SMA' : 'S1',
        occupation: ['Ibu Rumah Tangga', 'Petani', 'Guru', 'Pedagang'][i % 4],
        maritalStatus: StatusPerkawinan.KAWIN,
        isHeadOfFamily: false,
        status: 'ACTIVE',
      },
    })

    // Anak
    if (i % 3 !== 0) {
      await prisma.penduduk.create({
        data: {
          nik: `33230403${String(i + 1).padStart(6, '0')}`,
          noKk: family.noKk,
          familyId: family.id,
          fullName: `Anak Penduduk ${i + 1}`,
          birthPlace: 'Indramayu',
          birthDate: new Date(2005 + (i % 10), i % 12, (i % 28) + 1),
          gender: i % 2 === 0 ? Gender.LAKI_LAKI : Gender.PEREMPUAN,
          religion: 'ISLAM',
          education: 'SMA',
          maritalStatus: StatusPerkawinan.BELUM_KAWIN,
          isHeadOfFamily: false,
          status: 'ACTIVE',
        },
      })
    }
  }

  // ============================================
  // 6. CREATE WAJIB PAJAK & PBB RECORDS
  // ============================================
  console.log('💰 Creating wajib pajak and PBB records...')

  const kepalaKeluarga = await prisma.penduduk.findMany({
    where: { isHeadOfFamily: true },
    take: 15,
  })

  for (let i = 0; i < kepalaKeluarga.length; i++) {
    const kk = kepalaKeluarga[i]
    const rt = await prisma.keluarga.findUnique({
      where: { noKk: kk.noKk },
      include: { rt: true },
    })

    const wp = await prisma.wajibPajak.create({
      data: {
        nop: `332304${String(i + 1).padStart(6, '0')}`,
        pendudukId: kk.id,
        rtId: rt!.rtId,
        objectAddress: `Jl. Raya Kasomalang No. ${i + 1}`,
        landArea: 100 + (i * 10),
        buildingArea: 60 + (i * 5),
        njop: 50000000 + (i * 5000000),
        pbbAmount: 150000 + (i * 10000),
      },
    })

    // Create PBB records for years 2020-2026
    for (let year = 2020; year <= 2026; year++) {
      const isPaid = year < 2024 && i % 3 !== 0
      const isPending = year >= 2024 && i % 2 === 0
      
      await prisma.pbb.create({
        data: {
          year,
          wajibPajakId: wp.id,
          spptNo: `SPPT-${wp.nop}-${year}`,
          tagihan: wp.pbbAmount!,
          pokok: wp.pbbAmount! * 0.9,
          denda: isPaid ? 0 : wp.pbbAmount! * 0.1,
          status: isPaid ? 'LUNAS' : isPending ? 'BELUM_BAYAR' : 'MENUNGGAK',
          dueDate: new Date(year, 5, 30),
        },
      })

      // Create payment record if paid or pending
      if (isPaid || isPending) {
        await prisma.pbbPayment.create({
          data: {
            pbbId: `pbb_${year}_${wp.id}`,
            wajibPajakId: wp.id,
            paymentDate: new Date(year, 6, 15),
            amount: wp.pbbAmount!,
            proofImage: `/uploads/bukti-pbb-${wp.nop}-${year}.jpg`,
            status: isPaid ? 'APPROVED' : 'PENDING',
            verifiedBy: isPaid ? 'system' : null,
            verifiedAt: isPaid ? new Date(year, 6, 20) : null,
          },
        })
      }
    }
  }

  // ============================================
  // 7. CREATE SURAT TEMPLATES
  // ============================================
  console.log('📄 Creating surat templates...')

  const suratTemplates = [
    {
      code: 'SKU',
      name: 'Surat Keterangan Usaha',
      type: SuratType.SKU,
      template: 'SURAT KETERANGAN USAHA\n\nYang bertanda tangan di bawah ini...\n\nNama: {{nama}}\nNIK: {{nik}}\nUsaha: {{usaha}}\n...',
      requirements: '["Fotokopi KTP", "Fotokopi KK", "Surat Pengantar RT"]',
      fee: 0,
    },
    {
      code: 'SKT',
      name: 'Surat Keterangan Domisili',
      type: SuratType.SKT,
      template: 'SURAT KETERANGAN DOMISILI\n\nYang bertanda tangan di bawah ini...\n\nNama: {{nama}}\nNIK: {{nik}}\nAlamat: {{alamat}}\n...',
      requirements: '["Fotokopi KTP", "Fotokopi KK", "Surat Pengantar RT"]',
      fee: 0,
    },
    {
      code: 'SKTM',
      name: 'Surat Keterangan Tidak Mampu',
      type: SuratType.SKTM,
      template: 'SURAT KETERANGAN TIDAK MAMPU\n\nYang bertanda tangan di bawah ini...\n\nNama: {{nama}}\nNIK: {{nik}}\n...',
      requirements: '["Fotokopi KTP", "Fotokopi KK", "Surat Keterangan Tidak Mampu dari RT"]',
      fee: 0,
    },
    {
      code: 'PENGANTAR_KTP',
      name: 'Surat Pengantar KTP',
      type: SuratType.PENGANTAR_KTP,
      template: 'SURAT PENGANTAR KTP\n\nYang bertanda tangan di bawah ini...\n\nNama: {{nama}}\nNIK: {{nik}}\n...',
      requirements: '["Fotokopi KK", "Surat Pengantar RT", "Foto Copy KTP Lama"]',
      fee: 0,
    },
    {
      code: 'PENGANTAR_KK',
      name: 'Surat Pengantar KK',
      type: SuratType.PENGANTAR_KK,
      template: 'SURAT PENGANTAR KARTU KELUARGA\n\nYang bertanda tangan di bawah ini...\n\nNama: {{nama}}\nNIK: {{nik}}\n...',
      requirements: '["Fotokopi KTP", "Buku Nikah", "Surat Pengantar RT"]',
      fee: 0,
    },
    {
      code: 'SK_BELUM_MENIKAH',
      name: 'Surat Keterangan Belum Menikah',
      type: SuratType.SK_BELUM_MENIKAH,
      template: 'SURAT KETERANGAN BELUM MENIKAH\n\nYang bertanda tangan di bawah ini...\n\nNama: {{nama}}\nNIK: {{nik}}\n...',
      requirements: '["Fotokopi KTP", "Fotokopi KK", "Surat Pengantar RT"]',
      fee: 0,
    },
    {
      code: 'SK_BEDA_NAMA',
      name: 'Surat Keterangan Beda Nama',
      type: SuratType.SK_BEDA_NAMA,
      template: 'SURAT KETERANGAN BEDA NAMA\n\nYang bertanda tangan di bawah ini...\n\nNama: {{nama}}\nNIK: {{nik}}\n...',
      requirements: '["Fotokopi KTP", "Fotokopi KK", "Dokumen yang menunjukkan perbedaan nama"]',
      fee: 0,
    },
    {
      code: 'SK_KEHILANGAN',
      name: 'Surat Keterangan Kehilangan',
      type: SuratType.SK_KEHILANGAN,
      template: 'SURAT KETERANGAN KEHILANGAN\n\nYang bertanda tangan di bawah ini...\n\nNama: {{nama}}\nNIK: {{nik}}\nBarang Hilang: {{barang}}\n...',
      requirements: '["Fotokopi KTP", "Surat Laporan Polisi", "Surat Pengantar RT"]',
      fee: 0,
    },
    {
      code: 'SK_KELAHIRAN',
      name: 'Surat Keterangan Kelahiran',
      type: SuratType.SK_KELAHIRAN,
      template: 'SURAT KETERANGAN KELAHIRAN\n\nYang bertanda tangan di bawah ini...\n\nNama Bayi: {{nama_bayi}}\nTanggal Lahir: {{tgl_lahir}}\n...',
      requirements: '["Surat Keterangan Lahir dari Bidan/RS", "Fotokopi KTP Orang Tua", "Fotokopi KK", "Buku Nikah"]',
      fee: 0,
    },
    {
      code: 'SK_KEMATIAN',
      name: 'Surat Keterangan Kematian',
      type: SuratType.SK_KEMATIAN,
      template: 'SURAT KETERANGAN KEMATIAN\n\nYang bertanda tangan di bawah ini...\n\nNama Almarhum/Almarhumah: {{nama}}\nTanggal Meninggal: {{tgl_meninggal}}\n...',
      requirements: '["Surat Keterangan Meninggal dari RS/Bidan", "Fotokopi KTP Almarhum", "Fotokopi KK", "Surat Pengantar RT"]',
      fee: 0,
    },
  ]

  for (const template of suratTemplates) {
    await prisma.surat.upsert({
      where: { code: template.code },
      update: {},
      create: template as any,
    })
  }

  // ============================================
  // 8. CREATE BANTUAN SOSIAL
  // ============================================
  console.log('🎁 Creating bantuan sosial programs...')

  const bantuanPrograms = [
    {
      name: 'Program Keluarga Harapan 2024',
      type: BantuanType.PKH,
      year: 2024,
      description: 'Bantuan sosial untuk keluarga kurang mampu',
      quota: 100,
      budget: 3000000,
      startDate: new Date(2024, 0, 1),
      endDate: new Date(2024, 11, 31),
      status: 'ACTIVE',
    },
    {
      name: 'Bantuan Pangan Non Tunai 2024',
      type: BantuanType.BPNT,
      year: 2024,
      description: 'Bantuan pangan untuk keluarga penerima manfaat',
      quota: 150,
      budget: 1200000,
      startDate: new Date(2024, 0, 1),
      endDate: new Date(2024, 11, 31),
      status: 'ACTIVE',
    },
    {
      name: 'Bantuan Langsung Tunai 2024',
      type: BantuanType.BLT,
      year: 2024,
      description: 'Bantuan langsung tunai untuk masyarakat terdampak',
      quota: 200,
      budget: 600000,
      startDate: new Date(2024, 0, 1),
      endDate: new Date(2024, 11, 31),
      status: 'ACTIVE',
    },
    {
      name: 'Renovasi Rumah Tidak Layak Huni 2024',
      type: BantuanType.RUTILAHU,
      year: 2024,
      description: 'Program renovasi rumah tidak layak huni',
      quota: 20,
      budget: 20000000,
      startDate: new Date(2024, 0, 1),
      endDate: new Date(2024, 11, 31),
      status: 'ACTIVE',
    },
  ]

  for (const program of bantuanPrograms) {
    await prisma.bantuanSosial.create({
      data: program as any,
    })
  }

  // ============================================
  // 9. CREATE BERITA SAMPLE
  // ============================================
  console.log('📰 Creating sample news...')

  const beritaSamples = [
    {
      title: 'Pembangunan Jalan Desa Tahap II Dimulai',
      slug: 'pembangunan-jalan-desa-tahap-ii-dimulai',
      content: 'Pemerintah Desa Kasomalang Kulon memulai pembangunan jalan desa tahap II yang menghubungkan Dusun A dengan Dusun B...',
      excerpt: 'Pembangunan jalan desa tahap II dimulai untuk meningkatkan konektivitas antar dusun.',
      category: 'BERITA',
      isPublished: true,
      publishedAt: new Date(),
    },
    {
      title: 'Penyaluran BLT Bulan Januari 2024',
      slug: 'penyaluran-blt-bulan-januari-2024',
      content: 'Penyaluran Bantuan Langsung Tunai (BLT) bulan Januari 2024 akan dilaksanakan pada tanggal 15-20 Januari 2024...',
      excerpt: 'Jadwal penyaluran BLT bulan Januari 2024 untuk seluruh penerima manfaat.',
      category: 'PENGUMUMAN',
      isPublished: true,
      publishedAt: new Date(),
    },
    {
      title: 'Musyawarah Perencanaan Pembangunan Desa 2024',
      slug: 'musyawarah-perencanaan-pembangunan-desa-2024',
      content: 'Musrenbangdes 2024 akan dilaksanakan pada tanggal 25 Januari 2024 di Balai Desa Kasomalang Kulon...',
      excerpt: 'Undangan terbuka untuk seluruh masyarakat dalam Musrenbangdes 2024.',
      category: 'AGENDA',
      isPublished: true,
      publishedAt: new Date(),
    },
  ]

  const adminUser = await prisma.user.findFirst({ where: { username: 'superadmin' } })

  for (const berita of beritaSamples) {
    await prisma.berita.create({
      data: {
        ...berita,
        authorId: adminUser!.id,
        thumbnail: '/uploads/berita/sample.jpg',
      },
    })
  }

  // ============================================
  // 10. CREATE PROFIL DESA
  // ============================================
  console.log('🏛️  Creating profil desa...')

  const profilDesaData = [
    { key: 'nama_desa', value: 'Kasomalang Kulon', category: 'IDENTITAS' },
    { key: 'kode_desa', value: '3323042001', category: 'IDENTITAS' },
    { key: 'kecamatan', value: 'Kasomalang', category: 'IDENTITAS' },
    { key: 'kabupaten', value: 'Indramayu', category: 'IDENTITAS' },
    { key: 'provinsi', value: 'Jawa Barat', category: 'IDENTITAS' },
    { key: 'alamat_balai_desa', value: 'Jl. Raya Kasomalang No. 1, Kasomalang Kulon', category: 'KONTAK' },
    { key: 'telepon', value: '0234-123456', category: 'KONTAK' },
    { key: 'email', value: 'info@kasomalkulon.desa.id', category: 'KONTAK' },
    { key: 'website', value: 'https://kasomalkulon.desa.id', category: 'KONTAK' },
    { key: 'kepala_desa', value: 'Drs. H. Ahmad Fauzi', category: 'PEMERINTAHAN' },
    { key: 'sekretaris_desa', value: 'Siti Nurhaliza, S.IP', category: 'PEMERINTAHAN' },
    { key: 'luas_wilayah', value: '450 Ha', category: 'GEOGRAFIS' },
    { key: 'jumlah_dusun', value: '3', category: 'STATISTIK' },
    { key: 'jumlah_rw', value: '4', category: 'STATISTIK' },
    { key: 'jumlah_rt', value: '10', category: 'STATISTIK' },
    { key: 'visi_desa', value: 'Terwujudnya Desa Kasomalang Kulon yang Maju, Mandiri, dan Sejahtera', category: 'VISI_MISI' },
    { key: 'misi_desa', value: '1. Meningkatkan pelayanan publik\n2. Membangun infrastruktur desa\n3. Memberdayakan ekonomi masyarakat\n4. Meningkatkan kualitas SDM', category: 'VISI_MISI' },
  ]

  for (const profil of profilDesaData) {
    await prisma.profilDesa.upsert({
      where: { key: profil.key },
      update: {},
      create: profil,
    })
  }

  console.log('✅ Database seeding completed successfully!')
  console.log('\n📊 Summary:')
  console.log(`   - Roles: ${roles.length}`)
  console.log(`   - Permissions: ${permissions.length}`)
  console.log(`   - Dusun: 3`)
  console.log(`   - RW: 4`)
  console.log(`   - RT: 10`)
  console.log(`   - Users: 7 (1 Super Admin, 1 Admin Desa, 5 RT, 1 Kolektor)`)
  console.log(`   - Families: 20`)
  console.log(`   - Penduduk: ~50`)
  console.log(`   - Wajib Pajak: 15`)
  console.log(`   - PBB Records: 105 (15 WP × 7 tahun)`)
  console.log(`   - Surat Templates: 10`)
  console.log(`   - Bantuan Sosial Programs: 4`)
  console.log(`   - Berita: 3`)
  console.log('\n🔑 Default credentials for all users: admin123')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
