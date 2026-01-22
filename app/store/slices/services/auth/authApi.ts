import { baseBackendApi } from "../baseBackendApi";

interface Tokens {
  access: string;
  refresh: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: number;
      email: string;
    };
    profile: any;
    tokens: Tokens;
  };
  errors: any;
}

export const authApi = baseBackendApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<ApiResponse, FormData>({
      query: (formData) => ({
        url: "/auth/register",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Users"],
    }),

    verifyOtp: builder.mutation<ApiResponse, { email: string; otp: string }>({
      query: ({ email, otp }) => ({
        url: "/auth/otp_verify",
        method: "POST",
        body: { email, otp },
      }),
    }),
  }),
  overrideExisting: true,
});

export const { useRegisterMutation, useVerifyOtpMutation } = authApi;
