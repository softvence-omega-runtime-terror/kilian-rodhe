import { baseBackendApi } from "../baseBackendApi";

export interface IAboutContentSection {
    id: number;
    title: string;
    subtitle: string;
    beginning_banner: string | File;
    beginning_title: string;
    beginning_description: string;
}

export interface IAboutContentResponse {
    success: boolean;
    message: string;
    data: IAboutContentSection[];
}

export const cmsAboutApi = baseBackendApi.injectEndpoints({
    endpoints: (builder) => ({
        getAboutContentSection: builder.query<IAboutContentResponse, void>({
            query: () => "/content/about/content_section/",
            providesTags: ["AboutContent"],
        }),
        createAboutContentSection: builder.mutation<IAboutContentResponse, FormData>({
            query: (data) => ({
                url: "/content/about/content_section/",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["AboutContent"],
        }),
        updateAboutContentSection: builder.mutation<IAboutContentResponse, { id: number; data: FormData }>({
            query: ({ id, data }) => ({
                url: `/content/about/content_section/${id}/`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["AboutContent"],
        }),
        deleteAboutContentSection: builder.mutation<IAboutContentResponse, number>({
            query: (id) => ({
                url: `/content/about/content_section/${id}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["AboutContent"],
        }),
    }),
});

export const {
    useGetAboutContentSectionQuery,
    useCreateAboutContentSectionMutation,
    useUpdateAboutContentSectionMutation,
    useDeleteAboutContentSectionMutation,
} = cmsAboutApi;
