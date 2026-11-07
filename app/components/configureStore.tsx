import { configureStore } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";
import rootReducer from "../slices";

export default function configureAppStore() {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      import.meta.env.DEV
        ? getDefaultMiddleware().concat(createLogger({ collapsed: true }))
        : getDefaultMiddleware(),
  });
}
