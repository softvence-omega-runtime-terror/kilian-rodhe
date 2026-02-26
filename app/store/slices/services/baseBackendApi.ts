import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AuthState } from "../authSlice";

export const baseBackendApi = createApi({
  reducerPath: "baseBackendApi",

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,

    prepareHeaders: (headers, { getState }) => {
      const state = getState() as { auth: AuthState };
      const token = state.auth?.access;

      if (token) {
        const cleanToken = token.replace(/^"(.*)"$/, '$1');
        headers.set("Authorization", `Bearer ${cleanToken}`);
      }

      // These headers help with Django CSRF/Origin checks when using JWT
      headers.set("X-Requested-With", "XMLHttpRequest");
      headers.set("Accept", "application/json");
      // Access-Control-Allow-Origin
      // headers.set("Origin", "https://thundra.de");
      // headers.set("Access-Control-Allow-Origin", "https://thundra.de");
      // headers.set("Access-Control-Allow-Credentials", "true");
      // headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
      // headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

      return headers;
    },

    credentials: "include",
  }),

  tagTypes: ["Products", "Users", "Orders", "SavedProducts", "Cart", "ProductMetadata", "DiscountCodes", "EmailPlaceholders", "EmailTemplates", "CustomProducts", "Wallet", "AboutContent", "AddressBook"],

  endpoints: () => ({}),
});
