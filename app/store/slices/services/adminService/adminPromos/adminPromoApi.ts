import { baseBackendApi } from "../../baseBackendApi";


// request types (create series)

export type DiscountType = "percentage" | "fixed" | "free_shipping";

export interface CreateDiscountCodeRequest {
    number_of_codes: number;
    code_length: number;

    series_name: string;
    code_prefix?: string;

    discount_type: DiscountType;
    amount: number;

    min_purchase_amount?: number;
    max_discount_amount?: number;

    product_applicability: number[];
    category_applicability: number[];

    is_one_time: boolean;
    expiry_date: string;

    is_active: boolean;
    notes?: string;
}


// response types (create series)

export interface ProductApplicability {
    id: number;
    name: string;
}

export interface CategoryApplicability {
    id: number;
    title: string;
}

export interface CreatedDiscountSeriesData {
    id: number;
    total_codes: number;
    series_name: string;
    code_prefix: string;
    discount_type: string;
    amount: number;
    min_purchase_amount: number;
    max_discount_amount: number;

    product_applicability: ProductApplicability[];
    category_applicability: CategoryApplicability[];

    is_one_time: boolean;
    expiry_date: string;
    is_active: boolean;
    notes: string;

    created_by: number;
    created_at: string;
    updated_at: string;

    codes: string[];
}

export interface CreateDiscountCodeResponse {
    success: boolean;
    message: string;
    data: CreatedDiscountSeriesData;
}


// response types (get all codes)

export interface DiscountCodeItem {
    id: number;
    code: string;
    series_name: string;
    code_prefix: string;
    status: string;
    discount: string;
    redeemed_by: string | null;
    expiry: string;
}

export interface GetAllDiscountCodesResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: DiscountCodeItem[];
}


// types for bulk delete

export type BulkDeleteTarget = "discount_code_series" | "discount_code";

export interface BulkDeleteDiscountRequest {
    target: BulkDeleteTarget;
    ids: number[];
}

export interface BulkDeleteDiscountResponse {
    success: boolean;
    message: string;
}


// Injection to the base url

export const adminPromApi = baseBackendApi.injectEndpoints({
    endpoints: (builder) => ({

        // create discount coupon codes
        createDiscountCodes: builder.mutation<
            CreateDiscountCodeResponse,
            CreateDiscountCodeRequest
        >({
            query: (body) => ({
                url: "/discount/discount-codes/",
                method: "POST",
                body,
            }),
            invalidatesTags: ["DiscountCodes"],
        }),

        // get all discount coupon codes
        getAllDiscountCodes: builder.query<DiscountCodeItem[], void>({
            query: () => ({
                url: "/discount/discount-codes/get-all-codes/",
                method: "GET",
            }),
            transformResponse: (response: GetAllDiscountCodesResponse) =>
                response.results,
            providesTags: ["DiscountCodes"],
        }),

        // delete as bulk
        bulkDeleteDiscount: builder.mutation<
            BulkDeleteDiscountResponse,
            BulkDeleteDiscountRequest
        >({
            query: (body) => ({
                url: "/discount/discount-codes/bulk-delete/",
                method: "DELETE",
                body,
            }),
            invalidatesTags: ["DiscountCodes"],
        }),
    }),
    overrideExisting: true,
});


// hooks

export const {
    useCreateDiscountCodesMutation,
    useGetAllDiscountCodesQuery,
    useBulkDeleteDiscountMutation,
} = adminPromApi;
