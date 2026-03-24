import "dotenv/config";
import { prisma } from "../src/db/prisma";

type SeedCategory = {
  name: string;
  products: Array<{
    name: string;
    description?: string;
    priceCents: number;
    currency?: string;
    isActive?: boolean;
    isCustom?: boolean;
  }>;
};

const seedCatalog: SeedCategory[] = [
  {
    name: "Cakes",
    products: [
      {
        name: "Chocolate Cake",
        description: "Classic chocolate sponge with ganache.",
        priceCents: 12000,
        isCustom: true,
      },
      {
        name: "Red Velvet Cake",
        description: "Cream cheese frosting, 10 servings.",
        priceCents: 14000,
        isCustom: true,
      },
      {
        name: "Vanilla Berry Cake",
        description: "Vanilla sponge with berries and whipped cream.",
        priceCents: 13500,
        isCustom: true,
      },
    ],
  },
  {
    name: "Pastries",
    products: [
      {
        name: "Butter Croissant",
        description: "Flaky, buttery croissant.",
        priceCents: 1200,
      },
      {
        name: "Cinnamon Roll",
        description: "Cinnamon roll with glaze.",
        priceCents: 1800,
      },
      {
        name: "Pain au Chocolat",
        description: "Pastry with dark chocolate filling.",
        priceCents: 1600,
      },
    ],
  },
  {
    name: "Cookies",
    products: [
      {
        name: "Choco Chip Cookie",
        description: "Single cookie.",
        priceCents: 500,
      },
      {
        name: "Oatmeal Raisin Cookie",
        description: "Soft oatmeal cookie with raisins.",
        priceCents: 550,
      },
      {
        name: "Double Chocolate Cookie",
        description: "Chocolate cookie with chocolate chips.",
        priceCents: 650,
      },
    ],
  },
];

async function seed() {
  const categoryIds: string[] = [];

  for (const category of seedCatalog) {
    const createdCategory = await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: { name: category.name },
    });
    categoryIds.push(createdCategory.id);
  }

  await prisma.product.deleteMany({
    where: { categoryId: { in: categoryIds } },
  });

  for (const category of seedCatalog) {
    const categoryRecord = await prisma.category.findUniqueOrThrow({
      where: { name: category.name },
      select: { id: true },
    });

    await prisma.product.createMany({
      data: category.products.map((product) => ({
        name: product.name,
        description: product.description,
        priceCents: product.priceCents,
        currency: product.currency ?? "BOB",
        isActive: product.isActive ?? true,
        isCustom: product.isCustom ?? false,
        categoryId: categoryRecord.id,
      })),
    });
  }
}

seed()
  .then(async () => {
    console.log("Seed completed");
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Seed failed", error);
    await prisma.$disconnect();
    // process.exit(1);
  });
