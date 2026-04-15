import { createAdminClient } from '@/lib/supabase/admin'
import { createClient }      from '@/lib/supabase/server'
import { redirect }          from 'next/navigation'
import Link                  from 'next/link'
export const dynamic = 'force-dynamic'

const STATUS: Record<string, { label: string; color: string }> = {
  pending:          { label: 'PENDIENTE',  color: '#f59e0b' },
  paid:             { label: 'PAGADO',     color: '#22c55e' },
  confirmed:        { label: 'CONFIRMADO', color: '#22c55e' },
  processing:       { label: 'PREPARANDO', color: '#3b82f6' },
  shipped:          { label: 'ENVIADO',    color: '#8b5cf6' },
  delivered:        { label: 'ENTREGADO',  color: '#10b981' },
  collected:        { label: 'RECOGIDO',   color: '#10b981' },
  cancelled:        { label: 'CANCELADO',  color: '#ef4444' },
  refunded:         { label: 'REEMBOLSADO',color: '#9ca3af' },
}

const FULFILLMENT: Record<string, string> = {
  pickup: 'GUARDI',
  shipping: 'ENVIO',
}

export default async function PedidosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const admin = createAdminClient()
  const { data: orders } = await admin
    .from('orders')
    .select('id, order_number, status, customer_name, customer_email, fulfillment_type, total_amount, created_at, pickup_code')
    .order('created_at', { ascending: false })
    .limit(100)

  const list = (orders ?? []) as any[]
  const pending = list.filter(o => o.status === 'pending' || o.status === 'paid')
  const active  = list.filter(o => ['confirmed', 'processing', 'shipped'].includes(o.status))

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6"
        style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
        <h1 className="text-xl font-bold" style={{ color: '#000000' }}>PEDIDOS</h1>
        <div className="flex gap-4">
          <span className="text-xs" style={{ color: '#f59e0b' }}>{pending.length} por pagar</span>
          <span className="text-xs" style={{ color: '#3b82f6' }}>{active.length} en proceso</span>
        </div>
      </div>

      {list.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-sm" style={{ color: '#6b7280' }}>Sin pedidos todavia.</p>
          <p className="text-xs mt-2" style={{ color: '#9ca3af' }}>
            Los pedidos apareceran aqui cuando los clientes completen el checkout.
          </p>
        </div>
      )}

      <div className="overflow-x-auto" style={{ border: '1px solid #d1d5db' }}>
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr style={{ borderBottom: '2px solid #000000' }}>
              <th className="text-xs font-medium p-3" style={{ color: '#6b7280' }}>PEDIDO</th>
              <th className="text-xs font-medium p-3" style={{ color: '#6b7280' }}>CLIENTE</th>
              <th className="text-xs font-medium p-3" style={{ color: '#6b7280' }}>TIPO</th>
              <th className="text-xs font-medium p-3" style={{ color: '#6b7280' }}>TOTAL</th>
              <th className="text-xs font-medium p-3" style={{ color: '#6b7280' }}>ESTADO</th>
              <th className="text-xs font-medium p-3" style={{ color: '#6b7280' }}>CODIGO</th>
              <th className="text-xs font-medium p-3" style={{ color: '#6b7280' }}>FECHA</th>
            </tr>
          </thead>
          <tbody>
            {list.map(o => {
              const st = STATUS[o.status] ?? STATUS.pending
              return (
                <tr key={o.id} className="hover:bg-gray-50" style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td className="p-3">
                    <Link href={`/admin/pedidos/${o.id}`} className="text-sm font-mono font-bold" style={{ color: '#000000' }}>
                      #{o.order_number ?? o.id.slice(0, 8)}
                    </Link>
                  </td>
                  <td className="p-3">
                    <p className="text-sm" style={{ color: '#000000' }}>{o.customer_name ?? '—'}</p>
                    <p className="text-xs" style={{ color: '#6b7280' }}>{o.customer_email ?? ''}</p>
                  </td>
                  <td className="p-3">
                    <span className="text-xs px-2 py-1" style={{ border: '1px solid #d1d5db', color: '#374151' }}>
                      {FULFILLMENT[o.fulfillment_type] ?? o.fulfillment_type ?? '—'}
                    </span>
                  </td>
                  <td className="p-3 text-sm" style={{ color: '#000000' }}>
                    {o.total_amount ? (o.total_amount / 100).toFixed(2) + ' EUR' : '—'}
                  </td>
                  <td className="p-3">
                    <span className="text-xs px-2 py-1" style={{ color: st.color, border: `1px solid ${st.color}` }}>
                      {st.label}
                    </span>
                  </td>
                  <td className="p-3">
                    {o.pickup_code
                      ? <span className="text-xs font-mono px-2 py-1" style={{ backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', color: '#000000' }}>{o.pickup_code}</span>
                      : <span className="text-xs" style={{ color: '#9ca3af' }}>—</span>
                    }
                  </td>
                  <td className="p-3 text-xs" style={{ color: '#6b7280' }}>
                    {new Date(o.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
