import { ApiResponse } from '../types/deals';

const CACHE_KEY = 'sainiwalaa_deals_cache_v1';
const WISHLIST_KEY = 'sainiwalaa_wishlist_ids_v1';
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

interface CachedEnvelope {
  timestamp: number;
  data: ApiResponse;
}

export function getCachedApiResponse(): ApiResponse | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const envelope: CachedEnvelope = JSON.parse(raw);
    return envelope.data || null;
  } catch (e) {
    console.warn('Failed to read from cache:', e);
    return null;
  }
}

export function setCachedApiResponse(data: ApiResponse): void {
  try {
    const envelope: CachedEnvelope = {
      timestamp: Date.now(),
      data
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(envelope));
  } catch (e) {
    console.warn('Failed to save to cache:', e);
  }
}

export function getWishlistIds(): Set<string> {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

export function saveWishlistIds(ids: Set<string>): void {
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(Array.from(ids)));
  } catch (e) {
    console.warn('Failed to save wishlist:', e);
  }
}
