import type { Response } from "express";
export declare function sendSuccess<T>(res: Response, data: T, statusCode?: number): Response<any, Record<string, any>>;
export declare function sendError(res: Response, message: string, statusCode?: number, details?: unknown): Response<any, Record<string, any>>;
//# sourceMappingURL=response.d.ts.map