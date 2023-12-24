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
  console.log("formatEvents", { events });
  return events
    .map((e) => {
      // const st = e.start?.date || e.start?.dateTime;
      // const et = e.end?.date || e.end?.dateTime;
      // console.log('formatEvents', e.startMoment, e.endMoment)
      if (!e.startMoment || !e.endMoment) return false;

      const timeZoneOffest = getTimezoneOffset(
        new Date(e.startMoment),
        timeZone
      );

      const dateEndTZ = e.end?.timeZone ? e.end?.timeZone : timeZone;
      const dateStartTZ = e.start?.timeZone ? e.start?.timeZone : timeZone;
      const dateEnd = new Date(e.endMoment);
      const dateStart = new Date(e.startMoment);

      if (e.start?.date) {
        dateStart.setMinutes(dateStart.getMinutes() + timeZoneOffest);
        dateEnd.setMinutes(dateEnd.getMinutes() + timeZoneOffest);
      }

      console.log("formatEvents", {
        e,
        timeZoneOffest,
        dateEndTZ,
        dateStartTZ,
        dateEnd,
        dateStart,
      });

      return {
        ...e,
        allDay: e.start?.date ? true : false,
        dateEnd,
        dateStart,
        dateStartTZ,
        dateEndTZ,
      };
    })
    .filter((i) => i);
};

export default formatEvents;
