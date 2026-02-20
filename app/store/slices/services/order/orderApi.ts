import { baseBackendApi } from "../baseBackendApi";

export interface ICartItemProduct {
  id: number;
  name: string;
  price: string;
  discounted_price: number | null;
  images: { id: number; image: string }[];
  color_code?: string;
  colors?: string[];
  cloth_size?: string[];
  kids_size?: string[];
  mug_size?: string[];
}

export interface ICartItem {
  id: number;
  product: ICartItemProduct;
  quantity: number;
  subtotal: number; // or total_price
}

export interface ICartResponse {
  id: number;
  cards: ICartItem[];
  total_price: number;
}

export interface IShipmentType {
  id: number;
  title: string;
  description: string;
  cost: number;
}

export interface IShipmentTypeResponse {
  success: boolean;
  message: string;
  data: IShipmentType[];
}

export interface IOrderItem {
  id: number;
  order_product_id: number;
  order_product_name: string;
  order_product_category: string;
  order_product_sub_category: string;
  order_product_classification: string;
  order_product_price: string;
  order_product_size: string[];
  order_product_color_code: string[];
  quantity: number;
  subtotal: string;
}

export interface IOrder {
  id: number;
  order_uid: string;
  status: string;
  items: IOrderItem[];
  product_total_amount: number;
  shipping_cost: number;
  tax: number;
  total_cost: number;
  created_at: string;
}

export interface IOrderResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: IOrder[];
}

export const orderApi = baseBackendApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<ICartResponse, void>({
      query: () => ({
        url: "/order/cart/",
        method: "GET",
      }),
      providesTags: ["Cart"],
    }),
    addToCart: builder.mutation<ICartResponse, { product: number; quantity: number }>({
      query: (body) => ({
        url: "/order/cart/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),
    updateCartItem: builder.mutation<ICartResponse, { product_id: number; quantity: number }>({
      query: ({ product_id, quantity }) => ({
        url: `/order/cart/${product_id}/`,
        method: "PATCH",
        body: { quantity }
      }),
      invalidatesTags: ["Cart"],
    }),
    deleteCartItem: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/order/cart/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
    checkout: builder.mutation<any, { card_products: any[]; shipping_id: number }>({
      query: (body) => ({
        url: "/order/orders/checkout/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cart", "Orders"],
    }),
    getShipmentsType: builder.query<IShipmentTypeResponse, void>({
      query: () => ({
        url: "/order/shipments_type/",
        method: "GET",
      }),
    }),
    getOrders: builder.query<IOrderResponse, void>({
      query: () => ({
        url: "/order/orders/",
        method: "GET",
      }),
      providesTags: ["Orders"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useDeleteCartItemMutation,
  useCheckoutMutation,
  useGetShipmentsTypeQuery,
  useGetOrdersQuery
} = orderApi;
