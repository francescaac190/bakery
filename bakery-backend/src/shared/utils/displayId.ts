/**
 * Generates a human-readable order ID: BCK-YYYYMMDD-NNN
 * Must be called inside a Prisma transaction to ensure the count is accurate.
 */
export async function generateDisplayId(
  tx: { order: { count: (args: any) => Promise<number> } },
): Promise<string> {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const dateStr = `${yyyy}${mm}${dd}`;

  const startOfDay = new Date(yyyy, now.getMonth(), now.getDate());
  const endOfDay = new Date(yyyy, now.getMonth(), now.getDate() + 1);

  const todayCount = await tx.order.count({
    where: {
      createdAt: { gte: startOfDay, lt: endOfDay },
    },
  });

  const seq = String(todayCount + 1).padStart(3, "0");
  return `BCK-${dateStr}-${seq}`;
}
