import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SID-KK - Sistem Informasi Desa Kasomalang Kulon',
  description: 'Portal resmi Pemerintah Desa Kasomalang Kulon, Kecamatan Kasomalang, Kabupaten Indramayu',
  keywords: 'desa, kasomalang kulon, indramayu, sistem informasi desa, pbb, surat online',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
