import { Product } from '../types/deals';

export function parseNumber(val: any): number | null {
  if (val === null || val === undefined) return null;
  if (typeof val === 'number') return isNaN(val) ? null : val;
  if (typeof val === 'string') {
    const cleaned = val.replace(/[₹,%\s]/g, '').trim();
    const num = parseFloat(cleaned);
    return isNaN(num) ? null : num;
  }
  return null;
}

export function getParsedPrice(product: Product): number | null {
  return parseNumber(product.PRICE);
}

export function getParsedMrp(product: Product): number | null {
  return parseNumber(product.MRP);
}

export function getParsedRating(product: Product): number {
  const r = parseNumber(product.RATING);
  if (r === null || r < 1) return 4.3;
  return Math.min(5, Math.max(1, r));
}

export function getDiscountPercentage(product: Product): number {
  const rawDiscount = parseNumber(product.DISCOUNT);
  if (rawDiscount !== null) {
    if (rawDiscount > 0 && rawDiscount <= 1.0) {
      return Math.round(rawDiscount * 100);
    }
    return Math.round(rawDiscount);
  }
  const p = getParsedPrice(product);
  const m = getParsedMrp(product);
  if (p !== null && m !== null && m > p && m > 0) {
    return Math.round(((m - p) / m) * 100);
  }
  return 0;
}

export function formatPrice(product: Product): string {
  const p = getParsedPrice(product);
  if (p !== null) {
    return `₹${p.toLocaleString('en-IN')}`;
  }
  if (product.PRICE) {
    const str = String(product.PRICE).trim();
    return str.startsWith('₹') ? str : `₹${str}`;
  }
  return 'Check Deal';
}

export function formatMrp(product: Product): string | null {
  const m = getParsedMrp(product);
  const p = getParsedPrice(product);
  if (m !== null && (p === null || m > p)) {
    return `₹${m.toLocaleString('en-IN')}`;
  }
  return null;
}

export function getCategories(product: Product): string[] {
  if (!product.CATEGORY) return [];
  return product.CATEGORY.split(/[|,>/\\\\]/)
    .map(c => c.trim())
    .filter(Boolean);
}

export function isTopPick(product: Product): boolean {
  return String(product.TOP).toUpperCase().trim() === 'YES';
}

export function isVisible(product: Product): boolean {
  return String(product.SHOW).toUpperCase().trim() !== 'NO';
}

export function getStableId(product: Product, index: number): string {
  const namePart = (product.NAME || '').slice(0, 15).replace(/[^a-zA-Z0-9]/g, '');
  const linkPart = (product.LINK || '').slice(-10).replace(/[^a-zA-Z0-9]/g, '');
  return `${product._ROW || index}_${namePart}_${linkPart}`;
}
