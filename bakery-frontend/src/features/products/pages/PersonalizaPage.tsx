import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Input from "../../../components/ui/input";
import ChipSelector from "../../../components/ui/ChipSelector";
import type { Product } from "../types";

export default function PersonalizaPage() {
  const { state } = useLocation() as { state: { product: Product } };
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState("1");
  const [flavor, setFlavor] = useState("1");
  const [filling, setFilling] = useState("1");
  const [cover, setCover] = useState("1");
  const [designImage, setDesignImage] = useState<File | null>(null);

  return (
    <div>
      <section className="bg-background2 sticky rounded-2xl p-8 space-y-4">
        <div className="bg-background3 rounded-xl p-4">
          <button
            onClick={() => navigate(-1)}
            className="mb-3 text-sm font-semibold text-primary hover:underline"
          >
            ← Volver
          </button>
          <h1 className="text-2xl font-bold text-text-primary">
            Personaliza tu {state?.product?.name ?? "Torta"}
          </h1>
          <p className="fontFamily-body font-regular leading-tight text-text-secondary mt-2">
            Completa este formulario guiado para pasar a revisión de tu pedido.
          </p>
          {/* <div className="text-left gap-2 mt-4 grid grid-cols-1 md:flex items-center ">
            <InfoCard text="1. Datos del pedido" />
            <InfoCard text="2. Diseño y entrega" />
            <InfoCard text="3. Revisión final" /> */}
          {/* </div> */}
        </div>

        <div className="bg-white rounded-xl border border-border-subtle p-4">
          <h2 className="text-lg font-semibold text-text-primary">
            Datos de Contacto
          </h2>
          <div className=" mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Nombre completo" helperText="Ana Perez" />
            <Input
              label="Correo electrónico"
              helperText="ana.perez@example.com"
            />
            <Input
              label="Fecha de Entrega"
              helperText="2023-10-15"
              type="date"
            />
            <Input label="Hora de Entrega" helperText="14:00" type="time" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border-subtle p-4">
          <h2 className="text-lg font-semibold text-text-primary">
            Detalles de la Torta
          </h2>
          <div className="mt-2 grid grid-cols-1">
            <label className="font-medium text-sm text-text-primary mt-2 mb-1">
              Cantidad de personas
            </label>
            <ChipSelector
              options={[
                { label: "Mini (2 personas)", value: "1" },
                { label: "5 personas", value: "2" },
                { label: "10 personas", value: "3" },
                { label: "20 personas", value: "4" },
                { label: "30 personas", value: "5" },
              ]}
              multi={false}
              value={quantity}
              onChange={(val) => setQuantity(val)}
            />{" "}
            <label className="font-medium text-sm text-text-primary mt-2 mb-1">
              Sabor de masa
            </label>
            <ChipSelector
              options={[
                { label: "Vainilla", value: "1" },
                { label: "Chocolate", value: "2" },
                { label: "Red Velvet", value: "3" },
                { label: "Zanahoria", value: "4" },
                { label: "Limón", value: "5" },
              ]}
              multi={false}
              value={flavor}
              onChange={(val) => setFlavor(val)}
            />
            <label className="font-medium text-sm text-text-primary mt-2 mb-1">
              Relleno
            </label>
            <ChipSelector
              options={[
                { label: "Chocolate", value: "1" },
                { label: "Brigadeiro", value: "2" },
                { label: "Manjar", value: "3" },
                { label: "Crema pastelera", value: "4" },
                { label: "Queso crema", value: "5" },
              ]}
              multi={false}
              value={filling}
              onChange={(val) => setFilling(val)}
            />
            <label className="font-medium text-sm text-text-primary mt-2 mb-1">
              Tipo de cobertura
            </label>
            <ChipSelector
              options={[
                { label: "Sin cobertura", value: "1" },
                { label: "Chocolate", value: "2" },
                { label: "Queso crema", value: "3" },
              ]}
              multi={false}
              value={cover}
              onChange={(val) => setCover(val)}
            />
            <div className="space-y-1.5 mt-2">
              <label className="font-medium text-sm text-text-primary mt-2 mb-1">
                Diseño personalizado
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setDesignImage(e.target.files?.[0] ?? null)}
                className="w-full rounded-lg border border-border-subtle bg-background3 p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-accent-soft focus:border-transparent file:mr-3 file:rounded-lg file:border-0 file:bg-rose-100 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-rose-600 transition hover:file:bg-rose-200"
              />
              {designImage && (
                <p className="text-xs text-stone-500">
                  Archivo:{" "}
                  <span className="font-semibold text-rose-500">
                    {designImage.name}
                  </span>
                </p>
              )}
            </div>
            <Input
              label="Texto en la torta (opcional)"
              helperText="Ej: Feliz cumpleaños, Ana!"
              type="text"
              className="mt-3"
            />
            <Input
              label="Observaciones adicionales (opcional)"
              helperText="Ej: Cumpleaños de 30 años"
              type="text"
              className="mt-3"
            />
          </div>
        </div>
      </section>

      {/* <ProductsList onAddToCart={addToCart} /> */}
    </div>
  );
}
