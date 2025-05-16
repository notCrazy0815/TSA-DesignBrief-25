/**
 * Formats a numeric price to a currency string
 * @param price The numeric price to format
 * @returns A formatted price string with $ and 2 decimal places
 */
export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
} 