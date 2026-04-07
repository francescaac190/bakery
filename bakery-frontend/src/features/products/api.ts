import { getJson } from "../../api/http";
import type { Product } from "./types";

const BASE_URL = `${import.meta.env.VITE_API_URL}/menu/products`;
const BACKEND_BASE = import.meta.env.VITE_API_URL.replace("/api/v1", "");

type ApiCategory = {
    id: string;
    name: string;
    imageUrl?: string | null;
};

type ApiProduct = Omit<Product, "categoryName" | "categoryImageUrl"> & {
    category?: ApiCategory;
};

type ApiResponse<T> = {
    success: boolean;
    data: T | null;
    error: unknown;
};

function resolveImageUrl(url?: string | null): string | undefined {
    if (!url) return undefined;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `${BACKEND_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
}

export async function fetchProducts(signal?: AbortSignal): Promise<Product[]> {
    const raw = await getJson<ApiResponse<ApiProduct[]>>(BASE_URL, { signal });

    if (!raw.success || !Array.isArray(raw.data)) {
        throw new Error("Invalid products response from server");
    }

    return raw.data.map((p) => ({
        ...p,
        imageUrl: resolveImageUrl(p.imageUrl),
        categoryName: p.category?.name ?? "",
        categoryImageUrl: resolveImageUrl(p.category?.imageUrl),
    }));
}
