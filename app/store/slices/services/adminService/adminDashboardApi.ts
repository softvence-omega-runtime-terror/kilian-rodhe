import { baseBackendApi } from "../baseBackendApi";

export interface RecentOrder {
    order_uid: string;
    customer_name: string;
    product_name: string;
    status: string;
    total_paid: string;
    created_at: string;
}

export interface TopProduct {
    order_product_name: string;
    total_sales: number;
    total_revenue: string;
}

export interface DashboardData {
    total_revenue: string;
    total_orders: number;
    total_customers: number;
    ai_designs: number;
    recent_orders: RecentOrder[];
    top_products: TopProduct[];
}

interface DashboardResponse {
    success: boolean;
    message: string;
    data: DashboardData;
}

export const adminDashboardApi = baseBackendApi.injectEndpoints({
    endpoints: (builder) => ({
        getDashboardData: builder.query<DashboardData, void>({
            query: () => ({
                url: "/content/dashboard/",
                method: "GET",
            }),
            // If the response is wrapped in { success, message, data }, use transformResponse
            // Based on the user's provided JSON, it might NOT be wrapped if it's a direct response
            // However, most APIs in this project seem to follow the { success, data } pattern.
            // Looking at the JSON snippet provided, it starts with { "total_revenue": ... }, 
            // so it might be the raw data.
            transformResponse: (response: DashboardData | DashboardResponse) => {
                if ('data' in response && response.data) {
                    return response.data;
                }
                return response as DashboardData;
            },
            providesTags: ["Orders", "Users", "Products"],
        }),
    }),
    overrideExisting: true,
});

export const { useGetDashboardDataQuery } = adminDashboardApi;
