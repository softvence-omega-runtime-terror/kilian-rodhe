import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { PersistPartial } from "redux-persist/es/persistReducer";

/* ================= TYPES ================= */

export interface Profile {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  image?: string;
  [key: string]: any;
}

export interface User {
  id: number;
  email: string;
  profile?: Profile;
  [key: string]: any;
}

export interface AuthState {
  user: User | null;
  access: string | null;
  refresh: string | null;
  role: string | null; // 🔹 ADD ROLE HERE
  isAuthenticated: boolean;
  isLoading: boolean;
}

/* ================= INITIAL STATE ================= */

const initialState: AuthState = {
  user: null,
  access: null,
  refresh: null,
  role: null, // 🔹 ADD ROLE HERE
  isAuthenticated: false,
  isLoading: false,
};

/* ================= HELPERS ================= */

/** Clean string values (remove surrounding quotes if backend returns them) */
function cleanString(str?: string): string | null {
  if (!str) return null;
  if (str.startsWith('"') && str.endsWith('"')) return str.slice(1, -1);
  return str;
}

/** Safely parse user from string or object and merge profile immutably */
function parseUser(user: User | string | undefined, profile?: Profile): User | null {
  if (!user) return null;

  let parsed: User;
  if (typeof user === "string") {
    try {
      parsed = JSON.parse(user) as User;
    } catch {
      parsed = { id: 0, email: "" }; // fallback
    }
  } else {
    parsed = user;
  }

  // 🔑 Return a NEW object, never mutate original
  return {
    ...parsed,
    profile: profile ? { ...profile } : parsed.profile,
  };
}

/* ================= SLICE ================= */

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /** Login / Set credentials */
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User | string;
        profile?: Profile;
        access: string;
        refresh: string;
        role: string; // 🔹 ADD ROLE HERE
      }>
    ) => {
      state.user = parseUser(action.payload.user, action.payload.profile);
      state.access = cleanString(action.payload.access);
      state.refresh = cleanString(action.payload.refresh);
      state.role = action.payload.role; // 🔹 ADD ROLE HERE
      state.isAuthenticated = true;
    },

    /** Logout user */
    logout: (state) => {
      state.user = null;
      state.access = null;
      state.refresh = null;
      state.role = null; // 🔹 ADD ROLE HERE
      state.isAuthenticated = false;
    },

    /** Optional: set loading state */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

/* ================= EXPORTS ================= */

export const { setCredentials, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;

/* ================= SELECTORS ================= */

export const selectAuth = (state: { auth: AuthState & PersistPartial }) => state.auth;
export const selectAccess = (state: { auth: AuthState & PersistPartial }) => state.auth.access;
export const selectRefresh = (state: { auth: AuthState & PersistPartial }) => state.auth.refresh;
export const selectUser = (state: { auth: AuthState & PersistPartial }) => state.auth.user;
export const selectRole = (state: { auth: AuthState & PersistPartial }) => state.auth.role; // 🔹 ADD ROLE SELECTOR
export const selectIsAuthenticated = (state: { auth: AuthState & PersistPartial }) => state.auth.isAuthenticated;
export const selectIsLoading = (state: { auth: AuthState & PersistPartial }) => state.auth.isLoading;