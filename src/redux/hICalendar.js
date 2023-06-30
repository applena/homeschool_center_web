import { createSlice } from '@reduxjs/toolkit';

export const hISlice = createSlice({
  name: 'hiCalendar',
  initialState: {},
  reducers: {
    setHICalendarObj: (state, action) => {
      state = action.payload;
      console.log('hi calendar saved', action.payload);
      return state;
    }
  }
})

export const { setHICalendarObj } = hISlice.actions;
export default hISlice.reducer