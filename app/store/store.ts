import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";


import { baseBackendApi } from "./slices/services/baseBackendApi";

const rootReducer = combineReducers({
  auth: persistReducer(
    {
      key: "auth",
      storage,
      whitelist: ["user", "access", "refresh", "isAuthenticated", "role"],
    },
    authReducer
  ),
  [baseBackendApi.reducerPath]: baseBackendApi.reducer,
});

// Create store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseBackendApi.middleware),
});

// Persistor for hydration
export const persistor = persistStore(store);

// Type helpers
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
