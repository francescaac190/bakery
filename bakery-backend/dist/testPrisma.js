import { PrismaClient } from "@prisma/client/extension";
const prisma = new PrismaClient();
async function main() {
    // 1️⃣ Create a product
    const product = await prisma.product.create({
        data: {
            name: "Chocolate Cake",
            priceCents: 12000,
            isActive: true
        }
    });
    console.log("Created product:", product);
    // 2️⃣ Fetch all products
    const products = await prisma.product.findMany();
    console.log("All products:", products);
}
main()
    .catch((e) => {
    console.error(e);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=testPrisma.js.map