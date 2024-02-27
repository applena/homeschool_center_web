import { createSlice } from '@reduxjs/toolkit';
import updateConfig from '../components/Login/updateConfig';

export const configSlice = createSlice({
  name: 'config',
  initialState: {subjectList: []},
  reducers: {
    setHICalendarConfig: (state, action) => {
      console.log('setHICalendarConfig', action.payload)
      state = action.payload;
      if (!state.saved) {
        updateConfig(state.calendarId, state.id, action.payload);
        state.saved = false;
        console.log('config saved', action.payload);
      };
      return state;
    }
  }
})

export const { setHICalendarConfig } = configSlice.actions

export default configSlice.reducer