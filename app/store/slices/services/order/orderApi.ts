import { baseBackendApi } from "../baseBackendApi";

export interface ICartItemProduct {
  id: number;
  name: string;
  price: string;
  discounted_price: number | null;
  images: { id: number; image: string }[];
  color_code?: string;
}

export interface ICartItem {
  id: number;
  product: ICartItemProduct;
  quantity: number;
  subtotal: number; // or total_price
}

export interface ICartResponse {
  id: number;
  items: ICartItem[];
  total_price: number;
}
//git status
export const orderApi = baseBackendApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<any, void>({
      query: () => ({
        url: "/order/cart/",
        method: "GET",
      }),
      providesTags: ["Cart"],
    }),
    addToCart: builder.mutation<any, { product: number; quantity: number }>({
      query: (body) => ({
        url: "/order/cart/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),
    updateCartItem: builder.mutation<any, { product_id: number; quantity: number }>({
      query: ({ product_id, quantity }) => ({
        url: `/order/cart/${product_id}/`,
        method: "PATCH",
        body: { quantity }
      }),
      invalidatesTags: ["Cart"],
    }),
    deleteCartItem: builder.mutation<any, number>({
      query: (id) => ({
        url: `/order/cart/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useDeleteCartItemMutation
} = orderApi;
