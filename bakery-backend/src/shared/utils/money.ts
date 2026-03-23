export type PriceLine = {
  quantity: number;
  unitPriceCents: number;
};

export function calculateTotalCents(lines: PriceLine[]): number {
  return lines.reduce((acc, line) => acc + line.quantity * line.unitPriceCents, 0);
}
