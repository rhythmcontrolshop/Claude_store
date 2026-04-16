'use client'

import Link from 'next/link'

export function StatCard({ label, value, href }: { label: string; value: string | number; href: string }) {
  return (
    <Link href={href} className="block p-4 transition-colors duration-200"
      style={{ border: '2px solid #FFFFFF', textDecoration: 'none' }}
      onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#1a1a1a' }}
      onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}>
      <p className="font-meta text-xs mb-2" style={{ color: '#FFFFFF' }}>{label}</p>
      <p className="font-display text-2xl" style={{ color: '#F0E040' }}>{value}</p>
    </Link>
  )
}

export function QuickLink({ href, label, external = false }: { href: string; label: string; external?: boolean }) {
  return (
    <Link href={href} target={external ? '_blank' : undefined}
      className="font-display text-xs px-5 py-3 text-center tracking-widest transition-colors duration-200"
      style={{
        border: '2px solid #000000',
        color: '#000000',
        backgroundColor: '#FFFFFF',
        textDecoration: 'none',
      }}
      onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F0E040' }}
      onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#FFFFFF' }}>
      {label}
    </Link>
  )
}

export function OrderRow({ order }: { order: any }) {
  return (
    <Link href="/cuenta/pedidos" className="block">
      <div className="flex items-center justify-between p-4 transition-colors duration-200"
        style={{ border: '2px solid #FFFFFF' }}
        onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#1a1a1a' }}
        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}>
        <div>
          <p className="font-display text-sm" style={{ color: '#FFFFFF' }}>{order.order_number || order.id.slice(0, 8)}</p>
          <p className="font-meta text-xs" style={{ color: '#999' }}>{new Date(order.created_at).toLocaleDateString('es-ES')}</p>
        </div>
        <div className="text-right">
          <p className="font-display text-sm" style={{ color: '#FFFFFF' }}>{Number(order.total).toFixed(2)} €</p>
        </div>
      </div>
    </Link>
  )
}
