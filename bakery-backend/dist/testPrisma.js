"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("./db/prisma");
async function main() {
    // 1️⃣ Create a product
    const product = await prisma_1.prisma.product.create({
        data: {
            name: "Chocolate Cake",
            priceCents: 12000,
            isActive: true
        }
    });
    console.log("Created product:", product);
    // 2️⃣ Fetch all products
    const products = await prisma_1.prisma.product.findMany();
    console.log("All products:", products);
}
main()
    .catch((e) => {
    console.error(e);
})
    .finally(async () => {
    await prisma_1.prisma.$disconnect();
});
//# sourceMappingURL=testPrisma.js.map