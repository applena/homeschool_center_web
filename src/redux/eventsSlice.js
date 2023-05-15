import { createSlice } from '@reduxjs/toolkit';

export const eventsSlice = createSlice({
  name: 'events',
  initialState: [{}],
  reducers: {
    addEvent: (state, action) => {
      state = [...state, action.payload];
      console.log('event saved', state);
    },
    removeEvent: (state, action) => {
      //find event with id via action.payload
      // return state.splie(index of event, 1)
      console.log('removed event', action.payload, state);
    },
    modifyEvent: (state, action) => {
      // action.payload = the event {start, end, title, id}
      // find event with id via action.payload.id
      // remove event
      // add new event
      console.log('udpated event', action.payload, state);
    }
  },
})

// Action creators are generated for each case reducer function
export const { signIn } = eventsSlice.actions

export default eventsSlice.reducer