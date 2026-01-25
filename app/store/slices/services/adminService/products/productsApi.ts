//    API RESPONSE TYPES

import { baseBackendApi } from "../../baseBackendApi";

export interface ApiProduct {
  id: number;
  name: string;
  sku: string;
  price: string;
  discounted_price: number;
  discount_percentage: number;
  total_sold: number | null;
  stock_quantity: number;
  is_active: boolean;
  is_new?: boolean;
  is_popular?: boolean;
  is_best_seller?: boolean;
  color_code?: string;
  cloth_size?: string[];
  kids_size?: string[];
  mug_size?: string[];
  is_universal_size?: boolean;
  ai_gen?: boolean;
  ai_letter?: boolean;
  ai_upload?: boolean;

  category: {
    id: number;
    title: string;
  };

  sub_category: {
    id: number;
    title: string;
  };

  classification: {
    id: number;
    title: string;
  };

  age_range: {
    id: number;
    start: number;
    end: number;
  };

  description?: string;
  images?: string[];
  is_customize?: boolean;

  created_at: string;
  updated_at: string;
}

interface GetProductsResponse {
  success: boolean;
  message: string;
  data: {
    sub_categories: { id: number; title: string }[];
    categories: ApiProduct[];
  };
}

interface GetSingleProductResponse {
  success: boolean;
  message: string;
  data: ApiProduct;
}

//    PRODUCTS API (RTK QUERY)

export const productsApi = baseBackendApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all products
    getAllProducts: builder.query<GetProductsResponse, void>({
      query: () => ({
        url: "/product/products/",
        method: "GET",
      }),
      providesTags: ["Products"],
    }),

    // Get single product by ID
    getSingleProduct: builder.query<GetSingleProductResponse, number>({
      query: (id) => ({
        url: `/product/products/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Products", id }],
    }),
  }),
  overrideExisting: false,
});

/* =========================
   EXPORT HOOKS
========================= */

export const { useGetAllProductsQuery, useGetSingleProductQuery } = productsApi;
