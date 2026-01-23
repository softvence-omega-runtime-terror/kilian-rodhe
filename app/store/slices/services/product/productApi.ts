import { baseBackendApi } from "../baseBackendApi";


export interface ICategory {
  id: number;
  title: string;
  total_products: number;
  total_sold: number | null;
  is_new: boolean;
  is_popular: boolean;
  is_best_seller: boolean;
}

export interface ICategoryResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ICategory[];
}

export interface IProductImage {
  id: number;
  image: string;
}

export interface IProduct {
  id: number;
  name: string;
  sku: string;
  price: string;
  discount_percentage: number;
  discounted_price: number;
  stock_quantity: number;
  color_code: string;
  cloth_size: string[];
  kids_size: string[];
  mug_size: string[];
  is_universal_size: boolean;
  ai_gen: boolean;
  ai_letter: boolean;
  ai_upload: boolean;
  category: { id: number; title: string };
  sub_category: { id: number; title: string };
  classification: { id: number; title: string };
  age_range: { id: number; start: number; end: number };
  description: string;
  images: IProductImage[];
  is_active: boolean;
  is_customize: boolean;
  created_at: string;
  updated_at: string;
}

export interface IProductResponse {
  success: boolean;
  message: string;
  data: IProduct[];
  errors: unknown;
}

export interface IProductQueryParams {
  page?: number;
  category?: number;
  subcategory?: number;
  min_price?: number;
  max_price?: number;
  color?: string;
}

export interface IProductDetailsResponse {
  success: boolean;
  message: string;
  data: IProduct;
  errors: unknown;
}

export const productApi = baseBackendApi.injectEndpoints({
  endpoints: (builder) => ({
    getProductCategories: builder.query<ICategoryResponse, void>({
      query: () => ({
        url: "/product/categories/with-count/",
        method: "GET",
      }),
    }),
    getProducts: builder.query<IProductResponse, IProductQueryParams>({
      query: (params) => ({
        url: "/product/products/",
        method: "GET",
        params,
      }),
    }),
    getProductDetails: builder.query<IProductDetailsResponse, number>({
      query: (id) => ({
        url: `/product/products/${id}/`,
        method: "GET",
      }),
    }),
  }),
});

/* =======================
   EXPORT HOOKS
   ======================= */

export const {
  useGetProductCategoriesQuery,
  useGetProductsQuery,
  useGetProductDetailsQuery,
} = productApi;
    