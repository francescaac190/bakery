import { useEffect, useState } from 'react'
import { X, Save, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import { toast } from 'react-hot-toast'
import { useOrder, useUpdateOrderStatus, useUpdateAdminNotes, useSetCustomCakePrice } from '../hooks/useOrders'
import {
  STATUS_LABELS,
  STATUS_COLORS,
  type OrderStatus,
  type FulfillmentType,
  type CustomCakeRequest,
} from '../types'

interface Props {
  orderId: string | null
  onClose: () => void
}

const NEXT_STATUS: Partial<Record<OrderStatus, { label: string; next: OrderStatus }>> = {
  PENDING: { label: 'Aprobar pedido', next: 'APPROVED' },
  APPROVED: { label: 'Iniciar preparación', next: 'IN_PROGRESS' },
  IN_PROGRESS: { label: 'Marcar como listo', next: 'READY' },
}

function getReadyAction(fulfillmentType: FulfillmentType): { label: string; next: OrderStatus } {
  return fulfillmentType === 'DELIVERY'
    ? { label: 'Marcar como entregado', next: 'DELIVERED' }
    : { label: 'Marcar como retirado', next: 'PICKED_UP' }
}

function formatPrice(cents: number, currency: string) {
  return `${(cents / 100).toFixed(2)} ${currency}`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('es-BO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function OrderDetailDrawer({ orderId, onClose }: Props) {
  const { data: order, isLoading, error } = useOrder(orderId)
  const updateStatus = useUpdateOrderStatus()
  const updateNotes = useUpdateAdminNotes()
  const [adminNotes, setAdminNotes] = useState('')
  const [notesDirty, setNotesDirty] = useState(false)

  const isPending = updateStatus.isPending || updateNotes.isPending

  useEffect(() => {
    if (order) {
      setAdminNotes(order.adminNotes ?? '')
      setNotesDirty(false)
    }
  }, [order])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isPending) onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, isPending])

  if (!orderId) return null

  function handleStatusChange(next: OrderStatus) {
    if (!orderId) return
    updateStatus.mutate({ id: orderId, status: next })
  }

  function handleSaveNotes() {
    if (!orderId) return
    updateNotes.mutate({ id: orderId, adminNotes }, { onSuccess: () => setNotesDirty(false) })
  }

  function handleCancel() {
    if (!orderId) return
    updateStatus.mutate({ id: orderId, status: 'CANCELLED' })
  }

  const nextAction = order
    ? order.status === 'READY'
      ? getReadyAction(order.fulfillmentType)
      : NEXT_STATUS[order.status] ?? null
    : null

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40" onClick={() => !isPending && onClose()} />

      <div className="fixed inset-y-0 right-0 w-[520px] max-w-full bg-surface border-l-2 border-border-subtle shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold text-text-heading">
              {order ? `Pedido #${order.displayId}` : 'Cargando...'}
            </h2>
            {order && (
              <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', STATUS_COLORS[order.status])}>
                {STATUS_LABELS[order.status]}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="text-text-muted hover:text-text transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {error && (
            <p className="text-sm text-secondary">
              {(error as Error).message ?? 'Error al cargar el pedido'}
            </p>
          )}

          {order && (
            <>
              {/* Customer */}
              <Section title="Cliente">
                <InfoRow label="Nombre" value={order.customerName} />
                <InfoRow
                  label="Teléfono"
                  value={
                    <a
                      href={`https://wa.me/${order.customerPhone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      {order.customerPhone}
                      <ExternalLink size={12} />
                    </a>
                  }
                />
                {order.customerEmail && (
                  <InfoRow label="Email" value={order.customerEmail} />
                )}
              </Section>

              {/* Items */}
              <Section title="Productos">
                <div className="space-y-2">
                  {order.items.map(item => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <span className="text-text">
                        {item.quantity} &times; {item.product.name}
                        {item.variantLabel && (
                          <span className="text-text-muted ml-1">({item.variantLabel})</span>
                        )}
                      </span>
                      <span className="text-text-secondary font-medium">
                        {formatPrice(item.unitPriceCents * item.quantity, item.currency)}
                      </span>
                    </div>
                  ))}
                </div>
              </Section>

              {/* Custom cake */}
              {order.customCakeRequest && (
                <CustomCakeSection cake={order.customCakeRequest} currency={order.currency} orderId={order.id} />
              )}

              {/* Delivery / Pickup */}
              <Section title="Entrega">
                <InfoRow
                  label="Tipo"
                  value={
                    <span className={cn(
                      'text-xs font-medium px-2 py-0.5 rounded-full',
                      order.fulfillmentType === 'DELIVERY'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-cyan-100 text-cyan-700'
                    )}>
                      {order.fulfillmentType === 'DELIVERY' ? 'Delivery' : 'Retiro'}
                    </span>
                  }
                />
                {order.deliveryAddress && (
                  <InfoRow label="Dirección" value={order.deliveryAddress} />
                )}
                {order.pickupAt && (
                  <InfoRow label="Fecha retiro" value={formatDate(order.pickupAt)} />
                )}
              </Section>

              {/* Notes */}
              <Section title="Notas">
                {order.notes && (
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1">
                      Notas del cliente
                    </p>
                    <p className="text-sm text-text bg-background-4 rounded-md p-2">
                      {order.notes}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1">
                    Notas internas
                  </p>
                  <textarea
                    value={adminNotes}
                    onChange={e => {
                      setAdminNotes(e.target.value)
                      setNotesDirty(true)
                    }}
                    rows={3}
                    placeholder="Notas internas del pedido..."
                    className="w-full border border-border-card rounded-md px-3 py-2 text-sm bg-background-3 text-text focus:outline-none focus:border-primary resize-none"
                  />
                  {notesDirty && (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="mt-1"
                      onClick={handleSaveNotes}
                      disabled={updateNotes.isPending}
                    >
                      <Save size={14} />
                      {updateNotes.isPending ? 'Guardando...' : 'Guardar notas'}
                    </Button>
                  )}
                </div>
              </Section>

              {/* Status timeline */}
              <Section title="Historial">
                <div className="space-y-3">
                  {order.statusLogs.map((log, i) => (
                    <div key={log.id} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className={cn(
                          'w-2.5 h-2.5 rounded-full mt-1',
                          i === 0 ? 'bg-primary' : 'bg-border-subtle'
                        )} />
                        {i < order.statusLogs.length - 1 && (
                          <div className="w-px h-6 bg-border-subtle" />
                        )}
                      </div>
                      <div>
                        <span className={cn(
                          'text-xs font-medium px-1.5 py-0.5 rounded',
                          STATUS_COLORS[log.status]
                        )}>
                          {STATUS_LABELS[log.status]}
                        </span>
                        <p className="text-xs text-text-muted mt-0.5">
                          {formatDate(log.createdAt)}
                          {log.changedBy && ` — ${log.changedBy}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>

              {/* Total */}
              <div className="flex items-center justify-between pt-2 border-t border-border-subtle">
                <span className="text-sm font-semibold text-text-heading">Total</span>
                <span className="text-lg font-bold text-text-heading">
                  {formatPrice(order.totalCents, order.currency)}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        {order && order.status !== 'DELIVERED' && order.status !== 'PICKED_UP' && order.status !== 'CANCELLED' && (
          <div className="px-6 py-4 border-t border-border-subtle flex flex-col gap-2">
            {nextAction && (
              <Button
                onClick={() => handleStatusChange(nextAction.next)}
                disabled={isPending}
                className="w-full justify-center"
              >
                {updateStatus.isPending ? 'Actualizando...' : nextAction.label}
              </Button>
            )}
            <Button
              variant="danger"
              onClick={handleCancel}
              disabled={isPending}
              className="w-full justify-center"
            >
              Cancelar pedido
            </Button>
          </div>
        )}
      </div>
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">
        {title}
      </h3>
      {children}
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between text-sm py-0.5">
      <span className="text-text-muted">{label}</span>
      <span className="text-text text-right">{value}</span>
    </div>
  )
}

function CustomCakeSection({ cake, currency, orderId }: { cake: CustomCakeRequest; currency: string; orderId: string }) {
  const [priceInput, setPriceInput] = useState('')
  const setCakePriceMutation = useSetCustomCakePrice()
  const hasUnpricedCake = cake.finalPriceCents == null

  const specs = [
    cake.servings && { label: 'Porciones', value: String(cake.servings) },
    cake.size && { label: 'Tamaño', value: cake.size },
    cake.flavor && { label: 'Sabor', value: cake.flavor },
    cake.filling && { label: 'Relleno', value: cake.filling },
    cake.frosting && { label: 'Cobertura', value: cake.frosting },
    cake.messageOnCake && { label: 'Mensaje', value: cake.messageOnCake },
    cake.designNotes && { label: 'Diseño', value: cake.designNotes },
    cake.allergies && { label: 'Alergias', value: cake.allergies },
    cake.budgetCents && { label: 'Presupuesto', value: formatPrice(cake.budgetCents, currency) },
    cake.finalPriceCents != null && { label: 'Precio final', value: formatPrice(cake.finalPriceCents, currency) },
  ].filter(Boolean) as { label: string; value: string }[]

  function handleSetPrice() {
    const cents = Math.round(parseFloat(priceInput) * 100)
    if (isNaN(cents) || cents <= 0) { toast.error('Ingresa un precio válido'); return }
    setCakePriceMutation.mutate({ id: orderId, priceCents: cents })
  }

  return (
    <Section title="Torta personalizada">
      {hasUnpricedCake && (
        <div className="bg-amber-50 border border-amber-200 rounded-md px-3 py-3 mb-3">
          <p className="text-xs text-amber-700 mb-2">⚠ Esta torta no tiene precio asignado</p>
          <div className="flex gap-2">
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="Precio (BOB)"
              value={priceInput}
              onChange={(e) => setPriceInput(e.target.value)}
              className="flex-1 border border-amber-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              onClick={handleSetPrice}
              disabled={setCakePriceMutation.isPending}
              className="px-3 py-1 text-xs rounded bg-primary text-white hover:bg-primary/90 disabled:opacity-50"
            >
              {setCakePriceMutation.isPending ? '...' : 'Establecer'}
            </button>
          </div>
        </div>
      )}
      <div className="space-y-1">
        {specs.map(s => (
          <InfoRow key={s.label} label={s.label} value={s.value} />
        ))}
      </div>
      {cake.inspirationImage && (
        <div className="mt-2">
          <p className="text-xs text-text-muted mb-1">Imagen de referencia</p>
          <img
            src={cake.inspirationImage}
            alt="Inspiración"
            className="w-24 h-24 object-cover rounded-md border border-border-card"
          />
        </div>
      )}
    </Section>
  )
}
