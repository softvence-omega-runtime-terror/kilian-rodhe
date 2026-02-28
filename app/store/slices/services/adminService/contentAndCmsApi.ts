import { baseBackendApi } from "../baseBackendApi";

// --- Contact Information Interfaces ---
export interface IContactInfo {
    id: number;
    email: string;
    phone_number: number;
    whatsappNumber: number;
    businessAddress: string | null;
}

export interface IContactInfoResponse {
    success: boolean;
    message: string;
    data: IContactInfo;
}

// --- Social Media Interfaces ---
export interface ISocialMedia {
    id: number;
    icon: string; // URL string returned from backend
    name: string | null;
    link: string;
}

export interface ISocialMediaListResponse {
    success: boolean;
    message: string;
    data: ISocialMedia[];
}

export interface ISocialMediaSingleResponse {
    success: boolean;
    message: string;
    data: ISocialMedia;
}

export const contentAndCmsApi = baseBackendApi.injectEndpoints({
    endpoints: (builder) => ({
        // --- Contact Information Endpoints ---
        getContactInfo: builder.query<IContactInfoResponse, void>({
            query: () => "/content/contact/contact_information/",
            providesTags: ["ContactInfo"],
        }),
        createContactInfo: builder.mutation<IContactInfoResponse, Partial<IContactInfo>>({
            query: (data) => ({
                url: "/content/contact/contact_information/",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["ContactInfo"],
        }),
        updateContactInfo: builder.mutation<IContactInfoResponse, Partial<IContactInfo> & { id: number }>({
            query: ({ id, ...patch }) => ({
                url: `/content/contact/contact_information/${id}/`,
                method: "PATCH",
                body: patch,
            }),
            invalidatesTags: ["ContactInfo"],
        }),
        deleteContactInfo: builder.mutation<void, number>({
            query: (id) => ({
                url: `/content/contact/contact_information/${id}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["ContactInfo"],
        }),

        // --- Social Media Endpoints ---
        getSocialMedia: builder.query<ISocialMediaListResponse, void>({
            query: () => "/content/contact/social_media/",
            providesTags: ["SocialMedia"],
        }),
        createSocialMedia: builder.mutation<ISocialMediaSingleResponse, FormData>({
            query: (formData) => ({
                url: "/content/contact/social_media/",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["SocialMedia"],
        }),
        updateSocialMedia: builder.mutation<ISocialMediaSingleResponse, { id: number; data: FormData }>({
            query: ({ id, data }) => ({
                url: `/content/contact/social_media/${id}/`,
                method: "PATCH", // Can be PUT/PATCH based on endpoint, defaulting to PATCH for partial
                body: data,
            }),
            invalidatesTags: ["SocialMedia"],
        }),
        deleteSocialMedia: builder.mutation<void, number>({
            query: (id) => ({
                url: `/content/contact/social_media/${id}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["SocialMedia"],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetContactInfoQuery,
    useCreateContactInfoMutation,
    useUpdateContactInfoMutation,
    useDeleteContactInfoMutation,
    useGetSocialMediaQuery,
    useCreateSocialMediaMutation,
    useUpdateSocialMediaMutation,
    useDeleteSocialMediaMutation,
} = contentAndCmsApi;
