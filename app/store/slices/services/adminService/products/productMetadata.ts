// services/admin/productMetadata.ts

import { baseBackendApi } from "../../baseBackendApi";

/* =========================
   AGE RANGE TYPES
========================= */

export interface AgeRange {
    id: number;
    start: number;
    end: number;
}

interface AgeRangeListResponse {
    success: boolean;
    message: string;
    data: AgeRange[];
}

interface AgeRangeSingleResponse {
    success: boolean;
    message: string;
    data: AgeRange;
}

/* =========================
   CATEGORY TYPES
========================= */

export interface Category {
    id: number;
    title: string;
}

interface CategoryListResponse {
    success: boolean;
    message: string;
    data: Category[];
    errors?: unknown;
}

interface CategorySingleResponse {
    success: boolean;
    message: string;
    data: Category;
}

interface CreateCategoryRequest {
    title: string;
}

interface UpdateCategoryRequest {
    id: number;
    title: string;
}

/* =========================
   CLASSIFICATION TYPES
========================= */

export interface Classification {
    id: number;
    title: string;
}

interface ClassificationListResponse {
    success: boolean;
    message: string;
    data: Classification[];
}

interface ClassificationSingleResponse {
    success: boolean;
    message: string;
    data: Classification;
}

/* =========================
   SUB-CATEGORY TYPES
========================= */

export interface SubCategory {
    id: number;
    title: string;
}

interface SubCategoryListResponse {
    success: boolean;
    message: string;
    data: SubCategory[];
}

interface SubCategorySingleResponse {
    success: boolean;
    message: string;
    data: SubCategory;
}

interface UpdateSubCategoryRequest {
    id: number;
    title: string;
}

/* =========================
   API INJECTION
========================= */

