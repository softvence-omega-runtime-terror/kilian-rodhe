// authApi.ts
import { baseBackendApi } from "../baseBackendApi";

interface Tokens {
  access: string;
  refresh: string;
}

interface UserProfile {
  first_name: string;
  last_name: string;
  phone_number: string;
  image: string;
}

interface User {
  id: number;
  email: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    profile: UserProfile;
    tokens: Tokens;
  };
  errors?: any;
}

export const authApi = baseBackendApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Register
    register: builder.mutation<ApiResponse, FormData>({
      query: (formData) => ({
        url: "/auth/register",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Users"],
    }),

    // ✅ OTP verification
    verifyOtp: builder.mutation<ApiResponse, { email: string; otp: string }>({
      query: ({ email, otp }) => ({
        url: "/auth/otp_verify",
        method: "POST",
        body: { email, otp },
      }),
    }),

    // ✅ Login endpoint
    login: builder.mutation<ApiResponse, { email: string; password: string }>({
      query: ({ email, password }) => ({
        url: "/auth/login",
        method: "POST",
        body: { email, password },
      }),
      invalidatesTags: ["Users"],
    }),

    // ✅ Logout endpoint
    logout: builder.mutation<{ success: boolean; message: string }, { refresh: string }>({
      query: ({ refresh }) => ({
        url: "/auth/logout/",
        method: "POST",
        body: { refresh },
      }),
      invalidatesTags: ["Users"],
    }),
  }),
  overrideExisting: true,
});

// Export hooks
export const {
  useRegisterMutation,
  useVerifyOtpMutation,
  useLoginMutation, 
  useLogoutMutation,
} = authApi;
