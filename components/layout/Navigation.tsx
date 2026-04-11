'use client'
// components/layout/Navigation.tsx
// Logo izquierda + menú inline. Mobile: logo centrado + menú debajo.

import Link from 'next/link'
import Image from 'next/image'

const NAV_LINKS = [
  { href: '/novedades', label: 'NOVEDADES' },
  { href: '/',          label: 'CATÁLOGO'  },
  { href: '/contacto',  label: 'CONTACTO'  },
]

export default function Navigation() {
  return (
    <header style={{ backgroundColor: '#000000', borderBottom: '2px solid #FFFFFF' }}>

      {/* ── Desktop: logo + nav en una línea ── */}
      <div
        className="hidden md:flex items-center justify-between"
        style={{ height: '80px', padding: '0 24px' }}
      >
        <Link href="/" style={{ display: 'flex', alignItems: 'center', height: '56px' }}>
          <Image
            src="/logo.svg"
            alt="Rhythm Control"
            width={280}
            height={56}
            style={{ objectFit: 'contain' }}
            priority
          />
        </Link>

        <nav className="flex items-center gap-8">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="font-display text-xs transition-opacity hover:opacity-60"
              style={{ color: '#FFFFFF' }}
            >
              {label}
            </Link>
          ))}
          <CartButton />
        </nav>
      </div>

      {/* ── Mobile: logo centrado + menú debajo ── */}
      <div className="md:hidden">
        <div className="flex items-center justify-center" style={{ height: '60px' }}>
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="Rhythm Control"
              width={200}
              height={44}
              style={{ objectFit: 'contain' }}
              priority
            />
          </Link>
        </div>

        <nav
          className="flex items-center justify-center gap-6"
          style={{ borderTop: '1px solid #1C1C1C', padding: '10px 16px' }}
        >
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="font-display text-xs"
              style={{ color: '#FFFFFF' }}
            >
              {label}
            </Link>
          ))}
          <CartButton />
        </nav>
      </div>

    </header>
  )
}

function CartButton() {
  return (
    <button
      className="flex items-center gap-2 font-display text-xs transition-opacity hover:opacity-60"
      style={{ color: '#FFFFFF' }}
      aria-label="Carrito"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>
      CARRITO <span style={{ color: '#F0E040' }}>(0)</span>
    </button>
  )
}
