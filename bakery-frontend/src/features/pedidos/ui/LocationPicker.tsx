import { useEffect, useRef } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";

// Fix Vite breaking Leaflet's bundled marker PNGs
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const DEFAULT_CENTER: [number, number] = [-16.5, -68.15]; // La Paz, Bolivia
const DEFAULT_ZOOM = 13;
const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";

export type LatLng = { lat: number; lng: number };

export interface LocationPickerProps {
  address: string;
  onAddressChange: (address: string) => void;
  location: LatLng | null;
  onLocationChange: (loc: LatLng | null) => void;
}

// Moves map view when location prop changes externally (e.g. forward geocode)
function MapFlyTo({ location }: { location: LatLng | null }) {
  const map = useMap();
  const prevLocation = useRef<LatLng | null>(null);

  useEffect(() => {
    if (
      location &&
      (prevLocation.current?.lat !== location.lat ||
        prevLocation.current?.lng !== location.lng)
    ) {
      map.flyTo([location.lat, location.lng], DEFAULT_ZOOM, { duration: 0.8 });
    }
    prevLocation.current = location;
  }, [location, map]);

  return null;
}

// Handles drag-end events on the map marker
function DraggableMarker({
  location,
  onDragEnd,
}: {
  location: LatLng;
  onDragEnd: (loc: LatLng) => void;
}) {
  return (
    <Marker
      position={[location.lat, location.lng]}
      draggable
      eventHandlers={{
        dragend(e) {
          const { lat, lng } = (e.target as L.Marker).getLatLng();
          onDragEnd({ lat, lng });
        },
      }}
    />
  );
}

// Allows the user to click on the map to place the initial pin
// NOTE: must be defined before LocationPicker to avoid temporal dead zone
function ClickToPlace({
  onPlace,
  hasLocation,
}: {
  onPlace: (loc: LatLng) => void;
  hasLocation: boolean;
}) {
  useMapEvents({
    click(e) {
      if (!hasLocation) {
        onPlace({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    },
  });
  return null;
}

async function reverseGeocode(lat: number, lng: number): Promise<string> {
  const res = await fetch(
    `${NOMINATIM_BASE}/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=es`,
    { headers: { "Accept-Language": "es" } },
  );
  if (!res.ok) return "";
  const data = await res.json();
  return data.display_name ?? "";
}

async function forwardGeocode(query: string): Promise<LatLng | null> {
  const res = await fetch(
    `${NOMINATIM_BASE}/search?format=jsonv2&q=${encodeURIComponent(query)}&limit=1&accept-language=es`,
    { headers: { "Accept-Language": "es" } },
  );
  if (!res.ok) return null;
  const data = await res.json();
  if (!data[0]) return null;
  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
}

export function LocationPicker({
  address,
  onAddressChange,
  location,
  onLocationChange,
}: LocationPickerProps) {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastGeocodedAddress = useRef<string>("");
  const onLocationChangeRef = useRef(onLocationChange);
  useEffect(() => { onLocationChangeRef.current = onLocationChange; });

  // Forward geocode when address changes (debounced 600ms)
  useEffect(() => {
    if (address.trim().length < 5) return;
    if (address === lastGeocodedAddress.current) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const loc = await forwardGeocode(address);
      if (loc) {
        lastGeocodedAddress.current = address;
        onLocationChangeRef.current(loc);
      }
    }, 600);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [address]);

  async function handleDragEnd(loc: LatLng) {
    onLocationChange(loc);
    const resolved = await reverseGeocode(loc.lat, loc.lng);
    if (resolved) {
      lastGeocodedAddress.current = resolved;
      onAddressChange(resolved);
    }
  }

  const center: [number, number] = location
    ? [location.lat, location.lng]
    : DEFAULT_CENTER;

  return (
    <div>
      <label className="block font-mono text-xs text-text-muted mb-1">
        Ubicación en el mapa{" "}
        <span className="text-text-muted">(obligatorio — arrastra el pin para ajustar)</span>
      </label>
      {!location && (
        <p className="font-mono text-xs text-amber-600 mb-1">
          ⚠️ Fija tu ubicación en el mapa para continuar
        </p>
      )}
      <div className="rounded-xl overflow-hidden border border-border-card" style={{ height: 220 }}>
        <MapContainer
          center={center}
          zoom={DEFAULT_ZOOM}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapFlyTo location={location} />
          {location && (
            <DraggableMarker location={location} onDragEnd={handleDragEnd} />
          )}
          <ClickToPlace onPlace={handleDragEnd} hasLocation={!!location} />
        </MapContainer>
      </div>
      {!location && (
        <p className="font-mono text-xs text-text-muted mt-1">
          Escribe tu dirección arriba o haz clic en el mapa para colocar el pin.
        </p>
      )}
    </div>
  );
}
