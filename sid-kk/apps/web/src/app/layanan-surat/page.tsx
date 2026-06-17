'use client'

import { useState } from 'react'
import Link from 'next/link'

const jenisSurat = [
  { id: 1, nama: 'Surat Keterangan Usaha', icon: '💼', persyaratan: ['KTP', 'KK', 'Surat Pengantar RT/RW'] },
  { id: 2, nama: 'Surat Tidak Mampu', icon: '📋', persyaratan: ['KTP', 'KK', 'Surat Pengantar RT/RW'] },
  { id: 3, nama: 'Surat Domisili', icon: '🏠', persyaratan: ['KTP', 'KK', 'Surat Pengantar RT/RW'] },
  { id: 4, nama: 'Surat Kelahiran', icon: '👶', persyaratan: ['KTP Orang Tua', 'KK', 'Buku Nikah'] },
  { id: 5, nama: 'Surat Kematian', icon: '🕊️', persyaratan: ['KTP Pelapor', 'KK', 'Surat Keterangan'] },
  { id: 6, nama: 'Surat Pengantar SKCK', icon: '📄', persyaratan: ['KTP', 'KK', 'Pas Foto 3x4'] },
]

export default function LayananSuratPage() {
  const [selectedSurat, setSelectedSurat] = useState<any>(null)
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
        <div className="max-w-3xl mx-auto px-4">
          <Link href="/layanan-surat" className="text-green-600 hover:text-green-700 mb-4 inline-block">
            ← Kembali
          </Link>
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Permohonan Terkirim!</h2>
            <p className="text-gray-600 mb-6">Tim kami akan memproses permohonan surat Anda.</p>
            <button onClick={() => setSubmitted(false)} className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700">
              Buat Permohonan Lain
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Link href="/" className="text-green-600 hover:text-green-700 mb-8 inline-block">
          ← Kembali ke Beranda
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Layanan Surat Menyurat</h1>

        <div className="grid md:grid-cols-2 gap-6">
          {jenisSurat.map((surat) => (
            <div key={surat.id} className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-all" onClick={() => setSelectedSurat(surat)}>
              <div className="text-3xl mb-2">{surat.icon}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{surat.nama}</h3>
              <div className="text-green-600 font-medium text-sm">Lihat Detail →</div>
            </div>
          ))}
        </div>

        {selectedSurat && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
              <h2 className="text-2xl font-bold mb-4">{selectedSurat.nama}</h2>
              <h3 className="font-semibold mb-2">Persyaratan:</h3>
              <ul className="list-disc list-inside mb-6 space-y-1">
                {selectedSurat.persyaratan.map((p: string, i: number) => (
                  <li key={i} className="text-gray-700">{p}</li>
                ))}
              </ul>
              <div className="flex gap-4">
                <button onClick={() => setSelectedSurat(null)} className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                  Tutup
                </button>
                <button onClick={() => setSubmitted(true)} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                  Ajukan Permohonan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