export const productMetadataApi = baseBackendApi.injectEndpoints({
    endpoints: (builder) => ({
        /* ========= AGE RANGE ========= */

        // GET: /product/ages/
        getAllAgeRanges: builder.query<AgeRange[], void>({
            query: () => "/product/ages/",
            transformResponse: (response: AgeRangeListResponse) => response.data,
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({
                            type: "ProductMetadata" as const,
                            id,
                        })),
                        { type: "ProductMetadata", id: "AGE_RANGE_LIST" },
                    ]
                    : [{ type: "ProductMetadata", id: "AGE_RANGE_LIST" }],
        }),

        // GET: /product/ages/{id}/
        getAgeRangeById: builder.query<AgeRange, number>({
            query: (id) => `/product/ages/${id}/`,
            transformResponse: (response: AgeRangeSingleResponse) => response.data,
            providesTags: (_result, _error, id) => [
                { type: "ProductMetadata", id },
            ],
        }),

        /* ========= CATEGORY ========= */

        // GET: /product/categories/
        getAllCategories: builder.query<Category[], void>({
            query: () => "/product/categories/",
            transformResponse: (response: CategoryListResponse) => response.data,
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({
                            type: "ProductMetadata" as const,
                            id,
                        })),
                        { type: "ProductMetadata", id: "CATEGORY_LIST" },
                    ]
                    : [{ type: "ProductMetadata", id: "CATEGORY_LIST" }],
        }),

        // GET: /product/categories/{id}/
        getCategoryById: builder.query<Category, number>({
            query: (id) => `/product/categories/${id}/`,
            transformResponse: (response: CategorySingleResponse) => response.data,
            providesTags: (_result, _error, id) => [
                { type: "ProductMetadata", id },
            ],
        }),

        // POST: /product/categories/
        createCategory: builder.mutation<Category, CreateCategoryRequest>({
            query: (body) => ({
                url: "/product/categories/",
                method: "POST",
                body,
            }),
            transformResponse: (response: CategorySingleResponse) => response.data,
            invalidatesTags: [{ type: "ProductMetadata", id: "CATEGORY_LIST" }],
        }),

        // PATCH: /product/categories/{id}/
        updateCategory: builder.mutation<Category, UpdateCategoryRequest>({
            query: ({ id, title }) => ({
                url: `/product/categories/${id}/`,
                method: "PATCH",
                body: { title },
            }),
            transformResponse: (response: CategorySingleResponse) => response.data,
            invalidatesTags: (_result, _error, { id }) => [
                { type: "ProductMetadata", id },
                { type: "ProductMetadata", id: "CATEGORY_LIST" },
            ],
        }),

        // DELETE: /product/categories/{id}/
        deleteCategory: builder.mutation<{ success: boolean }, number>({
            query: (id) => ({
                url: `/product/categories/${id}/`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _error, id) => [
                { type: "ProductMetadata", id },
                { type: "ProductMetadata", id: "CATEGORY_LIST" },
            ],
        }),

        /* ========= CLASSIFICATION ========= */

        // GET: /product/classifications/
        getAllClassifications: builder.query<Classification[], void>({
            query: () => "/product/classifications/",
            transformResponse: (response: ClassificationListResponse) =>
                response.data,
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({
                            type: "ProductMetadata" as const,
                            id,
                        })),
                        {
                            type: "ProductMetadata",
                            id: "CLASSIFICATION_LIST",
                        },
                    ]
                    : [
                        {
                            type: "ProductMetadata",
                            id: "CLASSIFICATION_LIST",
                        },
                    ],
        }),

        // GET: /product/classifications/{id}/
        getClassificationById: builder.query<Classification, number>({
            query: (id) => `/product/classifications/${id}/`,
            transformResponse: (response: ClassificationSingleResponse) =>
                response.data,
            providesTags: (_result, _error, id) => [
                { type: "ProductMetadata", id },
            ],
        }),

        /* ========= SUB-CATEGORY ========= */

        // GET: /product/sub-categories/
        getAllSubCategories: builder.query<SubCategory[], void>({
            query: () => "/product/sub-categories/",
            transformResponse: (response: SubCategoryListResponse) =>
                response.data,
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({
                            type: "ProductMetadata" as const,
                            id,
                        })),
                        {
                            type: "ProductMetadata",
                            id: "SUB_CATEGORY_LIST",
                        },
                    ]
                    : [
                        {
                            type: "ProductMetadata",
                            id: "SUB_CATEGORY_LIST",
                        },
                    ],
        }),

        // GET: /product/sub-categories/{id}/
        getSubCategoryById: builder.query<SubCategory, number>({
            query: (id) => `/product/sub-categories/${id}/`,
            transformResponse: (response: SubCategorySingleResponse) =>
                response.data,
            providesTags: (_result, _error, id) => [
                { type: "ProductMetadata", id },
            ],
        }),

        // PATCH: /product/sub-categories/{id}/
        updateSubCategory: builder.mutation<
            SubCategory,
            UpdateSubCategoryRequest
        >({
            query: ({ id, title }) => ({
                url: `/product/sub-categories/${id}/`,
                method: "PATCH",
                body: { title },
            }),
            transformResponse: (response: SubCategorySingleResponse) =>
                response.data,
            invalidatesTags: (_result, _error, { id }) => [
                { type: "ProductMetadata", id },
                { type: "ProductMetadata", id: "SUB_CATEGORY_LIST" },
            ],
        }),

        // DELETE: /product/sub-categories/{id}/
        deleteSubCategory: builder.mutation<{ success: boolean }, number>({
            query: (id) => ({
                url: `/product/sub-categories/${id}/`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _error, id) => [
                { type: "ProductMetadata", id },
                { type: "ProductMetadata", id: "SUB_CATEGORY_LIST" },
            ],
        }),
    }),

    overrideExisting: false,
});

/* =========================
   EXPORT HOOKS
========================= */

export const {
    // Age Range
    useGetAllAgeRangesQuery,
    useGetAgeRangeByIdQuery,

    // Category
    useGetAllCategoriesQuery,
    useGetCategoryByIdQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,

    // Classification
    useGetAllClassificationsQuery,
    useGetClassificationByIdQuery,

    // Sub-Category
    useGetAllSubCategoriesQuery,
    useGetSubCategoryByIdQuery,
    useUpdateSubCategoryMutation,
    useDeleteSubCategoryMutation,
} = productMetadataApi;
