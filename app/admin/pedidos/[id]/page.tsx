'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending:    { label: 'PENDIENTE',   color: '#f59e0b' },
  paid:       { label: 'PAGADO',      color: '#22c55e' },
  confirmed:  { label: 'CONFIRMADO',  color: '#22c55e' },
  processing: { label: 'PREPARANDO',  color: '#3b82f6' },
  shipped:    { label: 'ENVIADO',     color: '#8b5cf6' },
  delivered:  { label: 'ENTREGADO',   color: '#10b981' },
  collected:  { label: 'RECOGIDO',    color: '#10b981' },
  cancelled:  { label: 'CANCELADO',   color: '#ef4444' },
  refunded:   { label: 'REEMBOLSADO', color: '#9ca3af' },
}

const NEXT_STATUS: Record<string, { value: string; label: string }[]> = {
  pending:    [{ value: 'confirmed', label: 'CONFIRMAR' }],
  paid:       [{ value: 'confirmed', label: 'CONFIRMAR' }, { value: 'processing', label: 'PREPARAR' }],
  confirmed:  [{ value: 'processing', label: 'PREPARAR' }, { value: 'collected', label: 'RECOGIDO' }],
  processing: [{ value: 'shipped', label: 'ENVIAR' }, { value: 'collected', label: 'RECOGIDO' }],
  shipped:    [{ value: 'delivered', label: 'ENTREGADO' }],
}

