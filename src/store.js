import { configureStore } from '@reduxjs/toolkit';
import signInReducer from './redux/signInStatus';

export default configureStore({
  reducer: {
    signInStatus: signInReducer,
  },
})