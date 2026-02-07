import { baseBackendApi } from "../../baseBackendApi";

/* ===========================
    API DATA TYPES
=========================== */

export type BodyType = "text" | "html";

export interface EmailTemplate {
    id: number;
    name: string;
    subject: string;
    purpose: string;
    body_type: BodyType;
    body: string;
    is_default: boolean;
    created_at: string;
    updated_at: string;
    created_by: number;
    used_placeholder: string[];
}

export interface FilterOption {
    value: string;
    display: string;
}

/* ===========================
    REQUEST TYPES
=========================== */

export interface CreateTemplateRequest {
    name: string;
    subject: string;
    purpose: string;
    body: string;
    body_type?: BodyType;
    is_default: boolean;
}

export interface UpdateTemplateRequest {
    name?: string;
    subject?: string;
    purpose?: string;
    body?: string;
    body_type?: BodyType;
    is_default?: boolean;
}

export interface GetTemplatesParams {
    purpose?: string;
    body_type?: BodyType;
}

/* ===========================
    RESPONSE TYPES
=========================== */

interface GetTemplatesResponse {
    success: boolean;
    message: string;
    data: {
        email_templates: EmailTemplate[];
        filters: {
            body_types: FilterOption[];
            purposes: FilterOption[];
        };
    };
}

interface TemplateActionResponse {
    success: boolean;
    message: string;
    data: EmailTemplate;
}

interface BasicApiResponse {
    success: boolean;
    message: string;
    data: null | unknown;
}

/* ===========================
    HELPERS (CRITICAL FIX)
=========================== */

/**
 * Ensures HTML body is always valid HTML.
 * Converts plain text line breaks into <p> tags.
 */
const normalizeTemplateBody = (
    body: string,
    bodyType: BodyType
): string => {
    if (bodyType !== "html") return body;

    // If already contains HTML tags, trust it
    if (/<[a-z][\s\S]*>/i.test(body)) {
        return body;
    }

    // Convert plain text to HTML paragraphs
    return body
        .split("\n")
        .filter(Boolean)
        .map(line => `<p>${line.trim()}</p>`)
        .join("");
};

/* ===========================
    EMAIL TEMPLATE API (RTK QUERY)
=========================== */

export const emailTemplateApi = baseBackendApi.injectEndpoints({
    endpoints: (builder) => ({

        /* ===== GET ALL TEMPLATES ===== */
        getAllTemplates: builder.query<
            GetTemplatesResponse,
            GetTemplatesParams | void
        >({
            query: (params) => ({
                url: "/smtp/templates/",
                method: "GET",
                params: params || {},
            }),
            providesTags: ["EmailTemplates"],
        }),

        /* ===== CREATE EMAIL TEMPLATE ===== */
        createEmailTemplate: builder.mutation<
            TemplateActionResponse,
            CreateTemplateRequest
        >({
            query: (newTemplate) => {
                const bodyType: BodyType = newTemplate.body_type ?? "text";

                return {
                    url: "/smtp/templates/",
                    method: "POST",
                    body: {
                        ...newTemplate,
                        body_type: bodyType,
                        body: normalizeTemplateBody(
                            newTemplate.body,
                            bodyType
                        ),
                    },
                };
            },
            invalidatesTags: ["EmailTemplates"],
        }),

        /* ===== UPDATE EMAIL TEMPLATE ===== */
        updateEmailTemplate: builder.mutation<
            TemplateActionResponse,
            { id: number; data: UpdateTemplateRequest }
        >({
            query: ({ id, data }) => {
                const bodyType: BodyType =
                    data.body_type ?? "text";

                return {
                    url: `/smtp/templates/${id}/`,
                    method: "PATCH",
                    body: {
                        ...data,
                        body_type: bodyType,
                        body: data.body
                            ? normalizeTemplateBody(
                                data.body,
                                bodyType
                            )
                            : undefined,
                    },
                };
            },
            invalidatesTags: ["EmailTemplates"],
        }),

        /* ===== DELETE EMAIL TEMPLATE ===== */
        deleteEmailTemplate: builder.mutation<
            BasicApiResponse,
            number
        >({
            query: (id) => ({
                url: `/smtp/templates/${id}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["EmailTemplates"],
        }),

    }),
    overrideExisting: true,
});

/* ===========================
    EXPORT HOOKS
=========================== */

export const {
    useGetAllTemplatesQuery,
    useCreateEmailTemplateMutation,
    useUpdateEmailTemplateMutation,
    useDeleteEmailTemplateMutation,
} = emailTemplateApi;
