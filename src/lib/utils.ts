export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function roundToNearest(value: number, nearest: number): number {
  return Math.ceil(value / nearest) * nearest;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}
