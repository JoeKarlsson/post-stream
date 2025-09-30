import { configureStore } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";
import rootReducer from "../slices";
import api from "../middleware/api";
import localApi from "../middleware/localApi";

const loggerMiddleware = createLogger({
  collapsed: true,
  diff: true,
});

export default function configureAppStore(
  preloadedState?: Record<string, unknown>
) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(localApi, api, loggerMiddleware),
    devTools: process.env.NODE_ENV !== "production",
  });
}
