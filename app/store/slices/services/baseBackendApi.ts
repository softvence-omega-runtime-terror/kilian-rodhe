import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { PersistPartial } from "redux-persist/es/persistReducer";
import { AuthState } from "../authSlice";

export const baseBackendApi = createApi({
  reducerPath: "baseBackendApi",

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,

    prepareHeaders: (headers, { getState }) => {
      const state = getState() as {
        auth: AuthState & PersistPartial;
      };
        
      const token = state.auth.access;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    //  return the headers with token access and refresh
      return headers;
    },

    credentials: "include",
  }),

  tagTypes: ["Products", "Users", "Orders"],

  endpoints: () => ({}),
});
