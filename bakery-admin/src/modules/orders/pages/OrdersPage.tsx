import { useState, useEffect, useRef } from 'react'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'
import { useOrders } from '../hooks/useOrders'
import { OrderDetailDrawer } from '../components/OrderDetailDrawer'
import {
  STATUS_LABELS,
  STATUS_COLORS,
  type OrderStatus,
  type OrderFilters,
  type OrderSummary,
} from '../types'

const ALL_STATUSES: OrderStatus[] = [
  'PENDING', 'APPROVED', 'IN_PROGRESS', 'READY', 'DELIVERED', 'PICKED_UP', 'CANCELLED',
]

function formatPrice(cents: number, currency: string) {
  return `${(cents / 100).toFixed(2)} ${currency}`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-BO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function getOrderType(order: OrderSummary): string {
  const hasCustom = !!order.customCakeRequest
  const hasRegular = order.items.length > 0
  if (hasCustom && hasRegular) return 'Mixto'
  if (hasCustom) return 'Torta personalizada'
  return 'Simple'
}

export default function OrdersPage() {
  const [filters, setFilters] = useState<OrderFilters>({ page: 1, pageSize: 20 })
  const [searchInput, setSearchInput] = useState('')
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { data, isLoading, error } = useOrders(filters)

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchInput || undefined, page: 1 }))
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [searchInput])

  function handleStatusFilter(status: OrderStatus | '') {
    setFilters(prev => ({
      ...prev,
      status: status || undefined,
      page: 1,
    }))
  }

  function handlePageChange(page: number) {
    setFilters(prev => ({ ...prev, page }))
  }

  const orders = data?.items ?? []
  const pagination = data?.pagination

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-text-heading">Pedidos</h1>
        <p className="text-sm text-text-muted mt-1">
          Gestiona y da seguimiento a los pedidos de tus clientes.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="Buscar por nombre, teléfono o ID..."
            className="w-full pl-9 pr-3 py-2 border border-border-card rounded-md text-sm bg-background-3 text-text focus:outline-none focus:border-primary"
          />
        </div>
        <select
          value={filters.status ?? ''}
          onChange={e => handleStatusFilter(e.target.value as OrderStatus | '')}
          className="border border-border-card rounded-md px-3 py-2 text-sm bg-background-3 text-text focus:outline-none focus:border-primary"
        >
          <option value="">Todos los estados</option>
          {ALL_STATUSES.map(s => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="text-center py-16">
          <p className="text-sm text-secondary">
            {(error as Error).message ?? 'Error al cargar los pedidos'}
          </p>
        </div>
      )}

      {!isLoading && !error && orders.length === 0 && (
        <div className="text-center py-16">
          <p className="text-sm text-text-muted">No se encontraron pedidos.</p>
        </div>
      )}

      {!isLoading && !error && orders.length > 0 && (
        <div className="overflow-x-auto border border-border-card rounded-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-background-4 text-left">
                <th className="px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wide">ID</th>
                <th className="px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wide">Cliente</th>
                <th className="px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wide">Fecha</th>
                <th className="px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wide">Entrega</th>
                <th className="px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wide">Tipo</th>
                <th className="px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wide">Estado</th>
                <th className="px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wide text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {orders.map(order => (
                <tr
                  key={order.id}
                  onClick={() => setSelectedOrderId(order.id)}
                  className="hover:bg-background-4 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-text-heading">#{order.displayId}</td>
                  <td className="px-4 py-3 text-text">{order.customerName}</td>
                  <td className="px-4 py-3 text-text-muted">{formatDate(order.createdAt)}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      'text-xs font-medium px-2 py-0.5 rounded-full',
                      order.fulfillmentType === 'DELIVERY'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-cyan-100 text-cyan-700'
                    )}>
                      {order.fulfillmentType === 'DELIVERY' ? 'Delivery' : 'Retiro'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-text-muted">{getOrderType(order)}</td>
                  <td className="px-4 py-3">
                    <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', STATUS_COLORS[order.status])}>
                      {STATUS_LABELS[order.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-text-heading">
                    {formatPrice(order.totalCents, order.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-muted">
            Mostrando {(pagination.page - 1) * pagination.pageSize + 1}
            {' - '}
            {Math.min(pagination.page * pagination.pageSize, pagination.total)}
            {' de '}
            {pagination.total}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              disabled={pagination.page <= 1}
              onClick={() => handlePageChange(pagination.page - 1)}
            >
              <ChevronLeft size={16} />
            </Button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter(p => Math.abs(p - pagination.page) <= 2 || p === 1 || p === pagination.totalPages)
              .map((p, idx, arr) => {
                const prev = arr[idx - 1]
                const showEllipsis = prev != null && p - prev > 1
                return (
                  <span key={p} className="flex items-center">
                    {showEllipsis && <span className="px-1 text-text-muted">...</span>}
                    <Button
                      variant={p === pagination.page ? 'primary' : 'ghost'}
                      size="sm"
                      onClick={() => handlePageChange(p)}
                    >
                      {p}
                    </Button>
                  </span>
                )
              })}
            <Button
              variant="ghost"
              size="sm"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => handlePageChange(pagination.page + 1)}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}

      {/* Detail drawer */}
      {selectedOrderId && (
        <OrderDetailDrawer
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
        />
      )}
    </div>
  )
}
