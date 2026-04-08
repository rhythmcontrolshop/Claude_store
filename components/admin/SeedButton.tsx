'use client'
// components/admin/SeedButton.tsx
// Solo visible en desarrollo. Inserta / limpia datos de muestra en Supabase.

import { useState } from 'react'

export default function SeedButton() {
  const [loading, setLoading] = useState(false)
  const [msg,     setMsg]     = useState<string | null>(null)
  const [isError, setIsError] = useState(false)

  async function handleSeed() {
    setLoading(true)
    setMsg(null)
    setIsError(false)

    const res  = await fetch('/api/admin/seed', { method: 'POST' })
    const data = await res.json()

    if (res.ok) {
      setMsg(`✓ ${data.inserted} discos de muestra insertados`)
    } else {
      setMsg(data.error ?? 'Error al insertar datos')
      setIsError(true)
    }
    setLoading(false)
  }

  async function handleClear() {
    setLoading(true)
    setMsg(null)

    const res  = await fetch('/api/admin/seed', { method: 'DELETE' })
    const data = await res.json()

    setMsg(res.ok ? '✓ Datos de muestra eliminados' : (data.error ?? 'Error'))
    setIsError(!res.ok)
    setLoading(false)
  }

  return (
    <div style={{ border: 'var(--rc-border-main)' }}>
      <div className="p-4" style={{ borderBottom: 'var(--rc-border-card)' }}>
        <p className="font-meta text-xs" style={{ color: 'var(--rc-color-accent)' }}>
          MODO DESARROLLO — DATOS DE MUESTRA
        </p>
        <p className="font-meta text-xs mt-1" style={{ color: 'var(--rc-color-muted)' }}>
          Inserta 10 discos ficticios en Supabase para probar el catálogo
        </p>
      </div>

      <div className="p-4 flex gap-3 flex-wrap">
        <button
          onClick={handleSeed}
          disabled={loading}
          className="font-display text-xs px-4 py-2 transition-colors disabled:opacity-40"
          style={{ backgroundColor: 'var(--rc-color-accent)', color: 'var(--rc-color-bg)' }}
        >
          {loading ? '...' : 'INSERTAR MUESTRA'}
        </button>

        <button
          onClick={handleClear}
          disabled={loading}
          className="font-display text-xs px-4 py-2 transition-colors disabled:opacity-40 hover:bg-white hover:text-black"
          style={{ border: 'var(--rc-border-main)', color: 'var(--rc-color-text)' }}
        >
          LIMPIAR
        </button>
      </div>

      {msg && (
        <p
          className="px-4 pb-4 font-meta text-xs"
          style={{ color: isError ? '#f87171' : 'var(--rc-color-accent)' }}
        >
          {msg}
        </p>
      )}
    </div>
  )
}
