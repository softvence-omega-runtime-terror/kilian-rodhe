import { baseBackendApi } from "../baseBackendApi";

export interface ICustomerAdminItem {
    id: number;
    email: string;
    first_name: string | null;
    last_name: string | null;
    segment: string;
    total_orders: number;
    total_spent: number | string;
    preferred_design: string;
    last_order: string | null;
    created_at: string;
}

export interface ICustomerAdminResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: ICustomerAdminItem[];
}

export const customerAdminApi = baseBackendApi.injectEndpoints({
    endpoints: (builder) => ({
        getCustomers: builder.query<ICustomerAdminResponse, { page?: number; search?: string; segment?: string; preferred_design?: string }>({
            query: (params) => ({
                url: "/content/customers/",
                params,
            }),
            providesTags: ["Customers"],
        }),
        getCustomerById: builder.query<ICustomerAdminItem, number>({
            query: (id) => `/content/customers/${id}/`,
            providesTags: (_result, _error, id) => [{ type: "Customers", id }],
        }),
        deleteCustomer: builder.mutation<void, number>({
            query: (id) => ({
                url: `/content/customers/${id}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["Customers"],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetCustomersQuery,
    useGetCustomerByIdQuery,
    useDeleteCustomerMutation,
} = customerAdminApi;
