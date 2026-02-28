import { baseBackendApi } from "../baseBackendApi";


export interface IAgeRange {
  id: number;
  start: number;
  end: number;
}

export interface ICategory {
  id: number;
  title: string;
  description: string;
  image: string;
  icon: string;
  age_range: IAgeRange[];
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
  colors?: string[];
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
  is_best_seller: boolean;
  is_customize: boolean;
  created_at: string;
  updated_at: string;
}

export interface ISubCategory {
  id: number;
  title: string;
}

export interface IProductResponse {
  success: boolean;
  message: string;
  results: {
    sub_categories: ISubCategory[];
    categories: IProduct[];
  };
  errors: unknown;
}

export interface IProductQueryParams {
  page?: number;
  category?: number;
  subcategory?: number;
  min_price?: number;
  max_price?: number;
  color?: string;
  age_range?: number;
  ordering?: string;
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
    getSavedProducts: builder.query<ISavedProductResponse, void>({
      query: () => ({
        url: "/product/saved-products/",
        method: "GET",
      }),
      providesTags: ["SavedProducts"],
    }),
    saveProduct: builder.mutation<{ message: string; data?: unknown }, { product: number }>({
      query: (body) => ({
        url: "/product/saved-products/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["SavedProducts"],
    }),
    deleteSavedProduct: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/product/saved-products/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["SavedProducts"],
    }),
    getProductReviews: builder.query<IReviewResponse, IReviewQueryParams>({
      query: (params) => ({
        url: "/review/reviews/",
        method: "GET",
        params,
      }),
    }),
  }),
});

export interface ISavedProduct {
  id: number;
  product: IProduct;
  user: { id: number };
  added_at: string;
}

export interface ISavedProductResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ISavedProduct[];
}

export interface IReviewUser {
  id: string;
  email: string;
}

export interface IReviewProduct {
  id: number;
  name: string;
}

export interface IReviewContent {
  star: number;
  comment: string;
  created_date: string;
}

export interface IReviewItem {
  id: number;
  product: IReviewProduct;
  user: IReviewUser;
  review: IReviewContent;
}

export interface IReviewDetail {
  reviews: IReviewItem[];
}

export interface IReviewResponse {
  total_review: number;
  star_reveiw_count: { [key: string]: number };
  review_details: { [key: string]: IReviewDetail };
}

export interface IReviewQueryParams {
  product_id?: number; // Filter by product ID
}

/* =======================
   EXPORT HOOKS
   ======================= */

export const {
  useGetProductCategoriesQuery,
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useGetSavedProductsQuery,
  useSaveProductMutation,
  useDeleteSavedProductMutation,
  useGetProductReviewsQuery,
} = productApi;
