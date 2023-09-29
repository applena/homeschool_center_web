/*
function that takes in gapi results and formats them to combine e.start.date and e.start.dateTime to be one key. Also adds a time zone key

imput: array of events from gapi
output: array of formatted events from gapi
*/

const formatEvents = (events) => {
  return events.map(e => {
    const st = e.start?.date || e.start?.dateTime;
    const et = e.end?.date || e.end?.dateTime;
    return {
      ...e,
      allDay: e.start?.date ? true : false,
      dateEnd: et ? new Date(et) : undefined,
      dateStart: st ? new Date(st) : undefined,
      dateStartTZ: e.start?.timeZone,
      dateEndTZ: e.end?.timeZone
    }
  })
}

export default formatEvents;