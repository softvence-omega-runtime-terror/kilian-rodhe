import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "./slices/authSlice";
import { baseBackendApi } from "./slices/services/baseBackendApi";

/* ================= PERSIST CONFIG ================= */

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "access", "refresh", "isAuthenticated", "role"],
};

const persistedAuthReducer = persistReducer(
  authPersistConfig,
  authReducer
);

/* ================= STORE ================= */

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    [baseBackendApi.reducerPath]: baseBackendApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseBackendApi.middleware),

  devTools: process.env.NODE_ENV !== "production",
});

setupListeners(store.dispatch);

/* ================= TYPES ================= */

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
