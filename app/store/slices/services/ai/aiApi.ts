import { baseBackendApi } from "../baseBackendApi";

export interface ICustomProduct {
    id: number;
    user: number;
    product: number;
    ai_season_id: string;
    version_count: number;
    versions: ICustomProductVersion[];
}

export interface ICustomProductInVersion {
    id: number;
    name: string;
    category_name: string;
    sub_category_name: string;
    price: number;
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
    product: ICustomProductInVersion;
}

export interface ICustomProductResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: ICustomProduct[];
}

export interface ISaveCustomProductVersionRequest {
    custom_product_id?: number;
    custom_product_data?: {
        product: number;
    };
    product_image: number;
    images: string[];
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
        saveCustomProductVersion: builder.mutation<void, ISaveCustomProductVersionRequest>({
            query: (body) => ({
                url: "/ai/custom-product-versions/",
                method: "POST",
                body,
            }),
            invalidatesTags: ["CustomProducts"],
        }),
        deleteCustomProductVersion: builder.mutation<void, number>({
            query: (id) => ({
                url: `/ai/custom-product-versions/${id}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["CustomProducts"],
        }),
    }),
});

export const {
    useGetCustomProductsQuery,
    useSaveCustomProductVersionMutation,
    useDeleteCustomProductVersionMutation,
} = aiApi;
