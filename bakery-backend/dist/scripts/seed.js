import "dotenv/config";
import { prisma } from "../db/prisma";
async function seed() {
    const cakesCategory = await prisma.category.upsert({
        where: { name: "Cakes" },
        update: {},
        create: { name: "Cakes" },
    });
    const pastriesCategory = await prisma.category.upsert({
        where: { name: "Pastries" },
        update: {},
        create: { name: "Pastries" },
    });
    const cookiesCategory = await prisma.category.upsert({
        where: { name: "Cookies" },
        update: {},
        create: { name: "Cookies" },
    });
    await prisma.product.deleteMany({
        where: {
            categoryId: {
                in: [cakesCategory.id, pastriesCategory.id, cookiesCategory.id],
            },
        },
    });
    await prisma.product.createMany({
        data: [
            {
                name: "Chocolate Cake",
                description: "Classic chocolate sponge with ganache.",
                priceCents: 12000,
                categoryId: cakesCategory.id,
            },
            {
                name: "Red Velvet Cake",
                description: "Cream cheese frosting, 10 servings.",
                priceCents: 14000,
                categoryId: cakesCategory.id,
            },
            {
                name: "Croissant",
                description: "Butter croissant.",
                priceCents: 1200,
                categoryId: pastriesCategory.id,
            },
            {
                name: "Cinnamon Roll",
                description: "Cinnamon roll with glaze.",
                priceCents: 1800,
                categoryId: pastriesCategory.id,
            },
            {
                name: "Choco Chip Cookie",
                description: "Single cookie.",
                priceCents: 500,
                categoryId: cookiesCategory.id,
            },
        ],
    });
}
seed()
    .then(async () => {
    console.log("Seed completed");
    await prisma.$disconnect();
})
    .catch(async (error) => {
    console.error("Seed failed", error);
    await prisma.$disconnect();
    process.exit(1);
});
//# sourceMappingURL=seed.js.map