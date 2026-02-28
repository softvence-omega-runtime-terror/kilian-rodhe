import { baseBackendApi } from "../baseBackendApi";

export interface ILegalContent {
    id: number;
    title: string | null;
    sub_title: string | null;
    content: string | null;
}

export interface ILegalContentResponse {
    success: boolean;
    message: string;
    data: ILegalContent | ILegalContent[];
}

export const privecyLegalApi = baseBackendApi.injectEndpoints({
    endpoints: (builder) => ({
        // Get all legal content
        getLegalContent: builder.query<ILegalContentResponse, void>({
            query: () => "/content/legal/",
            providesTags: ["LegalContent"],
        }),

        // Create new legal content
        createLegalContent: builder.mutation<ILegalContentResponse, FormData>({
            query: (data) => ({
                url: "/content/legal/",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["LegalContent"],
        }),

        // Update legal content
        updateLegalContent: builder.mutation<ILegalContentResponse, { id: number; data: FormData }>({
            query: ({ id, data }) => ({
                url: `/content/legal/${id}/`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["LegalContent"],
        }),

        // Delete legal content
        deleteLegalContent: builder.mutation<void, number>({
            query: (id) => ({
                url: `/content/legal/${id}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["LegalContent"],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetLegalContentQuery,
    useCreateLegalContentMutation,
    useUpdateLegalContentMutation,
    useDeleteLegalContentMutation,
} = privecyLegalApi;
