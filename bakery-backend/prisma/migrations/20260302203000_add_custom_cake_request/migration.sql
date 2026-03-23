-- CreateTable
CREATE TABLE "CustomCakeRequest" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "eventDate" TIMESTAMP(3),
    "servings" INTEGER,
    "size" TEXT,
    "flavor" TEXT,
    "filling" TEXT,
    "frosting" TEXT,
    "messageOnCake" TEXT,
    "designNotes" TEXT,
    "allergies" TEXT,
    "inspirationImage" TEXT,
    "budgetCents" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomCakeRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomCakeRequest_orderId_key" ON "CustomCakeRequest"("orderId");

-- AddForeignKey
ALTER TABLE "CustomCakeRequest" ADD CONSTRAINT "CustomCakeRequest_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
