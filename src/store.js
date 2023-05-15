import { configureStore } from '@reduxjs/toolkit';
import signInReducer from './redux/signInStatus';
import hICalendar from './redux/hICalendar';
import config from './redux/config';
import eventsReducer from './redux/eventsSlice';

export default configureStore({
  reducer: {
    signInStatus: signInReducer,
    hICalendar: hICalendar,
    config: config,
    events: eventsReducer
  },
})