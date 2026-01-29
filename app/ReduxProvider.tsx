"use client"; // client component

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./store";

import { Toaster } from "sonner";

export default function ReduxProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
        <Toaster richColors position="top-right" />
      </PersistGate>
    </Provider>
  );
}
