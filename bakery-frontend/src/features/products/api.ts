import { getJson } from "../../api/http";
import type { Product } from "./types";

const BASE_URL = 'http://localhost:1313/api/v1/menu/products';

type ApiResponse<T> = {
    success: boolean;
    data: T | null;
    error: unknown;
};

export async function fetchProducts(signal?: AbortSignal): Promise<Product[]> {
    const raw = await getJson<ApiResponse<Product[]>>(BASE_URL, { signal });

    if (!raw.success || !Array.isArray(raw.data)) {
        throw new Error("Invalid products response from server");
    }

    return raw.data;
}
