import { baseBackendApi } from "../baseBackendApi";

// --- Homepage Feature Endpoints ---
export interface IHomepageFeature {
    id: number;
    sectionTitle: string | null;
    sectionSubTitle: string | null;
}
export interface IHomepageFeatureResponse {
    success: boolean;
    message: string;
    data: IHomepageFeature | IHomepageFeature[];
}

// --- Homepage Hero Endpoints ---
export interface IHomepageHero {
    id: number;
    hero_title: string | null;
    hero_subtitle: string | null;
    button_text: string | null;
    hero_bgImage: string | null; // URL string returned from backend
}
export interface IHomepageHeroResponse {
    success: boolean;
    message: string;
    data: IHomepageHero | IHomepageHero[];
}

// --- Homepage Promotion Endpoints ---
export interface IHomepagePromotion {
    id: number;
    bannerTitle: string | null;
    bannerSubtitle: string | null;
    buttonText: string | null;
    bannerImage: string | null; // URL string returned from backend
}
export interface IHomepagePromotionResponse {
    success: boolean;
    message: string;
    data: IHomepagePromotion | IHomepagePromotion[];
}

// --- Homepage Save Feature Endpoints ---
export interface IHomepageSaveFeature {
    id: number;
    title: string;
    subtitle: string;
    icon: string | null; // URL string returned from backend
}
export interface IHomepageSaveFeatureResponse {
    success: boolean;
    message: string;
    data: IHomepageSaveFeature | IHomepageSaveFeature[];
}

// --- Homepage Technology Endpoints ---
export interface IHomepageTechnology {
    id: number;
    tech_title: string | null;
    tech_description: string | null;
    statics: string | null;
}
export interface IHomepageTechnologyResponse {
    success: boolean;
    message: string;
    data: IHomepageTechnology | IHomepageTechnology[];
}

