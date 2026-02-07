import { baseBackendApi } from "../../baseBackendApi";

/* ===========================
    API DATA TYPES
=========================== */

export interface EmailPlaceholder {
    id: number;
    slug_name: string;
    description: string;
    source: string;
    created_at: string;
    updated_at: string;
    created_by: number;
}

export interface AllowedSource {
    value: string;
    display: string;
}

/* ===========================
    REQUEST TYPES
=========================== */

export interface CreatePlaceholderRequest {
    slug_name: string;
    source: string;
    description: string;
}

// For Patch, all fields are optional as you might only update one
export interface UpdatePlaceholderRequest {
    slug_name?: string;
    source?: string;
    description?: string;
}

/* ===========================
    RESPONSE TYPES
=========================== */

interface GetPlaceholdersResponse {
    success: boolean;
    message: string;
    data: {
        placeholders: EmailPlaceholder[];
        allowed_sources: AllowedSource[];
    };
}

interface PlaceholderActionResponse {
    success: boolean;
    message: string;
    data: EmailPlaceholder;
}

interface BasicApiResponse {
    success: boolean;
    message: string;
    data: unknown;
}

/* ===========================
    EMAIL PLACEHOLDER API (RTK QUERY)
=========================== */

export const emailPlaceholderApi = baseBackendApi.injectEndpoints({
    endpoints: (builder) => ({

        /* ===== GET ALL PLACEHOLDERS (GET) ===== */
        getAllPlaceholders: builder.query<GetPlaceholdersResponse, void>({
            query: () => ({
                url: "/smtp/placeholders/",
                method: "GET",
            }),
            providesTags: ["EmailPlaceholders"],
        }),

        /* ===== CREATE PLACEHOLDER (POST) ===== */
        createPlaceholder: builder.mutation<
            PlaceholderActionResponse,
            CreatePlaceholderRequest
        >({
            query: (newPlaceholder) => ({
                url: "/smtp/placeholders/",
                method: "POST",
                body: newPlaceholder,
            }),
            invalidatesTags: ["EmailPlaceholders"],
        }),

        /* ===== UPDATE PLACEHOLDER (PATCH) ===== */
        updatePlaceholder: builder.mutation<
            PlaceholderActionResponse,
            { id: number; data: UpdatePlaceholderRequest }
        >({
            query: ({ id, data }) => ({
                url: `/smtp/placeholders/${id}/`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["EmailPlaceholders"],
        }),

        /* ===== DELETE PLACEHOLDER (DELETE) ===== */
        deletePlaceholder: builder.mutation<BasicApiResponse, number>({
            query: (id) => ({
                url: `/smtp/placeholders/${id}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["EmailPlaceholders"],
        }),

    }),
    overrideExisting: true,
});

/* ===========================
    EXPORT HOOKS
=========================== */

export const {
    useGetAllPlaceholdersQuery,
    useCreatePlaceholderMutation,
    useUpdatePlaceholderMutation,
    useDeletePlaceholderMutation,
} = emailPlaceholderApi;