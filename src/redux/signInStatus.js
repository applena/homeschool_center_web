import { createSlice } from '@reduxjs/toolkit'

export const signInSlice = createSlice({
  name: 'signInStatus',
  initialState: {
    value: false,
  },
  reducers: {
    signIn: (state, action) => {
      state.value = action.payload;
    },
  },
})

export const hISlice = createSlice({
  name: 'hiCalendar',
  initialState: {},
  reducers: {
    setHICalendarObj: (state, action) => {
      state = action.payload;
      console.log('hi calendar saved');
    }
  }
})

export const configSlice = createSlice({
  name: 'config',
  initialState: {},
  reducers: {
    setHICalendarConfig: (state, action) => {
      state = action.payload;
      console.log('config saved');
    }
  }
})

// Action creators are generated for each case reducer function
export const { signIn } = signInSlice.actions
export const { setHICalendarObj } = hISlice.actions
export const { setHICalendarConfig } = configSlice.actions

export default signInSlice.reducer