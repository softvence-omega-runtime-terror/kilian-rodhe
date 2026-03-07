import { baseBackendApi } from "../baseBackendApi";

export interface IDiscountCheckRequest {
    order_code: string;
    product_codes: Record<string, string>;
}

export interface IDiscountData {
    discount_type: "percentage" | "fixed_amount";
    discount_amount: number;
    min_purchase_amount: number;
    max_discount_amount: number;
    message?: string;
}

export interface IDiscountCheckResponse {
    success: boolean;
    message: string;
    data: {
        order: {
            is_valid: boolean;
            data: IDiscountData;
        };
        product: Record<string, {
            is_valid: boolean;
            data: IDiscountData;
        }>;
    };
}

export const discountApi = baseBackendApi.injectEndpoints({
    endpoints: (builder) => ({
        checkDiscountApplicability: builder.mutation<IDiscountCheckResponse, IDiscountCheckRequest>({
            query: (body) => ({
                url: "/discount/check-discount-applicability/",
                method: "POST",
                body,
            }),
        }),
    }),
});

export const { useCheckDiscountApplicabilityMutation } = discountApi;
