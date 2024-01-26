import getDatesFromRRule from "./getDatesFromRRule";
import moment from "moment";

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

  formattedEvents.forEach(event => {
    const duration = moment(event.endMoment).diff(moment(event.startMoment));
    let newEvent = {
      ...event,
      dateStartTZ: event.dateStartTZ || `Etc/UTC`,
      dateEndTZ: event.dateEndTZ || "Etc/UTC",
      calendarName: hICalendar.summary,
      color: hICalendar.backgroundColor,
      dateStart: event.dateStart,
      dateEnd: event.dateEnd,
    };

    // cancelled events go in cancelled bucket
    if(event.originalStartTime && event.status === 'canceled'){
      cancelled.push(event);
    }

    // is an all day - add all day flag
    if(event.start.date){
      event.allDay = true;
    } else {
      event.allDay = false;
      event.dateEnd = new Date(event.dateEnd.getTime() + duration);
    }

    // is multi-day - add multi-day flag
    if((new Date(event.end.date).getTime()-new Date(event.start.date).getTime() > 86400000) || (new Date(event.end.dateTime).getTime() - new Date(event.start.dateTime).getTime() > 86400000)){
      event.multiDay = true;
    } else {
      event.multiDay = false;
    }

    // is reapting - add repating flag
    if(event.recurrence?.length){
      event.repeating = true;
    } else {
      event.repeating = false;
    }

    // changed events go in the changed bucket
    if(event.originalStartTime && event.status !== 'canceled'){
      changed.push(event);
    }

    if(event.repeating){
      const nextMonth = activeMonth < 12 ? activeMonth + 1 : 1;
      let dates = getDatesFromRRule({
        str: event.recurrence[0],
        eventStart: event.startMoment,
        betweenStart: activeMonth,
        betweenEnd: nextMonth,
        activeMonth: activeMonth,
        activeYear: activeYear,
      });

      // console.log('processEvents dates', { dates })

      dates.forEach((day) => {
        const additionalEvent = {...newEvent}
        additionalEvent.dateEnd = new Date(day.getTime() + duration);
        additionalEvent.dateStart = day;
        // console.log('processEvents', {day})
        currentEvents.push(additionalEvent);
      });
    }

    if(event.multiDay){
      // get a list of dates
      let startDate = event.dateStart.getDate();
      let endDate = event.dateEnd.getDate();
      const startMonth = event.dateStart.getMonth() +1;
      const endMonth = event.dateEnd.getMonth()+1;
      const startYear = event.dateStart.getFullYear();
      const endYear = event.dateEnd.getFullYear();

      // console.log({startDate, endDate, startMonth, endMonth, startYear, endYear})

      // deal with events that start a previous year
      if(startYear < activeYear){
        console.log('mulit-day event started before current year', {startYear, activeYear, event});
        startDate = 1;
      }

      // deal with events that end after the current year
      if(endYear > activeYear){
        console.log('multi-day event ended after the current year', {endYear, activeYear,event});
        endDate = 31;
      }

      // deal with events that start before the current month
      if(startMonth < activeMonth){
        console.log('multi-day event started before active Month', {startMonth, activeMonth, event});
        startDate = 1;
      }

      // deal with events that end after the current month
      if(endMonth > activeMonth){
        console.log('multi-day event ended after active Month', {endMonth, activeMonth, event});
        endDate = 31;
      }

      const length = endDate - startDate;
      console.log('multi-day length', {endDate, startDate, length});

      for(let i=0; i<length; i++){
        console.log('processEvents', {activeMonth, activeYear, startDate})
        const additionalEvent = {...newEvent};
        additionalEvent.dateStart = new Date(`${activeYear}-${activeMonth}-${startDate+i}`);
        additionalEvent.dateEnd = new Date(`${activeYear}-${activeMonth}-${startDate+i}`);
        additionalEvent.allDay = true;
        currentEvents.push(additionalEvent);
        // console.log('adding mulit-day event', {additionalEvent})
      }

    }
  })

  console.log('processEvents', {currentEvents})
  return { currentEvents, cancelled, changed };

  // // loop through all events
  // formattedEvents.forEach((event) => {
  //   const duration = moment(event.endMoment).diff(moment(event.startMoment));
  //   if (event.originalStartTime) {
  //     // 'cancelled' events into the cancelled array
  //     if (event.status === "cancelled") {
  //       cancelled.push(event);
  //       // changed events go into the changed array
  //     } else if (event.status === "confirmed") {
  //       //changed events
  //       let newEvent = {
  //         ...event,
  //         dateStartTZ: event.dateStartTZ || `Etc/UTC`,
  //         dateEndTZ: event.dateEndTZ || "Etc/UTC",
  //         calendarName: hICalendar.summary,
  //         color: hICalendar.backgroundColor,
  //         // dateStart: event.dateStart,
  //         dateStart: event.startMoment,
  //         dateEnd: new Date(event.dateEnd.getTime() + duration),
  //       };
  //       changed.push(newEvent);
  //     } else {
  //       console.log("Not categorized: ", event);
  //     }
  //     // non recurring events and non-multi-day events
  //   } else if (!event.recurrence?.length && event.end?.date.getTime() - event.start?.date.getTime() === 86400000) {
  //     if (event.status === "confirmed") {
  //       let newEvent = {
  //         ...event,
  //         changedEvents: [],
  //         cancelledEvents: [],
  //         calendarName: hICalendar.summary,
  //         color: hICalendar.backgroundColor,
  //         dateEnd: new Date(event.dateEnd.getTime() + duration),
  //       };
  //       // console.log('found a non-repeating event', { newEvent })
  //       currentEvents.push(newEvent);
  //     }
  //     // recurring events and multi-day events
  //   } else if (event.recurrence?.length || event.end?.date.getTime() - event.start?.date.getTime() > 86400000) {
  //     const nextMonth = activeMonth < 12 ? activeMonth + 1 : 1;

  //     let dates = getDatesFromRRule({
  //       str: event.recurrence[0],
  //       eventStart: event.startMoment,
  //       betweenStart: activeMonth,
  //       betweenEnd: nextMonth,
  //       activeMonth: activeMonth,
  //       activeYear: activeYear,
  //     });

  //     // console.log({ dates })

  //     dates.forEach((day) => {
  //       const duration = event.dateEnd - event.dateStart;
  //       console.log('processEvents', {duration})
  //       //unchanged events
  //       let newEvent = {
  //         ...event,
  //         dateStartTZ: event.dateStartTZ || `Etc/UTC`,
  //         dateEndTZ: event.dateEndTZ || "Etc/UTC",
  //         changedEvents: [],
  //         cancelledEvents: [],
  //         calendarName: hICalendar.summary,
  //         color: hICalendar.backgroundColor,
  //         dateStart: day,
  //         dateEnd: new Date(day.getTime() + duration),
  //       };
  //       // console.log('found a repeating event', { newEvent })
  //       currentEvents.push(newEvent);
  //     });
  //   }
  // });

  // console.log({ cancelled })
  // return { currentEvents, cancelled, changed };
};

export default processEvents;