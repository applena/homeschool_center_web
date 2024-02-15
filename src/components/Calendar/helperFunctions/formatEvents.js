/*
function that takes in gapi results and formats them to combine e.start.date and e.start.dateTime to be one key. Also adds a time zone key

imput: array of events from gapi
output: array of formatted events from gapi
*/
import debugLog from './log';
// global variables
// const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;


const formatEvents = (events, hICalendar) => {
  // console.log('formatEvents', {events, hICalendar})
  const formattedEvents = events.map(e =>{
    if(e.status === 'cancelled') return e;

    return {
      ...e,
      allDay: e.start?.date ? true : false,
      dateStart: new Date(e.start?.date || e.start?.dateTime),
      dateEnd: new Date(e.end?.date || e.end?.dateTime),
      changedEvent: e.originalStartTime ? true: false,
      repeating: e.recurrence ? true: false,
      calendarName: hICalendar.summary,
      color: hICalendar.backgroundColor,
      cancelled: [], 
      changed: []
    }
  })
  return formattedEvents;
};

export default formatEvents;
