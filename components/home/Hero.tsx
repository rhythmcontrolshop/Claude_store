'use client'
// components/home/Hero.tsx
// Hero de 200px: tres tabs (Top Sellers, Mix del Mes, Eventos) + marquee.

import { useState } from 'react'
import Image from 'next/image'
import RecordModal    from '@/components/store/RecordModal'
import FloatingPlayer from '@/components/store/FloatingPlayer'
import type { Release, PlayerTrack } from '@/types'

type HeroTab = 'sellers' | 'mix' | 'events'

// ── Mock data ──────────────────────────────────────────────────────────────────

const MOCK_EVENTS = [
  { id: 'e1', date: 'ABR 18', title: 'RHYTHM CONTROL × MOOG',  venue: 'Moog Club',  city: 'Barcelona', flyer_url: null },
  { id: 'e2', date: 'ABR 25', title: 'DEEP FACTORY VOL.12',    venue: 'Sala Apolo', city: 'Barcelona', flyer_url: null },
  { id: 'e3', date: 'MAY 03', title: 'TECHNO MARATHON',        venue: 'Nitsa Club', city: 'Barcelona', flyer_url: null },
]

const MIX = {
  // Reemplazar con URL real de Mixcloud cuando esté disponible
  embed: 'https://www.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&autoplay=0&feed=%2Frhythmcontrolshop%2F',
  dj:       'RC SELECTOR',
  subtitle: 'Selección mensual — Abril 2026',
  tracklist: 'Strings of Life · Move Your Body · Pacific State · I Feel Love · Da Funk · Can You Feel It · Promised Land · Supernature · So What · Mystery of Love',
}

// ── TopSellersContent ──────────────────────────────────────────────────────────

