import { createSlice } from '@reduxjs/toolkit';
import updateConfig from '../components/Login/updateConfig';

export const configSlice = createSlice({
  name: 'config',
  initialState: {},
  reducers: {
    setHICalendarConfig: (state, action) => {
      console.log('setHICalendarConfig', action.payload)
      state = action.payload;
      updateConfig(state.calendarId, state.id, action.payload);
      console.log('config saved', action.payload);
      return state;
    }
  }
})

export const { setHICalendarConfig } = configSlice.actions

export default configSlice.reducer