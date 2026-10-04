export interface Product {
  NAME?: string;
  LINK?: string;
  IMAGE?: string;
  MARKET?: string;
  PRICE?: number | string | null;
  MRP?: number | string | null;
  DISCOUNT?: number | string | null;
  CATEGORY?: string;
  RATING?: number | string | null;
  BADGE?: string;
  KEYWORDS?: string;
  DESCRIPTION?: string;
  TOP?: string;
  SHOW?: string;
  _ROW?: number;
}

export interface HeroItem {
  IMAGE?: string;
  'COLOR CORD'?: string;
  TAXT?: string;
  LINK?: string;
  SHOW?: string;
  _ROW?: number;
}

export interface HeaderCategory {
  CATEGORY?: string;
  TEXTINFO?: string;
  PAGELINK?: string;
  ICON?: string;
  SHOW?: string;
  _ROW?: number;
}

export interface FooterItem {
  'PAGE NAME'?: string;
  CONTENT?: string;
  SHOW?: string;
  _ROW?: number;
}

export interface ApiResponse {
  success: boolean;
  products?: Product[];
  hero?: HeroItem[];
  header?: HeaderCategory[];
  footer?: FooterItem[];
  categories?: any[];
}

export type SortOption =
  | 'smart'
  | 'discount-high'
  | 'price-low'
  | 'price-high'
  | 'rating-high';
