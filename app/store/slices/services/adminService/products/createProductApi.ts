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
  age_range: number;

  description: string;
  price: number;
  discount_percentage: number;
  stock_quantity: number;
  sku: string;
  colors: string;

  is_universal_size: boolean;

  cloth_size?: Record<string, number>;
  kids_size?: Record<string, number>;
  mug_size?: Record<string, number>;

  ai_gen: boolean;
  ai_letter: boolean;
  ai_upload: boolean;

  is_customize?: boolean;
  is_active: boolean;
}

/* ===========================
   COMMON RESPONSE
=========================== */

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  errors?: any;
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
          formData.append("age_range", String(payload.age_range));
          formData.append("description", payload.description);
          formData.append("price", String(payload.price));
          formData.append(
            "discount_percentage",
            String(payload.discount_percentage)
          );
          formData.append("stock_quantity", String(payload.stock_quantity));
          formData.append("sku", payload.sku);
          formData.append("colors", payload.colors);

          // ---------- BOOLEAN FIELDS ----------
          formData.append(
            "is_universal_size",
            String(payload.is_universal_size)
          );
          formData.append("ai_gen", String(payload.ai_gen));
          formData.append("ai_letter", String(payload.ai_letter));
          formData.append("ai_upload", String(payload.ai_upload));
          formData.append(
            "is_customize",
            String(payload.is_customize ?? false)
          );
          formData.append("is_active", String(payload.is_active));

          // ---------- SIZE OBJECTS ----------
          if (payload.cloth_size) {
            formData.append(
              "cloth_size",
              JSON.stringify(payload.cloth_size)
            );
          }

          if (payload.kids_size) {
            formData.append("kids_size", JSON.stringify(payload.kids_size));
          }

          if (payload.mug_size) {
            formData.append("mug_size", JSON.stringify(payload.mug_size));
          }

          // ---------- IMAGES ----------
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
        formData.append("age_range", String(data.age_range));
        formData.append("description", data.description);
        formData.append("price", String(data.price));
        formData.append(
          "discount_percentage",
          String(data.discount_percentage)
        );
        formData.append("stock_quantity", String(data.stock_quantity));
        formData.append("sku", data.sku);
        formData.append("colors", data.colors);

        // ---------- BOOLEAN FIELDS ----------
        formData.append(
          "is_universal_size",
          String(data.is_universal_size)
        );
        formData.append("ai_gen", String(data.ai_gen));
        formData.append("ai_letter", String(data.ai_letter));
        formData.append("ai_upload", String(data.ai_upload));
        formData.append(
          "is_customize",
          String(data.is_customize ?? false)
        );
        formData.append("is_active", String(data.is_active));

        // ---------- SIZE OBJECTS ----------
        if (data.cloth_size) {
          formData.append("cloth_size", JSON.stringify(data.cloth_size));
        }

        if (data.kids_size) {
          formData.append("kids_size", JSON.stringify(data.kids_size));
        }

        if (data.mug_size) {
          formData.append("mug_size", JSON.stringify(data.mug_size));
        }

        // ---------- IMAGES ----------
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
  overrideExisting: false,
});

/* ===========================
   EXPORT HOOKS
=========================== */

export const {
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
