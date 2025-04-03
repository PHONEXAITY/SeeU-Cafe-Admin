"use client";

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import uiReducer from "./slices/uiSlice";
import { setupApiRedux } from "@/services/api";

const createStore = () => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      ui: uiReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [
            "auth/login/fulfilled",
            "auth/getUserProfile/fulfilled",
          ],
        },
      }),
  });

  if (typeof window !== "undefined") {
    const { logout } = require("./slices/authSlice");
    const { startLoading, stopLoading } = require("./slices/uiSlice");

    setupApiRedux({
      dispatch: store.dispatch,
      actions: {
        logout,
        startLoading,
        stopLoading,
      },
    });
  }

  return store;
};

export const store = typeof window !== "undefined" ? createStore() : null;

export default store;
