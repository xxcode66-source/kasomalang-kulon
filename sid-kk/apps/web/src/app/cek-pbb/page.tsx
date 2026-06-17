'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function CekPbbPage() {
  const [nop, setNop] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleCekPBB = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    setTimeout(() => {
      setResult({
        nop: nop,
        nama: 'Contoh Pemilik Tanah',
        alamat: 'Jl. Contoh No. 123, Desa Kasomalang Kulon',
        nilaiTanah: 150000000,
        nilaiBuilding: 100000000,
        statusPajak: 'Lunas',
        tahunTerakhir: new Date().getFullYear(),
      })
      setLoading(false)
    }, 1500)
  }

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(num)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="max-w-3xl mx-auto px-4">
        <Link href="/" className="text-blue-600 hover:text-blue-700 mb-8 inline-block">
          ← Kembali ke Beranda
        </Link>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cek PBB Online</h1>
          <p className="text-gray-600 mb-8">Masukkan Nomor Objek Pajak (NOP) untuk melihat status pembayaran PBB Anda</p>

          <form onSubmit={handleCekPBB} className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Objek Pajak (NOP)</label>
            <div className="flex gap-3">
              <input
                type="text"
                value={nop}
                onChange={(e) => setNop(e.target.value)}
                placeholder="Contoh: 12.34.567.890.12345"
                required
                className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Mencari...' : 'Cek'}
              </button>
            </div>
          </form>

          {result && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Hasil Cek PBB</h2>
              <div className="space-y-3 text-gray-700">
                <p><span className="font-semibold">NOP:</span> {result.nop}</p>
                <p><span className="font-semibold">Nama Pemilik:</span> {result.nama}</p>
                <p><span className="font-semibold">Alamat:</span> {result.alamat}</p>
                <p><span className="font-semibold">Nilai Tanah:</span> {formatCurrency(result.nilaiTanah)}</p>
                <p><span className="font-semibold">Nilai Bangunan:</span> {formatCurrency(result.nilaiBuilding)}</p>
                <p><span className="font-semibold">Status Pajak:</span> <span className="text-green-600 font-bold">{result.statusPajak}</span></p>
                <p><span className="font-semibold">Tahun Terakhir:</span> {result.tahunTerakhir}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
