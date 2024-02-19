import { configureStore } from '@reduxjs/toolkit';
import chromeWindowReducer from './chromeWindowSlice';

export default configureStore({
  reducer: {
    chromeWindows: chromeWindowReducer,
  },
});
