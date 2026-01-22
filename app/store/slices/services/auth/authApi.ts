// authApi.ts
import { baseBackendApi } from "../baseBackendApi";

/* =======================
   COMMON INTERFACES
======================= */

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

/* =======================
   REGISTER / OTP RESPONSE
   (UNCHANGED)
======================= */

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

/* =======================
   LOGIN RESPONSE (REAL ONE)
   🔴 THIS WAS YOUR BUG
======================= */

interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
  profile: UserProfile;
}

/* =======================
   API
======================= */

export const authApi = baseBackendApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Register (UNCHANGED)
    register: builder.mutation<ApiResponse, FormData>({
      query: (formData) => ({
        url: "/auth/register",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Users"],
    }),

    // ✅ OTP verification (UNCHANGED)
    verifyOtp: builder.mutation<ApiResponse, { email: string; otp: string }>({
      query: ({ email, otp }) => ({
        url: "/auth/otp_verify",
        method: "POST",
        body: { email, otp },
      }),
    }),

    // ✅ LOGIN (FIXED — DIFFERENT RESPONSE SHAPE)
    login: builder.mutation<LoginResponse, { email: string; password: string }>({
      query: ({ email, password }) => ({
        url: "/auth/login",
        method: "POST",
        body: { email, password },
      }),
    }),

    // ✅ Logout (UNCHANGED)
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

/* =======================
   EXPORT HOOKS
======================= */

export const {
  useRegisterMutation,
  useVerifyOtpMutation,
  useLoginMutation,
  useLogoutMutation,
} = authApi;
