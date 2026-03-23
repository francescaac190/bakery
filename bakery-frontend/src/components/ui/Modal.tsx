import { type FormEvent, useEffect, useId, useState } from 'react'
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

    // setFlavor(initialValues?.flavor ?? '')
    // setFilling(initialValues?.filling ?? '')
    // setServings(initialValues?.servings ?? 10)
    // setDesignImage(initialValues?.designImage ?? null)
    // setNotes(initialValues?.notes ?? '')
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

    onConfirm({
      flavor: flavor.trim(),
      filling: filling.trim(),
      servings,
      designImage,
      notes: notes.trim(),
    })
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    handleConfirm()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        <h2 id={titleId} className="text-xl font-semibold text-gray-900">
          {modalTitle}
        </h2>
        <p id={descriptionId} className="mt-2 text-gray-600">
          {modalDescription}
        </p>

        {!showCakeForm && (
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
            >
              {cancelText}
            </button>
            <AppButton type="button" onClick={handleConfirm}>
              {confirmText}
            </AppButton>
          </div>
        )}

        {showCakeForm && (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-800">Que sabor?</label>
              <select
                value={flavor}
                onChange={(event) => setFlavor(event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-pink-300"
              >
                <option value="">Selecciona un sabor</option>
                <option value="Vainilla">Vainilla</option>
                <option value="Chocolate">Chocolate</option>
                <option value="Red Velvet">Red Velvet</option>
                <option value="Zanahoria">Zanahoria</option>
                <option value="Limon">Limon</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-800">Que relleno?</label>
              <select
                value={filling}
                onChange={(event) => setFilling(event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-pink-300"
              >
                <option value="">Selecciona un relleno</option>
                <option value="Manjar">Manjar</option>
                <option value="Crema pastelera">Crema pastelera</option>
                <option value="Chocolate">Chocolate</option>
                <option value="Frutos rojos">Frutos rojos</option>
                <option value="Queso crema">Queso crema</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-800">Para cuantas personas?</label>
              <input
                type="number"
                min={1}
                value={servings}
                onChange={(event) => setServings(Number(event.target.value))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-pink-300"
                placeholder="Ej: 10"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-800">Adjuntar diseno (opcional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setDesignImage(event.target.files?.[0] ?? null)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-pink-100 file:px-3 file:py-1 file:text-pink-700 hover:file:bg-pink-200"
              />
              {designImage && (
                <p className="text-xs text-gray-600">
                  Archivo: <span className="font-medium">{designImage.name}</span>
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-800">Observaciones</label>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={3}
                className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-pink-300"
                placeholder="Ej: sin nueces, entregar antes de las 5pm"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
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
