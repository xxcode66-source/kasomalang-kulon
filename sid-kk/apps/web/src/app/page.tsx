export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Sistem Informasi Desa
              <span className="block text-green-600">Kasomalang Kulon</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Portal resmi Pemerintah Desa Kasomalang Kulon, Kecamatan Kasomalang, Kabupaten Indramayu.
              Melayani masyarakat dengan transparan, cepat, dan akuntabel.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/layanan"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 md:text-lg"
              >
                Layanan Online
              </a>
              <a
                href="/cek-pbb"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 md:text-lg"
              >
                Cek PBB
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Statistik Desa */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Statistik Desa</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="text-4xl font-bold text-blue-600 mb-2">2,450</div>
              <div className="text-gray-600">Total Penduduk</div>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="text-4xl font-bold text-green-600 mb-2">680</div>
              <div className="text-gray-600">Kepala Keluarga</div>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <div className="text-4xl font-bold text-purple-600 mb-2">3</div>
              <div className="text-gray-600">Dusun</div>
            </div>
            <div className="text-center p-6 bg-orange-50 rounded-lg">
              <div className="text-4xl font-bold text-orange-600 mb-2">10</div>
              <div className="text-gray-600">RT</div>
            </div>
          </div>
        </div>
      </section>

      {/* Layanan Utama */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Layanan Online</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Surat Menyurat</h3>
              <p className="text-gray-600 mb-4">Pengajuan surat online tanpa perlu datang ke kantor desa.</p>
              <a href="/layanan-surat" className="text-green-600 hover:text-green-700 font-medium">
                Ajukan Surat →
              </a>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 36v-3m-3 3h.01M9 17h.01M9 21h.01M9 5h.01M12 21h.01M15 17h.01M15 21h.01M18 17h.01M18 21h.01M3 10a7 7 0 1114 0 7 7 0 01-14 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Cek PBB</h3>
              <p className="text-gray-600 mb-4">Cek status pembayaran PBB Anda dengan mudah.</p>
              <a href="/cek-pbb" className="text-blue-600 hover:text-blue-700 font-medium">
                Cek Sekarang →
              </a>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Pengaduan</h3>
              <p className="text-gray-600 mb-4">Sampaikan pengaduan Anda untuk kemajuan desa.</p>
              <a href="/pengaduan" className="text-purple-600 hover:text-purple-700 font-medium">
                Buat Pengaduan →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Desa Kasomalang Kulon</h3>
              <p className="text-gray-400">
                Jl. Raya Kasomalang No. 1<br />
                Kasomalang Kulon, Kasomalang<br />
                Indramayu, Jawa Barat 33230
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Kontak</h3>
              <p className="text-gray-400">
                Telp: 0234-123456<br />
                Email: info@kasomalkulon.desa.id
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Jam Pelayanan</h3>
              <p className="text-gray-400">
                Senin - Jumat: 08.00 - 16.00 WIB<br />
                Sabtu - Minggu: Tutup
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2024 Pemerintah Desa Kasomalang Kulon. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