function TopSellersContent({
  releases,
  onSelect,
}: {
  releases: Release[]
  onSelect: (r: Release) => void
}) {
  return (
    <div
      style={{
        display:    'flex',
        alignItems: 'center',
        gap:        '6px',
        padding:    '8px',
        height:     '100%',
        overflowX:  'auto',
        overflowY:  'hidden',
      }}
    >
      {releases.map(release => (
        <button
          key={release.discogs_listing_id}
          onClick={() => onSelect(release)}
          style={{
            position:        'relative',
            flexShrink:      0,
            width:           '130px',
            height:          '130px',
            border:          '1px solid #1C1C1C',
            overflow:        'hidden',
            cursor:          'pointer',
            backgroundColor: '#1C1C1C',
            padding:         0,
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#F0E040' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#1C1C1C' }}
        >
          {release.cover_image ? (
            <Image
              src={release.cover_image}
              alt={release.title}
              fill
              style={{ objectFit: 'cover' }}
              sizes="130px"
            />
          ) : (
            <div style={{ width: '100%', height: '100%', backgroundColor: '#1C1C1C' }} />
          )}
          {/* Price overlay */}
          <div
            style={{
              position:        'absolute',
              bottom:          0,
              left:            0,
              right:           0,
              backgroundColor: 'rgba(0,0,0,0.8)',
              padding:         '3px 6px',
            }}
          >
            <p
              className="font-meta"
              style={{
                color:          '#F0E040',
                fontSize:       '0.6rem',
                letterSpacing:  '0.05em',
                whiteSpace:     'nowrap',
                overflow:       'hidden',
                textOverflow:   'ellipsis',
                margin:         0,
              }}
            >
              {release.price.toFixed(0)}€ · {release.condition}
            </p>
          </div>
        </button>
      ))}
    </div>
  )
}

// ── MixContent ─────────────────────────────────────────────────────────────────

function MixContent() {
  return (
    <div style={{ display: 'flex', height: '100%' }}>
      {/* Mixcloud iframe */}
      <div
        style={{
          width:       '160px',
          flexShrink:  0,
          borderRight: '1px solid #1C1C1C',
          overflow:    'hidden',
        }}
      >
        <iframe
          title="Mix del Mes — Abril 2026"
          src={MIX.embed}
          width="160"
          height="100%"
          style={{ border: 'none', display: 'block', backgroundColor: '#000' }}
          allow="autoplay"
        />
      </div>

      {/* DJ info */}
      <div
        style={{
          flex:           1,
          padding:        '16px 14px',
          display:        'flex',
          flexDirection:  'column',
          justifyContent: 'center',
          overflow:       'hidden',
        }}
      >
        <p
          className="font-display"
          style={{ color: '#F0E040', fontSize: '0.6rem', marginBottom: '8px' }}
        >
          MIX DEL MES
        </p>
        <p
          className="font-display"
          style={{ color: '#FFFFFF', fontSize: '1rem', marginBottom: '4px' }}
        >
          {MIX.dj}
        </p>
        <p
          className="font-meta"
          style={{ color: '#FFFFFF', fontSize: '0.6rem', opacity: 0.5, marginTop: '4px' }}
        >
          {MIX.subtitle}
        </p>
      </div>
    </div>
  )
}

// ── EventsContent ──────────────────────────────────────────────────────────────

function EventsContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {MOCK_EVENTS.map((event, i) => (
        <div
          key={event.id}
          style={{
            flex:         1,
            display:      'flex',
            alignItems:   'center',
            padding:      '0 16px',
            gap:          '16px',
            borderBottom: i < MOCK_EVENTS.length - 1 ? '1px solid #1C1C1C' : 'none',
          }}
        >
          {/* Date */}
          <span
            className="font-display"
            style={{ color: '#F0E040', fontSize: '0.65rem', flexShrink: 0, width: '52px' }}
          >
            {event.date}
          </span>

          {/* Title + venue */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <p
              className="font-display"
              style={{
                color:        '#FFFFFF',
                fontSize:     '0.75rem',
                whiteSpace:   'nowrap',
                overflow:     'hidden',
                textOverflow: 'ellipsis',
                margin:       0,
              }}
            >
              {event.title}
            </p>
            <p
              className="font-meta"
              style={{ color: '#FFFFFF', fontSize: '0.6rem', opacity: 0.5, marginTop: '3px' }}
            >
              {event.venue} — {event.city}
            </p>
          </div>

          {/* Flyer button (solo si hay URL) */}
          {event.flyer_url && (
            <button
              className="font-display"
              style={{
                color:           '#F0E040',
                fontSize:        '0.6rem',
                flexShrink:      0,
                cursor:          'pointer',
                backgroundColor: 'transparent',
                border:          '1px solid #F0E040',
                padding:         '3px 8px',
              }}
            >
              FLYER
            </button>
          )}
        </div>
      ))}
    </div>
  )
}

// ── Hero ───────────────────────────────────────────────────────────────────────

interface HeroProps {
  releases: Release[]
}

export default function Hero({ releases }: HeroProps) {
  const [tab,       setTab]       = useState<HeroTab>('sellers')
  const [selected,  setSelected]  = useState<Release | null>(null)
  const [track,     setTrack]     = useState<PlayerTrack | null>(null)
  const [clipIndex, setClipIndex] = useState(1)

  // Top sellers: ordenados por precio descendente
  const topSellers = [...releases]
    .sort((a, b) => b.price - a.price)
    .slice(0, 8)

  const handlePlay = (t: PlayerTrack, clip: number) => {
    setTrack(t)
    setClipIndex(clip)
  }

  // Marquee text cambia según tab activo
  const marqueeText =
    tab === 'sellers'
      ? topSellers.map(r => `${r.artists[0]} — ${r.title}`).join(' · ')
      : tab === 'mix'
      ? MIX.tracklist
      : MOCK_EVENTS.map(e => `${e.date} · ${e.title} · ${e.venue}`).join(' — ')

  const TABS: { id: HeroTab; label: string }[] = [
    { id: 'sellers', label: 'TOP SELLERS'           },
    { id: 'mix',     label: 'MIX DEL MES ABRIL 26'  },
    { id: 'events',  label: 'EVENTOS'               },
  ]

  return (
    <>
      <div
        style={{
          height:          '200px',
          borderBottom:    '2px solid #FFFFFF',
          display:         'flex',
          overflow:        'hidden',
          backgroundColor: '#000000',
        }}
      >
        {/* LEFT: marquee strip + contenido */}
        <div
          style={{
            flex:          1,
            overflow:      'hidden',
            display:       'flex',
            flexDirection: 'column',
            minWidth:      0,
          }}
        >
          {/* Marquee */}
          <div
            className="marquee"
            style={{
              height:          '28px',
              borderBottom:    '1px solid #1C1C1C',
              display:         'flex',
              alignItems:      'center',
              backgroundColor: '#000000',
              flexShrink:      0,
            }}
          >
            <span
              className="marquee-content font-display"
              style={{ color: '#F0E040', fontSize: '0.62rem', letterSpacing: '0.1em' }}
            >
              {marqueeText}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{marqueeText}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </span>
          </div>

          {/* Contenido del tab */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            {tab === 'sellers' && <TopSellersContent releases={topSellers} onSelect={setSelected} />}
            {tab === 'mix'     && <MixContent />}
            {tab === 'events'  && <EventsContent />}
          </div>
        </div>

        {/* RIGHT: tabs verticales */}
        <div
          style={{
            borderLeft:    '1px solid #1C1C1C',
            display:       'flex',
            flexDirection: 'column',
            flexShrink:    0,
            width:         '48px',
          }}
        >
          {TABS.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                flex:            1,
                borderBottom:    i < TABS.length - 1 ? '1px solid #1C1C1C' : 'none',
                borderTop:       'none',
                borderLeft:      'none',
                borderRight:     'none',
                backgroundColor: tab === t.id ? '#F0E040' : '#000000',
                color:           tab === t.id ? '#000000' : '#FFFFFF',
                cursor:          'pointer',
                transition:      'background-color 0.15s, color 0.15s',
                writingMode:     'vertical-rl',
                fontFamily:      'var(--rc-font-display)',
                fontWeight:      700,
                fontSize:        '0.58rem',
                letterSpacing:   '0.1em',
                textTransform:   'uppercase',
                padding:         '8px 0',
              }}
              onMouseEnter={e => {
                if (tab !== t.id) e.currentTarget.style.backgroundColor = '#1C1C1C'
              }}
              onMouseLeave={e => {
                if (tab !== t.id) e.currentTarget.style.backgroundColor = '#000000'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Modal abierto desde el Hero */}
      {selected && (
        <RecordModal
          release={selected}
          releases={releases}
          onClose={() => setSelected(null)}
          onPlay={handlePlay}
          onSelect={setSelected}
        />
      )}

      {/* Player del Hero */}
      {track && (
        <FloatingPlayer
          track={track}
          clipIndex={clipIndex}
          onClose={() => setTrack(null)}
        />
      )}
    </>
  )
}
