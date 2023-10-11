import getDatesFromRRule from "./getDatesFromRRule";

/*
function that updates the keys on the event objects for each instance of recurring events while putting cancelled and changed events into array.

input: 
  formattedEvents = array of formatted events
  hICalendar = the calendar object from GAPI
  activeMonth = active month (ie. 10)
  activeYear = active year (ie. 2023)

  output:
  currentEvents[] = array of events that includes all event instaces for the current month
  cancelled[] = array of cancelled events
  changed[] = array of changed events
*/

const processEvents = (formattedEvents, hICalendar, activeMonth, activeYear) => {
  let currentEvents = [];
  let cancelled = [];
  let changed = [];

  // loop through all events
  formattedEvents.forEach(event => {
    const duration = event.dateEnd - event.dateStart;
    if (event.originalStartTime) {
      // 'cancelled' events into the cancelled array
      if (event.status === "cancelled") {
        cancelled.push(event);
        // changed events go into the changed array
      } else if (event.status === "confirmed") { //changed events
        let newEvent = {
          ...event,
          dateStartTZ: event.dateStartTZ || `Etc/UTC`,
          dateEndTZ: event.dateEndTZ || 'Etc/UTC',
          calendarName: hICalendar.summary,
          color: hICalendar.backgroundColor,
          dateStart: event.dateStart,
          dateEnd: new Date(event.dateStart.getTime() + duration)
        }
        changed.push(newEvent);
      } else {
        console.log("Not categorized: ", event);
      }
      // non recurring events
    } else if (!event.recurrence?.length) {
      if (event.status === "confirmed") {
        let newEvent = {
          ...event,
          changedEvents: [],
          cancelledEvents: [],
          calendarName: hICalendar.summary,
          color: hICalendar.backgroundColor,
          dateEnd: new Date(event.dateStart.getTime() + duration)
        }
        // console.log('found a non-repeating event', { newEvent })
        currentEvents.push(newEvent);
      }
      // recurring events
    } else if (event.recurrence?.length) {
      const nextMonth = activeMonth < 12 ? activeMonth + 1 : 1;

      let dates = getDatesFromRRule(event.recurrence[0], event.dateStart, activeMonth, nextMonth, activeMonth, activeYear);

      // console.log({ dates })

      dates.forEach(day => {
        const duration = event.dateEnd - event.dateStart;
        //unchanged events
        let newEvent = {
          ...event,
          dateStartTZ: event.dateStartTZ || `Etc/UTC`,
          dateEndTZ: event.dateEndTZ || 'Etc/UTC',
          changedEvents: [],
          cancelledEvents: [],
          calendarName: hICalendar.summary,
          color: hICalendar.backgroundColor,
          dateStart: day,
          dateEnd: new Date(day.getTime() + duration)
        }
        // console.log('found a repeating event', { newEvent })
        currentEvents.push(newEvent);
      })
    }
  })

  // console.log({ cancelled })
  return { currentEvents, cancelled, changed };
}

export default processEvents;