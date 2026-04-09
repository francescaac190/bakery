import { useEffect, useState } from 'react'
import { useAuthStore } from '@/modules/auth/store/auth.store'
import { ClipboardList, Clock, AlertTriangle, CakeSlice } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { STATUS_LABELS, STATUS_COLORS } from '@/modules/orders/types'
import { cn } from '@/lib/cn'

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:1313/api/v1'}/admin/dashboard`

type Summary = {
  todayCount: number
  pendingCount: number
  inProgressCount: number
  unpricedCakeCount: number
  recentOrders: Array<{
    id: string
    displayId: string
    customerName: string
    status: string
    totalCents: number
    currency: string
    createdAt: string
  }>
}

export function DashboardPage() {
  const [summary, setSummary] = useState<Summary | null>(null)
  const token = useAuthStore((s) => s.token)
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`${BASE_URL}/summary`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((json) => setSummary((json as { data: Summary }).data))
      .catch(() => {})
  }, [token])

  if (!summary) {
    return (
      <div className="p-6 flex justify-center py-12">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const cards = [
    { label: 'Pedidos hoy', value: summary.todayCount, icon: ClipboardList },
    { label: 'Pendientes', value: summary.pendingCount, icon: Clock },
    { label: 'En proceso', value: summary.inProgressCount, icon: CakeSlice },
    {
      label: 'Tortas sin precio',
      value: summary.unpricedCakeCount,
      icon: AlertTriangle,
      alert: summary.unpricedCakeCount > 0,
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold text-text-heading">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className={cn(
              'bg-white rounded-lg border border-border-subtle p-4',
              card.alert && 'border-amber-300 bg-amber-50',
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <card.icon
                size={16}
                className={card.alert ? 'text-amber-600' : 'text-text-muted'}
              />
              <span className="text-xs text-text-muted">{card.label}</span>
            </div>
            <p className="text-2xl font-bold text-text-heading">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-border-subtle">
        <div className="px-4 py-3 border-b border-border-subtle">
          <h2 className="text-sm font-bold text-text-heading">Pedidos recientes</h2>
        </div>
        <table className="w-full text-sm">
          <tbody>
            {summary.recentOrders.map((order) => (
              <tr
                key={order.id}
                onClick={() => navigate('/orders')}
                className="border-b border-border-subtle last:border-0 hover:bg-background-4 cursor-pointer"
              >
                <td className="px-4 py-3 font-mono text-xs">{order.displayId}</td>
                <td className="px-4 py-3">{order.customerName}</td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      'text-xs px-2 py-0.5 rounded-full font-medium',
                      STATUS_COLORS[order.status as keyof typeof STATUS_COLORS] ?? 'bg-gray-100 text-gray-600',
                    )}
                  >
                    {STATUS_LABELS[order.status as keyof typeof STATUS_LABELS] ?? order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-mono">
                  {order.currency} {(order.totalCents / 100).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
