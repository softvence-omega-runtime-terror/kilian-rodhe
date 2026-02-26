import { baseBackendApi } from "../baseBackendApi";

export interface IWallet {
    id: number;
    free_generations: number;
    generation_balance: string;
    customer: number;
}

export interface IWalletResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: IWallet[];
}

export interface ITopUpRequest {
    amount: number;
    currency?: string;
    payment_method?: "stripe" | "paypal" | "";
    success_url: string;
    cancel_url: string;
}

export interface ITopUpResponse {
    success: boolean;
    message: string;
    data: {
        payment_id: number;
        session_id: string;
        session_url: string;
        payment_provider: string;
    };
}

export const walletApi = baseBackendApi.injectEndpoints({
    endpoints: (builder) => ({
        getWallet: builder.query<IWalletResponse, void>({
            query: () => ({
                url: "/wallet/manage/",
                method: "GET",
            }),
            providesTags: ["Wallet"],
        }),
        deductBalance: builder.mutation<{ success: boolean; message: string }, void>({
            query: () => ({
                url: "/wallet/manage/deduct/",
                method: "POST",
            }),
            invalidatesTags: ["Wallet"],
        }),
        topUp: builder.mutation<ITopUpResponse, ITopUpRequest>({
            query: (body) => ({
                url: "/wallet/top-up/",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Wallet"],
        }),
    }),
});

export const {
    useGetWalletQuery,
    useDeductBalanceMutation,
    useTopUpMutation,
} = walletApi;
