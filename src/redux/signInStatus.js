import { createSlice } from '@reduxjs/toolkit';

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

// Action creators are generated for each case reducer function
export const { signIn } = signInSlice.actions

export default signInSlice.reducer