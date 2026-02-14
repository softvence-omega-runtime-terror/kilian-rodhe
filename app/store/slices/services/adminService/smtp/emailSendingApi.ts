import { baseBackendApi } from "../../baseBackendApi";

export interface SendDiscountEmailRequest {
    to_emails?: string[];
    segment?: {
        option: string;
        limit?: number;
    };
    email_template_id: number;
    discount_code_series_id: number;
    subject: string;
    email_body?: string; // In case we want to send custom body.
}

export interface SendDiscountEmailResponse {
    success: boolean;
    message: string;
}

export const emailSendingApi = baseBackendApi.injectEndpoints({
    endpoints: (builder) => ({
        sendDiscountEmail: builder.mutation<SendDiscountEmailResponse, SendDiscountEmailRequest>({
            query: (body) => ({
                url: "/smtp/send-discount-email/",
                method: "POST",
                body,
            }),
        }),
    }),
    overrideExisting: true,
});

export const { useSendDiscountEmailMutation } = emailSendingApi;