interface OrderItem { id: string; release_id: string; title: string; artist: string; price: number; quantity: number; thumb: string }
interface Order { id: string; order_number: string; status: string; payment_status: string; fulfillment_type: string; customer_name: string; customer_email: string; customer_phone: string; shipping_address: any; pickup_code: string; total_amount: number; shipping_cost: number; tax_amount: number; stripe_payment_intent: string; created_at: string; updated_at: string; order_items: OrderItem[] }

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    async function fetchOrder() {
      const res = await fetch(`/api/admin/orders/${params.id}`)
      if (res.ok) setOrder(await res.json())
      setLoading(false)
    }
    fetchOrder()
  }, [params.id])

  async function updateStatus(newStatus: string) {
    setUpdating(true)
    const res = await fetch(`/api/admin/orders/${params.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    if (res.ok) {
      const fresh = await fetch(`/api/admin/orders/${params.id}`)
      if (fresh.ok) setOrder(await fresh.json())
    }
    setUpdating(false)
  }

  async function cancelOrder() {
    if (!confirm('Cancelar este pedido? El vinilo volvera a estar en venta.')) return
    await updateStatus('cancelled')
  }

  if (loading) return <p className="text-xs animate-pulse p-6" style={{ color: '#6b7280' }}>CARGANDO...</p>
  if (!order) return <p className="text-sm p-6" style={{ color: '#ef4444' }}>Pedido no encontrado</p>

  const st = STATUS_MAP[order.status] ?? STATUS_MAP.pending
  const nextActions = NEXT_STATUS[order.status] ?? []

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6"
        style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
        <div className="flex items-center gap-4">
          <Link href="/admin/pedidos" className="text-xs" style={{ color: '#6b7280' }}>← PEDIDOS</Link>
          <h1 className="text-xl font-bold" style={{ color: '#000000' }}>
            PEDIDO #{order.order_number ?? order.id.slice(0, 8)}
          </h1>
          <span className="text-xs px-2 py-1" style={{ color: st.color, border: `1px solid ${st.color}` }}>
            {st.label}
          </span>
        </div>
        <p className="text-xs" style={{ color: '#6b7280' }}>
          {new Date(order.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      {/* Grid: Cliente + Pedido */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Cliente */}
        <div className="p-5" style={{ border: '1px solid #d1d5db' }}>
          <p className="text-xs font-medium mb-3" style={{ color: '#6b7280' }}>CLIENTE</p>
          <p className="text-sm font-bold" style={{ color: '#000000' }}>{order.customer_name || '—'}</p>
          <p className="text-xs" style={{ color: '#6b7280' }}>{order.customer_email || ''}</p>
          {order.customer_phone && <p className="text-xs" style={{ color: '#6b7280' }}>{order.customer_phone}</p>}
          {order.shipping_address && typeof order.shipping_address === 'object' && (
            <div className="mt-3 pt-3" style={{ borderTop: '1px solid #e5e7eb' }}>
              <p className="text-xs font-medium mb-1" style={{ color: '#6b7280' }}>DIRECCION</p>
              <p className="text-xs" style={{ color: '#000000' }}>
                {(order.shipping_address as any).line1}<br />
                {(order.shipping_address as any).city}, {(order.shipping_address as any).postal_code}<br />
                {(order.shipping_address as any).country}
              </p>
            </div>
          )}
        </div>

        {/* Info pedido */}
        <div className="p-5" style={{ border: '1px solid #d1d5db' }}>
          <p className="text-xs font-medium mb-3" style={{ color: '#6b7280' }}>INFORMACION</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs" style={{ color: '#6b7280' }}>Tipo</p>
              <p className="text-sm font-bold" style={{ color: '#000000' }}>
                {order.fulfillment_type === 'pickup' ? 'GUARDI' : 'ENVIO'}
              </p>
            </div>
            <div>
              <p className="text-xs" style={{ color: '#6b7280' }}>Pago</p>
              <p className="text-sm font-bold" style={{ color: order.payment_status === 'paid' ? '#22c55e' : '#f59e0b' }}>
                {order.payment_status === 'paid' ? 'PAGADO' : 'PENDIENTE'}
              </p>
            </div>
            {order.pickup_code && (
              <div className="col-span-2">
                <p className="text-xs" style={{ color: '#6b7280' }}>Codigo recogida</p>
                <p className="text-lg font-mono font-bold" style={{ color: '#000000' }}>{order.pickup_code}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="mb-8">
        <p className="text-xs font-medium mb-3" style={{ color: '#6b7280' }}>ARTICULOS</p>
        <div style={{ border: '1px solid #d1d5db' }}>
          {(order.order_items ?? []).map((item, i) => (
            <div key={item.id} className="flex items-center gap-4 p-4"
              style={{ borderBottom: i < (order.order_items?.length ?? 0) - 1 ? '1px solid #e5e7eb' : 'none' }}>
              {item.thumb
                ? <img src={item.thumb} alt="" className="w-12 h-12 object-cover shrink-0" style={{ border: '1px solid #d1d5db' }} />
                : <div className="w-12 h-12 shrink-0" style={{ backgroundColor: '#f3f4f6', border: '1px solid #d1d5db' }} />}
              <div className="flex-1">
                <p className="text-sm font-bold" style={{ color: '#000000' }}>{item.artist}</p>
                <p className="text-xs" style={{ color: '#6b7280' }}>{item.title}</p>
              </div>
              <p className="text-sm font-bold" style={{ color: '#000000' }}>
                {(item.price / 100).toFixed(2)} EUR
              </p>
            </div>
          ))}
          <div className="p-4 flex justify-between" style={{ borderTop: '2px solid #000000' }}>
            <span className="text-sm font-bold" style={{ color: '#000000' }}>TOTAL</span>
            <span className="text-sm font-bold" style={{ color: '#000000' }}>
              {((order.total_amount ?? 0) / 100).toFixed(2)} EUR
            </span>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex gap-3">
        {nextActions.map(a => (
          <button key={a.value} onClick={() => updateStatus(a.value)} disabled={updating}
            className="text-xs px-6 py-3 transition-colors hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: '#000000', color: '#FFFFFF' }}>
            {updating ? '...' : a.label}
          </button>
        ))}
        {!['cancelled', 'refunded', 'delivered', 'collected'].includes(order.status) && (
          <button onClick={cancelOrder} disabled={updating}
            className="text-xs px-6 py-3 transition-colors hover:bg-red-500 hover:text-white"
            style={{ border: '1px solid #ef4444', color: '#ef4444' }}>
            CANCELAR
          </button>
        )}
      </div>
    </div>
  )
}
