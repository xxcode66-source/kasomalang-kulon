import Link from 'next/link'

export default function LayananPage() {
  const layanan = [
    { id: 1, judul: 'Surat Menyurat', desc: 'Ajukan surat administrasi', link: '/layanan-surat', color: 'green' },
    { id: 2, judul: 'Cek PBB', desc: 'Cek status pembayaran PBB', link: '/cek-pbb', color: 'blue' },
    { id: 3, judul: 'Pengaduan', desc: 'Sampaikan pengaduan Anda', link: '/pengaduan', color: 'purple' },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <Link href="/" className="text-green-600 hover:text-green-700 mb-8 inline-block">
          ← Kembali ke Beranda
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Layanan Online</h1>
        <p className="text-xl text-gray-600 mb-12">Pemerintah Desa Kasomalang Kulon menyediakan berbagai layanan online untuk memudahkan masyarakat</p>

        <div className="grid md:grid-cols-3 gap-6">
          {layanan.map((item) => (
            <Link key={item.id} href={item.link}>
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all cursor-pointer">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.judul}</h3>
                <p className="text-gray-600 mb-4">{item.desc}</p>
                <div className={`text-${item.color}-600 font-medium`}>Buka Layanan →</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
