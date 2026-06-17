'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function PengaduanPage() {
  const [formData, setFormData] = useState({
    nama: '',
    nik: '',
    email: '',
    telepon: '',
    kategori: '',
    judul: '',
    isi: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
        <div className="max-w-3xl mx-auto px-4">
          <Link href="/pengaduan" className="text-purple-600 hover:text-purple-700 mb-4 inline-block">
            ← Kembali
          </Link>
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Pengaduan Terkirim!</h2>
            <p className="text-gray-600 mb-6">Terima kasih. Tim kami akan menindaklanjuti pengaduan Anda.</p>
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Nomor Pengaduan:</strong> ADU-{Math.random().toString(36).substr(2, 8).toUpperCase()}
              </p>
            </div>
            <button
              onClick={() => {
                setSubmitted(false)
                setFormData({ nama: '', nik: '', email: '', telepon: '', kategori: '', judul: '', isi: '' })
              }}
              className="bg-purple-600 text-white py-2 px-6 rounded-md hover:bg-purple-700"
            >
              Buat Pengaduan Lain
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="max-w-3xl mx-auto px-4">
        <Link href="/" className="text-purple-600 hover:text-purple-700 mb-8 inline-block">
          ← Kembali ke Beranda
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Pengaduan Masyarakat</h1>

        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                <input type="text" name="nama" value={formData.nama} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">NIK</label>
                <input type="text" name="nik" value={formData.nik} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telepon</label>
                <input type="tel" name="telepon" value={formData.telepon} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500" />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Kategori Pengaduan</label>
              <select name="kategori" value={formData.kategori} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500">
                <option value="">Pilih Kategori</option>
                <option value="infrastruktur">Infrastruktur</option>
                <option value="pelayanan">Pelayanan Publik</option>
                <option value="keamanan">Keamanan</option>
                <option value="kesehatan">Kesehatan</option>
                <option value="lingkungan">Lingkungan</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Judul Pengaduan</label>
              <input type="text" name="judul" value={formData.judul} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500" />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Isi Pengaduan</label>
              <textarea name="isi" value={formData.isi} onChange={handleInputChange} required rows={5} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500" />
            </div>

            <button type="submit" className="w-full bg-purple-600 text-white py-3 rounded-md font-medium hover:bg-purple-700">
              Kirim Pengaduan
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
