
import { baseBackendApi } from "../../baseBackendApi";


// types

export interface OverviewStats {
    total_codes_created: number;
    total_codes_redeemed: number;
    active_codes: number;
    invalid_codes: number;
}

export interface FinancialStats {
    total_revenue_from_discounted_orders: number;
    average_discounted_amount: number;
    code_redemption_rate: number;
    unique_customers: number;
}

export interface DiscountSeriesUsage {
    id: number;
    name: string;
    total_codes: number;
    total_redemptions: number;
}

export interface EmailLogs {
    total_emails_sent: number;
    email_success_rate: number;
}

export interface RedemptionLast7Days {
    Fri: number;
    Thu: number;
    Wed: number;
    Tue: number;
    Mon: number;
    Sun: number;
    Sat: number;
}

export interface AdminDiscountUsageStats {
    data: unknown;
    overview: OverviewStats;
    financial: FinancialStats;
    discount_series_usage: DiscountSeriesUsage[];
    email_logs: EmailLogs;
    redemption_last_7_days: RedemptionLast7Days;
}

interface AdminStatsResponse {
    success: boolean;
    message: string;
    data: AdminDiscountUsageStats;
}

// inject endpoints to the base url

export const adminStatsApi = baseBackendApi.injectEndpoints({
    endpoints: (builder) => ({
        // GET: /discount/analysis/usage-stats/
        getAdminDiscountUsageStats: builder.query<AdminDiscountUsageStats, void>({
            query: () => ({
                url: "/discount/analysis/usage-stats/",
                method: "GET",
            }),
            transformResponse: (response: AdminStatsResponse) => response.data,
            providesTags: ["Orders"], // dashboard related, can be anything stable
        }),
    }),
    overrideExisting: false,
});

// hooks

export const { useGetAdminDiscountUsageStatsQuery } = adminStatsApi;
