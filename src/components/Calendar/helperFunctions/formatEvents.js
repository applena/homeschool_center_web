/*
function that takes in gapi results and formats them to combine e.start.date and e.start.dateTime to be one key. Also adds a time zone key

imput: array of events from gapi
output: array of formatted events from gapi
*/
// global variables
const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
function getTimezoneOffset(d, tz) {
  const a = d.toLocaleString("ja", { timeZone: tz }).split(/[/\s:]/);
  a[1]--;
  const t1 = Date.UTC.apply(null, a);
  const t2 = new Date(d).setMilliseconds(0);
  return (t2 - t1) / 60 / 1000;
}

const formatEvents = (events) => {
  return events.map(e => {
    const st = e.start?.date || e.start?.dateTime;
    const et = e.end?.date || e.end?.dateTime;
    if (!st || !et) return false;

    const timeZoneOffest = getTimezoneOffset(new Date(st), timeZone);

    const dateEndTZ = e.end?.timeZone ? e.end?.timeZone : timeZone;
    const dateStartTZ = e.start?.timeZone ? e.start?.timeZone : timeZone;
    const dateEnd = new Date(et);
    const dateStart = new Date(st)

    if (e.start?.date) {
      dateStart.setMinutes(dateStart.getMinutes() + timeZoneOffest);
      dateEnd.setMinutes(dateEnd.getMinutes() + timeZoneOffest);
    }

    // console.log('formatEvents',)


    return {
      ...e,
      allDay: e.start?.date ? true : false,
      dateEnd,
      dateStart,
      dateStartTZ,
      dateEndTZ,
    }
  }).filter(i => i);
}

export default formatEvents;