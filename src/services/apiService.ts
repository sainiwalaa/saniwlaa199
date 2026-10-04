import { ApiResponse } from '../types/deals';
import { getCachedApiResponse, setCachedApiResponse } from './cacheService';

const API_URL =
  'https://script.google.com/macros/s/AKfycbzA_hAO03gKPWIJ0UwhREB62hEbUusiyqZPO1_yrlmkGfOYsvnh46KZi3CC4rqANrzE/exec';

const TIMEOUT_MS = 15000;

export async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json'
      }
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

export async function fetchDealsApi(retries = 2): Promise<ApiResponse> {
  let lastError: any = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetchWithTimeout(API_URL, TIMEOUT_MS);
      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }
      const data: ApiResponse = await response.json();
      if (!data) {
        throw new Error('Empty response received from API');
      }

      // Save valid data to cache
      setCachedApiResponse(data);
      return data;
    } catch (err: any) {
      lastError = err;
      if (attempt < retries) {
        // Wait 1.5s before retry
        await new Promise(r => setTimeout(r, 1500));
      }
    }
  }

  // If network failed, try to fallback to cached response
  const cached = getCachedApiResponse();
  if (cached && (cached.products?.length || cached.hero?.length)) {
    console.warn('Network failed, falling back to cached response');
    return cached;
  }

  throw lastError || new Error('Failed to fetch deals from server');
}
