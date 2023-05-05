import { createSlice } from '@reduxjs/toolkit';

export const configSlice = createSlice({
  name: 'config',
  initialState: {},
  reducers: {
    setHICalendarConfig: (state, action) => {
      state = action.payload;
      console.log('config saved', action.payload);
    }
  }
})

export const { setHICalendarConfig } = configSlice.actions

export default configSlice.reducer