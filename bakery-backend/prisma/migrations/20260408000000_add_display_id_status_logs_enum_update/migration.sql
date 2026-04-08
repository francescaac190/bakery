-- Rename enum values: CONFIRMED -> APPROVED, COMPLETED -> DELIVERED
-- and add new value PICKED_UP
ALTER TYPE "OrderStatus" RENAME VALUE 'CONFIRMED' TO 'APPROVED';
ALTER TYPE "OrderStatus" RENAME VALUE 'COMPLETED' TO 'DELIVERED';
ALTER TYPE "OrderStatus" ADD VALUE 'PICKED_UP' BEFORE 'CANCELLED';

-- Add displayId and adminNotes columns to Order
ALTER TABLE "Order" ADD COLUMN "adminNotes" TEXT;
ALTER TABLE "Order" ADD COLUMN "displayId" TEXT;

-- Backfill displayId for existing orders
UPDATE "Order" o SET "displayId" = sub."newDisplayId"
FROM (
  SELECT "id",
    'BCK-' || TO_CHAR("createdAt", 'YYYYMMDD') || '-' || LPAD(
      ROW_NUMBER() OVER (PARTITION BY DATE_TRUNC('day', "createdAt") ORDER BY "createdAt")::TEXT,
      3, '0'
    ) AS "newDisplayId"
  FROM "Order"
  WHERE "displayId" IS NULL
) sub
WHERE o."id" = sub."id";

-- Make displayId required and unique
ALTER TABLE "Order" ALTER COLUMN "displayId" SET NOT NULL;
CREATE UNIQUE INDEX "Order_displayId_key" ON "Order"("displayId");

-- Create OrderStatusLog table
CREATE TABLE "OrderStatusLog" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL,
    "changedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderStatusLog_pkey" PRIMARY KEY ("id")
);

-- Create index on orderId
CREATE INDEX "OrderStatusLog_orderId_idx" ON "OrderStatusLog"("orderId");

-- Add foreign key
ALTER TABLE "OrderStatusLog" ADD CONSTRAINT "OrderStatusLog_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
