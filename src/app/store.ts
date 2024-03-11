import { configureStore } from '@reduxjs/toolkit';
import chromeWindowReducer from './chromeWindowSlice';

export const store = configureStore({
  reducer: {
    chromeWindows: chromeWindowReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