// --- Injecting the API slice ---
export const homepageCmsApi = baseBackendApi.injectEndpoints({
    endpoints: (builder) => ({
        // Feature (/content/homepage/feautur/)
        getHomepageFeature: builder.query<IHomepageFeatureResponse, void>({
            query: () => "/content/homepage/feautur/",
            providesTags: ["HomepageFeature"],
        }),
        createHomepageFeature: builder.mutation<IHomepageFeatureResponse, FormData>({
            query: (data) => ({ url: "/content/homepage/feautur/", method: "POST", body: data }),
            invalidatesTags: ["HomepageFeature"],
        }),
        updateHomepageFeature: builder.mutation<IHomepageFeatureResponse, { id: number; data: FormData }>({
            query: ({ id, data }) => ({ url: `/content/homepage/feautur/${id}/`, method: "PATCH", body: data }),
            invalidatesTags: ["HomepageFeature"],
        }),
        deleteHomepageFeature: builder.mutation<void, number>({
            query: (id) => ({ url: `/content/homepage/feautur/${id}/`, method: "DELETE" }),
            invalidatesTags: ["HomepageFeature"],
        }),

        // Hero (/content/homepage/hero/)
        getHomepageHero: builder.query<IHomepageHeroResponse, void>({
            query: () => "/content/homepage/hero/",
            providesTags: ["HomepageHero"],
        }),
        createHomepageHero: builder.mutation<IHomepageHeroResponse, FormData>({
            query: (data) => ({ url: "/content/homepage/hero/", method: "POST", body: data }),
            invalidatesTags: ["HomepageHero"],
        }),
        updateHomepageHero: builder.mutation<IHomepageHeroResponse, { id: number; data: FormData }>({
            query: ({ id, data }) => ({ url: `/content/homepage/hero/${id}/`, method: "PATCH", body: data }),
            invalidatesTags: ["HomepageHero"],
        }),
        deleteHomepageHero: builder.mutation<void, number>({
            query: (id) => ({ url: `/content/homepage/hero/${id}/`, method: "DELETE" }),
            invalidatesTags: ["HomepageHero"],
        }),

        // Promotion (/content/homepage/promotion/)
        getHomepagePromotion: builder.query<IHomepagePromotionResponse, void>({
            query: () => "/content/homepage/promotion/",
            providesTags: ["HomepagePromotion"],
        }),
        createHomepagePromotion: builder.mutation<IHomepagePromotionResponse, FormData>({
            query: (data) => ({ url: "/content/homepage/promotion/", method: "POST", body: data }),
            invalidatesTags: ["HomepagePromotion"],
        }),
        updateHomepagePromotion: builder.mutation<IHomepagePromotionResponse, { id: number; data: FormData }>({
            query: ({ id, data }) => ({ url: `/content/homepage/promotion/${id}/`, method: "PATCH", body: data }),
            invalidatesTags: ["HomepagePromotion"],
        }),
        deleteHomepagePromotion: builder.mutation<void, number>({
            query: (id) => ({ url: `/content/homepage/promotion/${id}/`, method: "DELETE" }),
            invalidatesTags: ["HomepagePromotion"],
        }),

        // Save Feature (/content/homepage/save_feature/)
        getHomepageSaveFeature: builder.query<IHomepageSaveFeatureResponse, void>({
            query: () => "/content/homepage/save_feature/",
            providesTags: ["HomepageSaveFeature"],
        }),
        createHomepageSaveFeature: builder.mutation<IHomepageSaveFeatureResponse, FormData>({
            query: (data) => ({ url: "/content/homepage/save_feature/", method: "POST", body: data }),
            invalidatesTags: ["HomepageSaveFeature"],
        }),
        updateHomepageSaveFeature: builder.mutation<IHomepageSaveFeatureResponse, { id: number; data: FormData }>({
            query: ({ id, data }) => ({ url: `/content/homepage/save_feature/${id}/`, method: "PATCH", body: data }),
            invalidatesTags: ["HomepageSaveFeature"],
        }),
        deleteHomepageSaveFeature: builder.mutation<void, number>({
            query: (id) => ({ url: `/content/homepage/save_feature/${id}/`, method: "DELETE" }),
            invalidatesTags: ["HomepageSaveFeature"],
        }),

        // Technology (/content/homepage/technology/)
        getHomepageTechnology: builder.query<IHomepageTechnologyResponse, void>({
            query: () => "/content/homepage/technology/",
            providesTags: ["HomepageTechnology"],
        }),
        createHomepageTechnology: builder.mutation<IHomepageTechnologyResponse, FormData>({
            query: (data) => ({ url: "/content/homepage/technology/", method: "POST", body: data }),
            invalidatesTags: ["HomepageTechnology"],
        }),
        updateHomepageTechnology: builder.mutation<IHomepageTechnologyResponse, { id: number; data: FormData }>({
            query: ({ id, data }) => ({ url: `/content/homepage/technology/${id}/`, method: "PATCH", body: data }),
            invalidatesTags: ["HomepageTechnology"],
        }),
        deleteHomepageTechnology: builder.mutation<void, number>({
            query: (id) => ({ url: `/content/homepage/technology/${id}/`, method: "DELETE" }),
            invalidatesTags: ["HomepageTechnology"],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetHomepageFeatureQuery,
    useCreateHomepageFeatureMutation,
    useUpdateHomepageFeatureMutation,
    useDeleteHomepageFeatureMutation,

    useGetHomepageHeroQuery,
    useCreateHomepageHeroMutation,
    useUpdateHomepageHeroMutation,
    useDeleteHomepageHeroMutation,

    useGetHomepagePromotionQuery,
    useCreateHomepagePromotionMutation,
    useUpdateHomepagePromotionMutation,
    useDeleteHomepagePromotionMutation,

    useGetHomepageSaveFeatureQuery,
    useCreateHomepageSaveFeatureMutation,
    useUpdateHomepageSaveFeatureMutation,
    useDeleteHomepageSaveFeatureMutation,

    useGetHomepageTechnologyQuery,
    useCreateHomepageTechnologyMutation,
    useUpdateHomepageTechnologyMutation,
    useDeleteHomepageTechnologyMutation,
} = homepageCmsApi;
