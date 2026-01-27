import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { PersistPartial } from "redux-persist/es/persistReducer";
import { AuthState } from "../authSlice";

export const baseBackendApi = createApi({
  reducerPath: "baseBackendApi",

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,

    prepareHeaders: (headers, { getState }) => {
      // Correctly access state - it might be RootState or any if type-safe RootState is not imported here
      const state = getState() as any;
      const token = state.auth?.access;

      if (token) {
        // Ensure no quotes remain (already handled in slice, but defensive)
        const cleanToken = token.replace(/^"(.*)"$/, '$1');
        headers.set("Authorization", `Bearer ${cleanToken}`);
      }
    //  return the headers with token access and refresh
      return headers;
    },

    credentials: "include",
  }),

  tagTypes: ["Products", "Users", "Orders", "SavedProducts", "Cart"],

  endpoints: () => ({}),
});
