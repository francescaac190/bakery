export const env = {
  port: Number(process.env.PORT ?? 1313),
  nodeEnv: process.env.NODE_ENV ?? "development",
  apiPrefix: process.env.API_PREFIX ?? "/api/v1",
  // In production, set ALLOWED_ORIGIN to your frontend URL (e.g. https://bakery.onrender.com)
  allowedOrigin: process.env.ALLOWED_ORIGIN ?? "*",
};
