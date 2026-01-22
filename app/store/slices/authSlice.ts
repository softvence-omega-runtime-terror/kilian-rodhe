// store/slices/authSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { PersistPartial } from "redux-persist/es/persistReducer";

/* ================= TYPES ================= */

export interface User {
  id: number;
  email: string;
}

export interface AuthState {
  user: User | null;
  access: string | null;
  refresh: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/* ================= INITIAL STATE ================= */

const initialState: AuthState = {
  user: null,
  access: null,
  refresh: null,
  isAuthenticated: false,
  isLoading: false,
};

/* ================= SLICE ================= */

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User;
        access: string;
        refresh: string;
      }>
    ) => {
      state.user = action.payload.user;
      state.access = action.payload.access;
      state.refresh = action.payload.refresh;
      state.isAuthenticated = true;
    },

    logout: (state) => {
      state.user = null;
      state.access = null;
      state.refresh = null;
      state.isAuthenticated = false;
    },
  },
});


export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

/* ================= SELECTORS ================= */

export const selectAuth = (state: { auth: AuthState & PersistPartial }) =>
  state.auth;

export const selectAccessToken = (state: { auth: AuthState & PersistPartial }) =>
  state.auth.access;

