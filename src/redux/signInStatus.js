import { createSlice } from '@reduxjs/toolkit';

export const signInSlice = createSlice({
  name: 'signInStatus',
  initialState: {
    signedIn: false,
    credentialResponse: false,
    clientLoaded: false
  },
  reducers: {
    signIn: (state, action) => {
      state.signedIn = action.payload;
      return state;
    },
    credentialResponse: (state, action) => {
      console.log('redux credntial Response', { state, action });
      state.credentialResponse = action.payload;
      return state;
    },
    setClientIsLoaded: (state, action) => {
      console.log('setClientIsLoaded', { action });
      state.clientLoaded = action.payload;
      return state;
    }
  },
})

// Action creators are generated for each case reducer function
export const { signIn, credentialResponse, setClientIsLoaded } = signInSlice.actions

export default signInSlice.reducer