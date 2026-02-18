import { baseBackendApi } from "../baseBackendApi";

export interface ICustomProduct {
    id: number;
    user: number;
    product: number;
    ai_season_id: string;
    version_count: number;
    versions: ICustomProductVersion[];
}

export interface ICustomProductVersion {
    id: number;
    custom_ai_product: number;
    product_image: number;
    image_urls: string[];
    version: number;
    design_cost: string;
    refunded: string;
    created_at: string;
}

export interface ICustomProductResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: ICustomProduct[];
}

export const aiApi = baseBackendApi.injectEndpoints({
    endpoints: (builder) => ({
        getCustomProducts: builder.query<ICustomProductResponse, void>({
            query: () => ({
                url: "/ai/custom-products/",
                method: "GET",
            }),
            providesTags: ["CustomProducts"],
        }),
        saveCustomProductVersion: builder.mutation<any, FormData>({
            query: (body) => ({
                url: "/ai/custom-product-versions/",
                method: "POST",
                body,
            }),
            invalidatesTags: ["CustomProducts"],
        }),
    }),
});

export const {
    useGetCustomProductsQuery,
    useSaveCustomProductVersionMutation,
} = aiApi;
