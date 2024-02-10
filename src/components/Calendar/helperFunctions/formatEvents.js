/*
function that takes in gapi results and formats them to combine e.start.date and e.start.dateTime to be one key. Also adds a time zone key

imput: array of events from gapi
output: array of formatted events from gapi
*/
import debugLog from './log';
// global variables
const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;


const formatEvents = (events) => {
  const formattedEvents = events.map(e =>{
    if(e.status === 'cancelled') return e;

    return {
      ...e,
      allDay: e.start?.date ? true : false,
      dateStart: new Date(e.start?.date || e.start?.dateTime),
      dateEnd: new Date(e.end?.date || e.end?.dateTime)
    }
  })
  return formattedEvents;

  // debugLog(`formatEvents`, events);
  // return events
  //   .map((e) => {
  //     // const st = e.start?.date || e.start?.dateTime;
  //     // const et = e.end?.date || e.end?.dateTime;
  //     // console.log('formatEvents', e.startMoment, e.endMoment)
  //     // if (!e.startMoment || !e.endMoment) return false;
  //     if(e.originalStartTime){
  //       return e;
  //     }

  //     // const timeZoneOffest = getTimezoneOffset(
  //     //   new Date(e.startMoment),
  //     //   timeZone
  //     // );

  //     const dateEndTZ = e.end?.timeZone ? e.end?.timeZone : timeZone;
  //     const dateStartTZ = e.start?.timeZone ? e.start?.timeZone : timeZone;
  //     const dateEnd = new Date(e.end.date || e.end.dateTime);
  //     const dateStart = new Date(e.start.date || e.start.dateTime);
      
  //     // if (e.start?.date) {
  //     //   dateStart.setMinutes(dateStart.getMinutes() + timeZoneOffest);
  //     //   dateEnd.setMinutes(dateEnd.getMinutes() + timeZoneOffest);
  //     // }
      
  //     // console.log('formatEvent', e.startMoment, dateStart)
  //     // if(e.summary === "science lab"){
  //     //   console.log("formatEvents", {e, timeZoneOffest, dateEndTZ, dateStartTZ, dateEnd, dateStart,});
  //     // }

  //     return {
  //       ...e,
  //       allDay: e.start?.date ? true : false,
  //       dateEnd,
  //       dateStart,
  //       dateStartTZ,
  //       dateEndTZ,
  //     };
  //   })
  //   .filter((i) => i);
};

export default formatEvents;
