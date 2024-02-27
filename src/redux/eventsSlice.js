import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";

const addMoments = (e) => {
  if (e.startMoment) return;
  if (e.start) {
    e.startMoment = e.start?.date
      ? moment().format(e.start?.date)
      : moment().format(e.start?.dateTime);
  }

  if (e.endMoment) return;
  if (e.end) {
    e.endMoment = e.end?.date
      ? moment().format(e.end?.date)
      : moment().format(e.end?.dateTime);
  }
};

export const eventsSlice = createSlice({
  name: "events",
  initialState: [],
  reducers: {
    addEvent: (state, action) => {
      addMoments(action.payload);
      state = [...state, action.payload];
      console.log("event saved", state);
      return state;
    },
    removeEvent: (state, action) => {
      //find event with id via action.payload
      console.log('removeEvent', {state})
      state = state.filter((item) => item.id !== action.payload);
      console.log('removeEvent', {state})
      return state;
      // return state.splie(index of event, 1)
    },
  
    cancelInstance: (state, action) => {
      console.log('cancelInstance', {state}, action.payload);
      const found = state.find(e => action.payload.id === e.id);
      if(found){
        found.status = 'cancelled';
      } else {
        action.payload.status = 'cancelled';
        state.push(action.payload);
      }
      return state;
    },

    modifyEvent: (state, action) => {
      // action.payload = the event
      console.log("REDUX - modify event", action.payload);
      state = state.map((event) => {
        if (event.id === action.payload.id) {
          event = action.payload;
        }
        return event;
      });
      console.log("udpated event", action.payload, state);
      return state;
    },

    setEvents: (state, action) => {
      action.payload.forEach((e) => addMoments(e));
      console.log("setting events from google", action.payload);
      state = action.payload;
      return state;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setEvents, removeEvent, modifyEvent, addEvent, cancelInstance } =
  eventsSlice.actions;

export default eventsSlice.reducer;
