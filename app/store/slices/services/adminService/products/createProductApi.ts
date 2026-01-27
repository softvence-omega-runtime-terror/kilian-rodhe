
import { baseBackendApi } from "../../baseBackendApi";

//    CREATE PRODUCT REQUEST

export interface CreateProductRequest {
  name: string;
  images: File[];

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

//    CREATE PRODUCT RESPONSE

interface CreateProductResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
  };
}

//    CREATE PRODUCT API

export const createProductApi = baseBackendApi.injectEndpoints({
  endpoints: (builder) => ({
    createProduct: builder.mutation<
      CreateProductResponse,
      CreateProductRequest
    >({
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
          formData.append(
            "kids_size",
            JSON.stringify(payload.kids_size)
          );
        }

        if (payload.mug_size) {
          formData.append(
            "mug_size",
            JSON.stringify(payload.mug_size)
          );
        }

        // ---------- MULTIPLE IMAGES ----------
        payload.images.forEach((file) => {
          formData.append("images", file);
        });

        return {
          url: "/product/products/",
          method: "POST",
          body: formData,
        };
      },

      invalidatesTags: ["Products"],
    }),
  }),
  overrideExisting: false,
});

/* =========================
   EXPORT HOOK
========================= */

export const { useCreateProductMutation } = createProductApi;
