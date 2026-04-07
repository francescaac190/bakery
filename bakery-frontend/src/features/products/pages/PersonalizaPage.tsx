import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ChipSelector from "../../../components/ui/ChipSelector";
import type { Product } from "../types";
import { useCart } from "../context/CartContext";

const SERVINGS_OPTIONS = [
  { label: "Mini (2 personas)", value: "Mini (2 personas)" },
  { label: "5 personas", value: "5 personas" },
  { label: "10 personas", value: "10 personas" },
  { label: "20 personas", value: "20 personas" },
  { label: "30 personas", value: "30 personas" },
];

const FLAVOR_OPTIONS = [
  { label: "Vainilla", value: "Vainilla" },
  { label: "Chocolate", value: "Chocolate" },
  { label: "Red Velvet", value: "Red Velvet" },
  { label: "Zanahoria", value: "Zanahoria" },
  { label: "Limón", value: "Limón" },
];

const FILLING_OPTIONS = [
  { label: "Chocolate", value: "Chocolate" },
  { label: "Brigadeiro", value: "Brigadeiro" },
  { label: "Manjar", value: "Manjar" },
  { label: "Crema pastelera", value: "Crema pastelera" },
  { label: "Queso crema", value: "Queso crema" },
];

const FROSTING_OPTIONS = [
  { label: "Sin cobertura", value: "Sin cobertura" },
  { label: "Chocolate", value: "Chocolate" },
  { label: "Queso crema", value: "Queso crema" },
];

export default function PersonalizaPage() {
  const { state } = useLocation() as { state?: { product?: Product } };
  const navigate = useNavigate();
  const { customCake, setCustomCake } = useCart();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pre-fill from existing cart customCake (editing mode)
  const isEditing = customCake !== null;

  const [servings, setServings] = useState<string | null>(
    customCake?.servings ?? null,
  );
  const [flavor, setFlavor] = useState<string | null>(
    customCake?.flavor ?? null,
  );
  const [filling, setFilling] = useState<string | null>(
    customCake?.filling ?? null,
  );
  const [frosting, setFrosting] = useState<string | null>(
    customCake?.frosting ?? null,
  );
  const [messageOnCake, setMessageOnCake] = useState(
    customCake?.messageOnCake ?? "",
  );
  const [designNotes, setDesignNotes] = useState(customCake?.designNotes ?? "");
  const [imageFile, setImageFile] = useState<File | null>(
    customCake?.inspirationImageFile ?? null,
  );
  const [imagePreview, setImagePreview] = useState<string | null>(
    customCake?.inspirationImagePreview ?? null,
  );

  // Resolve product — from navigation state or from existing cart cake
  const product =
    state?.product ??
    (customCake
      ? ({ id: customCake.productId, name: customCake.productName } as Product)
      : null);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  }

  function handleSubmit() {
    if (!product) return;
    setCustomCake({
      productId: product.id,
      productName: product.name,
      servings,
      flavor,
      filling,
      frosting,
      messageOnCake,
      designNotes,
      inspirationImageFile: imageFile,
      inspirationImagePreview: imagePreview,
    });
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-background5">
      <div className="mx-auto max-w-lg px-4 py-6 space-y-4">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-border-card p-6">
          <button
            onClick={() => navigate(-1)}
            className="mb-3 text-sm font-mono font-semibold text-text-primary hover:underline"
          >
            ← Volver
          </button>
          <h1 className="font-mono text-2xl font-bold text-text-heading">
            Personaliza tu {product?.name ?? "Torta"}
          </h1>
          <p className="font-mono text-sm text-text-muted mt-1">
            Completa los detalles para que podamos preparar tu torta perfecta.
          </p>
        </div>

        {/* Cake details */}
        <div className="bg-white rounded-2xl border border-border-card p-6 space-y-5">
          <h2 className="font-mono text-lg font-bold text-text-heading">
            Detalles de la torta
          </h2>

          <div>
            <p className="font-mono text-sm text-text-muted mb-2">
              Cantidad de personas
            </p>
            <ChipSelector
              options={SERVINGS_OPTIONS}
              multi={false}
              value={servings}
              onChange={setServings}
            />
          </div>

          <div>
            <p className="font-mono text-sm text-text-muted mb-2">
              Sabor de masa
            </p>
            <ChipSelector
              options={FLAVOR_OPTIONS}
              multi={false}
              value={flavor}
              onChange={setFlavor}
            />
          </div>

          <div>
            <p className="font-mono text-sm text-text-muted mb-2">Relleno</p>
            <ChipSelector
              options={FILLING_OPTIONS}
              multi={false}
              value={filling}
              onChange={setFilling}
            />
          </div>

          <div>
            <p className="font-mono text-sm text-text-muted mb-2">Cobertura</p>
            <ChipSelector
              options={FROSTING_OPTIONS}
              multi={false}
              value={frosting}
              onChange={setFrosting}
            />
          </div>

          <div>
            <p className="font-mono text-sm text-text-muted mb-2">
              Mensaje en la torta (opcional)
            </p>
            <input
              type="text"
              maxLength={120}
              value={messageOnCake}
              onChange={(e) => setMessageOnCake(e.target.value)}
              placeholder='Ej: "Feliz cumpleaños, Ana!"'
              className="w-full rounded-xl border border-border-card bg-background5 px-4 py-2.5 font-mono text-sm text-text-heading placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="mt-1 text-right font-mono text-xs text-text-muted">
              {messageOnCake.length}/120
            </p>
          </div>

          <div>
            <p className="font-mono text-sm text-text-muted mb-2">
              Imagen de diseño (opcional)
            </p>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer rounded-xl border-2 border-dashed border-border-card p-4 text-center hover:border-primary transition-colors"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Vista previa"
                  className="mx-auto max-h-40 rounded-lg object-contain"
                />
              ) : (
                <div className="py-4">
                  <p className="font-mono text-sm text-text-muted">
                    Haz clic para subir una imagen de referencia
                  </p>
                  <p className="font-mono text-xs text-text-muted mt-1">
                    JPG, PNG, WebP — máx. 10 MB
                  </p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            {imageFile && (
              <div className="mt-2 flex items-center justify-between">
                <p className="font-mono text-xs text-text-muted">
                  {imageFile.name}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                  className="font-mono text-xs text-secondary hover:underline"
                >
                  Quitar
                </button>
              </div>
            )}
          </div>

          <div>
            <p className="font-mono text-sm text-text-muted mb-2">
              Observaciones adicionales (opcional)
            </p>
            <textarea
              value={designNotes}
              onChange={(e) => setDesignNotes(e.target.value)}
              placeholder="Ej: Flores rosas, decoración minimalista..."
              rows={3}
              className="w-full rounded-xl border border-border-card bg-background5 px-4 py-2.5 font-mono text-sm text-text-heading placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="app-button-ghost flex-1"
          >
            ← Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="app-button flex-2"
            style={{ flex: 2 }}
          >
            {isEditing ? "Actualizar torta" : "Agregar al carrito"} →
          </button>
        </div>
      </div>
    </div>
  );
}
