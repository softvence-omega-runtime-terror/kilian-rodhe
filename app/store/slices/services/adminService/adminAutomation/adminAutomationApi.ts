import { baseBackendApi } from "../../baseBackendApi";

export interface AutomationData {
    id: number;
    name: string;
    event_type: string;
    delay_seconds: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    discount_series: number;
    email_template: number;
    created_by: number;
}

export interface CreateAutomationRequest {
    name: string;
    event_type: string;
    discount_series: number;
    email_template: number;
    delay_seconds: number;
    is_active?: boolean;
}

export interface AutomationResponse {
    success: boolean;
    message: string;
    data: AutomationData;
}

export interface GetAutomationsResponse {
    success: boolean;
    message: string;
    data: AutomationData[];
}

export const adminAutomationApi = baseBackendApi.injectEndpoints({
    endpoints: (builder) => ({
        getAutomations: builder.query<AutomationData[], void>({
            query: () => ({
                url: "/automation/manage/",
                method: "GET",
            }),
            transformResponse: (response: GetAutomationsResponse | AutomationData[]) => {
                // Handle both shapes: plain array OR { data: [...] }
                if (Array.isArray(response)) return response;
                return Array.isArray(response.data) ? response.data : [];
            },
            providesTags: ["Automations"],
        }),
        createAutomation: builder.mutation<AutomationResponse, CreateAutomationRequest>({
            query: (body) => ({
                url: "/automation/manage/",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Automations"],
        }),
        deleteAutomation: builder.mutation<{ success: boolean; message: string }, number>({
            query: (id) => ({
                url: `/automation/manage/${id}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["Automations"],
        }),
        toggleAutomationStatus: builder.mutation<AutomationResponse, { id: number; is_active: boolean }>({
            query: ({ id, is_active }) => ({
                url: `/automation/manage/${id}/`,
                method: "PATCH",
                body: { is_active },
            }),
            invalidatesTags: ["Automations"],
        }),
    }),
    overrideExisting: true,
});

export const {
    useGetAutomationsQuery,
    useCreateAutomationMutation,
    useDeleteAutomationMutation,
    useToggleAutomationStatusMutation,
} = adminAutomationApi;
