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

  category: number | { id: number; title: string };
  sub_category: number | { id: number; title: string };
  classification: number | { id: number; title: string };
  age_range: number | { id: number; start: number; end: number };

  description?: string;
  images?: string[] | { id: number; image: string }[];
  images_data?: { id: number; image: string }[];
  is_customize?: boolean;

  cloth_size?: string[] | Record<string, number> | null;
  kids_size?: string[] | Record<string, number> | null;
  mug_size?: string[] | Record<string, number> | null;
  is_universal_size?: boolean;
  ai_gen?: boolean;
  ai_letter?: boolean;
  ai_upload?: boolean;

  created_at: string;
  updated_at: string;
  colors?: string[] | string;
}

/* ===========================
   LIST & SINGLE RESPONSES
=========================== */

interface GetProductsResponse {
  success: boolean;
  message: string;
  results: {
    sub_categories: { id: number; title: string }[];
    categories: ApiProduct[];
  };
}

interface GetSingleProductResponse {
  success: boolean;
  message: string;
  data: ApiProduct;
}

interface BasicApiResponse {
  success: boolean;
  message: string;
  data: unknown;
  errors?: unknown;
}

/* ===========================
   UPDATE PRODUCT REQUEST
=========================== */

export interface UpdateProductRequest {
  name: string;
  images?: File[];

  category: number;
  sub_category: number;
  classification: number;
  age_range: number[];

  description: string;
  price: number;
  discount_percentage: number;
  stock_quantity: number;
  sku: string;
  colors: string[];

  is_universal_size: boolean;

  cloth_size?: string[];
  kids_size?: string[];
  mug_size?: string[];

  ai_gen: boolean;
  ai_letter: boolean;
  ai_upload: boolean;

  is_customize?: boolean;
  is_active: boolean;
}

/* ===========================
   PRODUCTS API (RTK QUERY)
=========================== */

export const productsApi = baseBackendApi.injectEndpoints({
  endpoints: (builder) => ({
    /* ===== GET ALL PRODUCTS ===== */

    getAllProducts: builder.query<GetProductsResponse, void>({
      query: () => ({
        url: "/product/products/",
        method: "GET",
      }),
      providesTags: ["Products"],
    }),

    /* ===== GET SINGLE PRODUCT ===== */

    getSingleProduct: builder.query<GetSingleProductResponse, number>({
      query: (id) => ({
        url: `/product/products/${id}/`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [
        { type: "Products", id },
      ],
    }),

    /* ===== UPDATE PRODUCT (PUT / PATCH) ===== */

    updateProduct: builder.mutation<
      BasicApiResponse,
      { id: number; data: UpdateProductRequest; method?: "PUT" | "PATCH" }
    >({
      query: ({ id, data, method = "PATCH" }) => {
        const formData = new FormData();

        formData.append("name", data.name);
        formData.append("category", String(data.category));
        formData.append("sub_category", String(data.sub_category));
        formData.append("classification", String(data.classification));

        // Send age_range as array
        if (data.age_range && data.age_range.length > 0) {
          data.age_range.forEach((id) => {
            formData.append("age_range", String(id));
          });
        }

        formData.append("description", data.description);
        formData.append("price", String(data.price));
        formData.append(
          "discount_percentage",
          String(data.discount_percentage)
        );
        formData.append("stock_quantity", String(data.stock_quantity));
        formData.append("sku", data.sku);

        // Send colors as array
        data.colors.forEach((color) => {
          formData.append("colors", color);
        });

        formData.append(
          "is_universal_size",
          data.is_universal_size ? "true" : "false"
        );
        formData.append("ai_gen", data.ai_gen ? "true" : "false");
        formData.append("ai_letter", data.ai_letter ? "true" : "false");
        formData.append("ai_upload", data.ai_upload ? "true" : "false");
        formData.append(
          "is_customize",
          (data.is_customize ?? false) ? "true" : "false"
        );
        formData.append("is_active", data.is_active ? "true" : "false");

        if (data.cloth_size && data.cloth_size.length > 0) {
          data.cloth_size.forEach((size) => {
            formData.append("cloth_size", size);
          });
        }

        if (data.kids_size && data.kids_size.length > 0) {
          data.kids_size.forEach((size) => {
            formData.append("kids_size", size);
          });
        }

        if (data.mug_size && data.mug_size.length > 0) {
          data.mug_size.forEach((size) => {
            formData.append("mug_size", size);
          });
        }

        data.images?.forEach((file) => {
          formData.append("images", file);
        });

        return {
          url: `/product/products/${id}/`,
          method,
          body: formData,
        };
      },
      invalidatesTags: ["Products"],
    }),

    /* ===== DELETE PRODUCT ===== */

    deleteProduct: builder.mutation<BasicApiResponse, number>({
      query: (id) => ({
        url: `/product/products/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
  }),
  overrideExisting: true,
});

/* ===========================
   EXPORT HOOKS
=========================== */

export const {
  useGetAllProductsQuery,
  useGetSingleProductQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;

