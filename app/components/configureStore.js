import { configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import * as reducers from '../reducers';
import api from '../middleware/api';
import localApi from '../middleware/localApi';

const loggerMiddleware = createLogger({
  collapsed: true,
  diff: true
});

export default function configureAppStore(preloadedState) {
  return configureStore({
    reducer: reducers,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        },
      }).concat(
        localApi,
        api,
        loggerMiddleware
      ),
    devTools: process.env.NODE_ENV !== 'production',
  });
};