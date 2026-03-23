import "dotenv/config";
import { prisma } from "../db/prisma";

type SeedProduct = {
  name: string;
  description?: string;
  imageUrl?: string;
  priceCents: number;
  currency?: string;
  isActive?: boolean;
};

type SeedCategory = {
  name: string;
  imageUrl?: string;
  products: SeedProduct[];
};

const seedCatalog: SeedCategory[] = [
  {
    name: "Cakes",
    imageUrl:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80",
    products: [
      {
        name: "Chocolate Cake",
        description: "Classic chocolate sponge with ganache.",
        imageUrl:
          "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=1200&q=80",
        priceCents: 12000,
      },
      {
        name: "Red Velvet Cake",
        description: "Cream cheese frosting, 10 servings.",
        imageUrl:
          "https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&w=1200&q=80",
        priceCents: 14000,
      },
      {
        name: "Vanilla Berry Cake",
        description: "Vanilla sponge with berries and whipped cream.",
        imageUrl:
          "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?auto=format&fit=crop&w=1200&q=80",
        priceCents: 13500,
      },
    ],
  },
  {
    name: "Pastries",
    imageUrl:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
    products: [
      {
        name: "Butter Croissant",
        description: "Flaky, buttery croissant.",
        imageUrl:
          "https://images.unsplash.com/photo-1555507036-ab794f3f9q1?auto=format&fit=crop&w=1200&q=80",
        priceCents: 1200,
      },
      {
        name: "Cinnamon Roll",
        description: "Cinnamon roll with glaze.",
        imageUrl:
          "https://images.unsplash.com/photo-1583522862616-c7b1f6f6f247?auto=format&fit=crop&w=1200&q=80",
        priceCents: 1800,
      },
      {
        name: "Pain au Chocolat",
        description: "Pastry with dark chocolate filling.",
        imageUrl:
          "https://images.unsplash.com/photo-1483695028939-5bb13f8648b0?auto=format&fit=crop&w=1200&q=80",
        priceCents: 1600,
      },
    ],
  },
  {
    name: "Cookies",
    imageUrl:
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=1200&q=80",
    products: [
      {
        name: "Choco Chip Cookie",
        description: "Single cookie.",
        imageUrl:
          "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=1200&q=80",
        priceCents: 500,
      },
      {
        name: "Oatmeal Raisin Cookie",
        description: "Soft oatmeal cookie with raisins.",
        imageUrl:
          "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=1200&q=80",
        priceCents: 550,
      },
      {
        name: "Double Chocolate Cookie",
        description: "Chocolate cookie with chocolate chips.",
        imageUrl:
          "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=1200&q=80",
        priceCents: 650,
      },
    ],
  },
];

async function seed() {
  for (const category of seedCatalog) {
    const categoryRow = await prisma.category.upsert({
      where: { name: category.name },
      update: { imageUrl: category.imageUrl ?? null } as any,
      create: { name: category.name, imageUrl: category.imageUrl } as any,
    });

    const seededProductNames = new Set(category.products.map((p) => p.name));

    // Keep historical rows linked to orders; just disable products not present in this seed list.
    await prisma.product.updateMany({
      where: {
        categoryId: categoryRow.id,
        name: { notIn: Array.from(seededProductNames) },
      },
      data: { isActive: false },
    });

    for (const product of category.products) {
      const existing = await prisma.product.findFirst({
        where: {
          categoryId: categoryRow.id,
          name: product.name,
        },
        select: { id: true },
      });

      if (existing) {
        await prisma.product.update({
          where: { id: existing.id },
          data: {
            description: product.description ?? null,
            imageUrl: product.imageUrl ?? null,
            priceCents: product.priceCents,
            currency: product.currency ?? "BOB",
            isActive: product.isActive ?? true,
          } as any,
        });
      } else {
        await prisma.product.create({
          data: {
            name: product.name,
            description: product.description,
            imageUrl: product.imageUrl,
            priceCents: product.priceCents,
            currency: product.currency ?? "BOB",
            isActive: product.isActive ?? true,
            categoryId: categoryRow.id,
          } as any,
        });
      }
    }
  }
}

seed()
  .then(async () => {
    console.log("Seed completed successfully");
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Seed failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
