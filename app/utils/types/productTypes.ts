export interface ProductImage {
  id: number;
  image: string;
}

export interface Product {
  id: number;
  name: string;
  sku?: string;
  description?: string;
  is_active: boolean;
  category?: { title: string };
  age_range?: { start: number; end: number };
  color_code?: string;
  cloth_size?: string[];
  kids_size?: string[];
  mug_size?: string[];
  stock_quantity?: number | null;
  total_sold?: number | null;
  price?: string | number | null;
  discounted_price?: string | number | null;
  created_at?: string;
  images?: ProductImage[];
}