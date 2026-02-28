import { baseBackendApi } from "../baseBackendApi";

export interface IOrderAdminItem {
    id: number;
    order_uid: string;
    customer_email: string;
    product: string;
    design_type: string;
    amount: string;
    date: string;
    status: string;
    items: {
        product_name: string;
        design_type: string;
        quantity: number;
    }[];
}

export interface IOrderAdminResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: IOrderAdminItem[];
}

export interface IOrderAdminDetail extends IOrderAdminItem {
    shipping_details?: {
        address: string;
        phone: string;
        customer_name: string;
    };
    payment_details?: {
        method: string;
        date: string;
        subtotal: string;
        shipping_cost: string;
        tax_amount: string;
        total: string;
    };
}

export const orderAdminApi = baseBackendApi.injectEndpoints({
    endpoints: (builder) => ({
        getOrders: builder.query<IOrderAdminResponse, { page?: number; search?: string; status?: string; design_type?: string }>({
            query: (params) => ({
                url: "/content/orders/",
                params,
            }),
            providesTags: ["Orders"],
        }),
        getOrderById: builder.query<IOrderAdminDetail, number>({
            query: (id) => `/content/orders/${id}/`,
            providesTags: (_result, _error, id) => [{ type: "Orders", id }],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetOrdersQuery,
    useGetOrderByIdQuery,
} = orderAdminApi;
