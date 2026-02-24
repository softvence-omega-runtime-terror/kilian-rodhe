import { baseBackendApi } from "../../baseBackendApi";

/* ===========================
   CREATE / UPDATE REQUEST
=========================== */

export interface ProductRequest {
  name: string;
  images?: File[];

  category: number;
  sub_category: number;
  classification: number;
  age_range?: number[]; // Changed to number[] to allow sending as array

  description: string;
  price: number;
  discount_percentage: number;
  stock_quantity: number;
  sku: string;
  colors: string[]; // Changed to string[]

  is_universal_size: boolean;

  cloth_size?: string[]; // Changed to string[]
  kids_size?: string[]; // Changed to string[]
  mug_size?: string[]; // Changed to string[]

  ai_gen: boolean;
  ai_letter: boolean;
  ai_upload: boolean;

  is_customize?: boolean;
  is_active: boolean;
}

/* ===========================
   COMMON RESPONSE
=========================== */

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  errors?: unknown;
}

/* ===========================
   PRODUCTS API
=========================== */

export const productsApi = baseBackendApi.injectEndpoints({
  endpoints: (builder) => ({
    /* ===========================
       CREATE PRODUCT
    =========================== */

    createProduct: builder.mutation<ApiResponse<{ id: number }>, ProductRequest>(
      {
        query: (payload) => {
          const formData = new FormData();

          // ---------- BASIC FIELDS ----------
          formData.append("name", payload.name);
          formData.append("category", String(payload.category));
          formData.append("sub_category", String(payload.sub_category));
          formData.append("classification", String(payload.classification));

          // Send age_range as array
          if (payload.age_range && payload.age_range.length > 0) {
            payload.age_range.forEach((id) => {
              formData.append("age_range", String(id));
            });
          }

          formData.append("description", payload.description);
          formData.append("price", String(payload.price));
          formData.append(
            "discount_percentage",
            String(payload.discount_percentage)
          );
          formData.append("stock_quantity", String(payload.stock_quantity));
          formData.append("sku", payload.sku);

          // Send colors as array
          payload.colors.forEach((color) => {
            formData.append("colors", color);
          });

          // ---------- BOOLEAN FIELDS ----------
          formData.append(
            "is_universal_size",
            payload.is_universal_size ? "true" : "false"
          );
          formData.append("ai_gen", payload.ai_gen ? "true" : "false");
          formData.append("ai_letter", payload.ai_letter ? "true" : "false");
          formData.append("ai_upload", payload.ai_upload ? "true" : "false");
          formData.append(
            "is_customize",
            (payload.is_customize ?? false) ? "true" : "false"
          );
          formData.append("is_active", payload.is_active ? "true" : "false");

          // ---------- SIZE ARRAYS ----------
          if (payload.cloth_size && payload.cloth_size.length > 0) {
            payload.cloth_size.forEach((size) => {
              formData.append("cloth_size", size);
            });
          }

          if (payload.kids_size && payload.kids_size.length > 0) {
            payload.kids_size.forEach((size) => {
              formData.append("kids_size", size);
            });
          }

          if (payload.mug_size && payload.mug_size.length > 0) {
            payload.mug_size.forEach((size) => {
              formData.append("mug_size", size);
            });
          }

          // ---------- IMAGES ----------
          // Reverted to "images" as requested. Using repeated key format for multipart/form-data.
          payload.images?.forEach((file) => {
            formData.append("images", file);
          });

          return {
            url: "/product/products/",
            method: "POST",
            body: formData,
          };
        },
        invalidatesTags: ["Products"],
      }
    ),

    /* ===========================
       UPDATE PRODUCT (PUT / PATCH)
    =========================== */

    updateProduct: builder.mutation<
      ApiResponse,
      { id: number; data: ProductRequest; method?: "PUT" | "PATCH" }
    >({
      query: ({ id, data, method = "PATCH" }) => {
        const formData = new FormData();

        // ---------- BASIC FIELDS ----------
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

        // ---------- BOOLEAN FIELDS ----------
        formData.append("is_universal_size", data.is_universal_size ? "true" : "false");
        formData.append("ai_gen", data.ai_gen ? "true" : "false");
        formData.append("ai_letter", data.ai_letter ? "true" : "false");
        formData.append("ai_upload", data.ai_upload ? "true" : "false");
        formData.append(
          "is_customize",
          (data.is_customize ?? false) ? "true" : "false"
        );
        formData.append("is_active", data.is_active ? "true" : "false");

        // ---------- SIZE ARRAYS ----------
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

        // ---------- IMAGES ----------
        // Reverted to "images" as requested.
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

    /* ===========================
       DELETE PRODUCT
    =========================== */

    deleteProduct: builder.mutation<ApiResponse, number>({
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
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
