-- AlterTable
ALTER TABLE "CustomCakeRequest" ADD COLUMN     "finalPriceCents" INTEGER,
ADD COLUMN     "pricedAt" TIMESTAMP(3),
ADD COLUMN     "pricedBy" TEXT;
