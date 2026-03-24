import { useEffect, useId, useState } from 'react'
import { AppButton } from './AppButton'

export type CakeOrderDetails = {
  flavor: string
  filling: string
  servings: number
  designImage: File | null
  notes: string
}

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: (details?: CakeOrderDetails) => void
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  showCakeForm?: boolean
  initialValues?: Partial<CakeOrderDetails>
}

export function Modal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  showCakeForm = false,
  initialValues,
}: ModalProps) {
  const titleId = useId()
  const descriptionId = useId()

  const [flavor, setFlavor] = useState('')
  const [filling, setFilling] = useState('')
  const [servings, setServings] = useState(10)
  const [designImage, setDesignImage] = useState<File | null>(null)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  useEffect(() => {
    if (!isOpen || !showCakeForm) return
    void initialValues
  }, [isOpen, showCakeForm, initialValues])

  if (!isOpen) return null

  const modalTitle = title ?? (showCakeForm ? 'Personalizar torta' : 'Confirmar pedido')
  const modalDescription =
    description ??
    (showCakeForm ? 'Completa los detalles para preparar tu pedido.' : 'Deseas continuar?')

  const canSubmit = !showCakeForm || (flavor.trim() !== '' && filling.trim() !== '' && servings > 0)

  const handleConfirm = () => {
    if (!showCakeForm) {
      onConfirm()
      return
    }
    if (!canSubmit) return
    onConfirm({ flavor: flavor.trim(), filling: filling.trim(), servings, designImage, notes: notes.trim() })
  }

  const handleSubmit = (event: { preventDefault(): void }) => {
    event.preventDefault()
    handleConfirm()
  }

  const selectClass =
    'w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-700 outline-none transition focus:border-rose-300 focus:bg-white focus:ring-2 focus:ring-rose-100'

  const inputClass =
    'w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-700 outline-none transition focus:border-rose-300 focus:bg-white focus:ring-2 focus:ring-rose-100'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        {/* Modal header */}
        <div className="border-b border-stone-100 px-6 py-5">
          <h2 id={titleId} className="font-display text-xl font-semibold text-stone-800">
            {modalTitle}
          </h2>
          <p id={descriptionId} className="mt-1 text-sm text-stone-500">
            {modalDescription}
          </p>
        </div>

        {!showCakeForm && (
          <div className="flex justify-end gap-3 px-6 py-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-stone-200 px-5 py-2 text-sm font-semibold text-stone-600 transition hover:bg-stone-50"
            >
              {cancelText}
            </button>
            <AppButton type="button" onClick={handleConfirm}>
              {confirmText}
            </AppButton>
          </div>
        )}

        {showCakeForm && (
          <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Sabor
              </label>
              <select value={flavor} onChange={(e) => setFlavor(e.target.value)} className={selectClass}>
                <option value="">Selecciona un sabor</option>
                <option value="Vainilla">Vainilla</option>
                <option value="Chocolate">Chocolate</option>
                <option value="Red Velvet">Red Velvet</option>
                <option value="Zanahoria">Zanahoria</option>
                <option value="Limon">Limón</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Relleno
              </label>
              <select value={filling} onChange={(e) => setFilling(e.target.value)} className={selectClass}>
                <option value="">Selecciona un relleno</option>
                <option value="Manjar">Manjar</option>
                <option value="Crema pastelera">Crema pastelera</option>
                <option value="Chocolate">Chocolate</option>
                <option value="Frutos rojos">Frutos rojos</option>
                <option value="Queso crema">Queso crema</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Personas
              </label>
              <input
                type="number"
                min={1}
                value={servings}
                onChange={(e) => setServings(Number(e.target.value))}
                className={inputClass}
                placeholder="Ej: 10"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Diseño (opcional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setDesignImage(e.target.files?.[0] ?? null)}
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-600 file:mr-3 file:rounded-lg file:border-0 file:bg-rose-100 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-rose-600 transition hover:file:bg-rose-200"
              />
              {designImage && (
                <p className="text-xs text-stone-500">
                  Archivo: <span className="font-semibold text-rose-500">{designImage.name}</span>
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Observaciones
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className={`${inputClass} resize-none`}
                placeholder="Ej: sin nueces, entregar antes de las 5pm"
              />
            </div>

            <div className="flex justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-stone-200 px-5 py-2 text-sm font-semibold text-stone-600 transition hover:bg-stone-50"
              >
                {cancelText}
              </button>
              <AppButton type="submit" disabled={!canSubmit}>
                {confirmText}
              </AppButton>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
