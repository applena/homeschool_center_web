import moment from "moment";

const addEventsEachDay = (monthlyEvents, daysInMonth, activeMonth) => {
  const daysArray = [...Array(daysInMonth)].map((day) => []);
  console.log('addEventsEachDay', {monthlyEvents});
  monthlyEvents.forEach((event) => {
    // console.log('addEventsEachDay - event - dateEnd', moment(event.dateEnd).toDate(), event.dateEnd, event);
    const isoStartDateTime = event.dateStart.toISOString();
    const isoStartDate = isoStartDateTime.split("T")[0]; //2023-12-03
    const isoEndDate = isoStartDateTime.split("T")[0];
    const isoStartTime = event.dateStart.toISOString().split("T")[1]; // 00:00:00.000Z
    const isoEndTime = event.dateEnd.toISOString().split("T")[1];
    const dateTZ = event.dateStart.toTimeString().split(" ")[1].substring(3, event.dateStart.toTimeString().split(" ")[1].length); // -0800

    const st = `${isoStartDate} ${isoStartTime.substring(0, isoStartTime.length - 1)}${dateTZ}`;
    const ed = `${isoEndDate} ${isoEndTime.substring(0,isoStartTime.length - 1)}${dateTZ}`;

    let startDate = moment(st).date();
    let endDate = moment(ed).date();

    console.log("addEventsEachDay", event.summary, isoStartDateTime);

    // if this is an all day or multi day event
    if (event.start.date) {
      // if this is a one day all day event
      if (new Date(event.start.date).getDate() === new Date(event.end.date).getDate() - 1) {
          daysArray[startDate - 1].push(event);
          // console.log("event starts and ends on the same day", event, {startDate});
      } else {
        // console.log(`multi-day event?`, {event}, event.dateEnd.getTime(), event.dateStart.getTime())
        // multi-day events
        let durationMilliseconds = moment(event.dateEnd.getTime()).diff(moment(event.dateStart.getTime()),true);

        let durationDays = durationMilliseconds/86400000;
  
        // console.log('addEventEachDay - multi-day events', { durationMilliseconds, durationDays });

        // if the event ends after the current month
        if (moment(event.dateEnd).month() + 1 !== activeMonth) {
          endDate = daysArray.length + 1;
          durationDays = daysArray.length + 1 - startDate; // TODO: this is wierd and not right - not sure what to do instead
          // console.log("events ends in a later month", { durationDays });
        }

        // if the event started in a prior month
        if (moment(event.dateStart).month() + 1 !== activeMonth) {
          startDate = 1;
          durationDays = endDate - 1;
          // console.log("events starts in a prior month", { durationDays });
        }

        if(!durationDays){
          // this was a single day of a multi-day collection
          // console.log(`setting multi-day segment on`, startDate);
          daysArray[startDate - 1].push(event);
        }else{
          console.log({durationDays})
          // duration needs to be in days here
          for (let i = 0; i < durationDays; i++) {
            daysArray[startDate - 1 + i].push(event);
          }
        }

      }
    } else {

      const localStartTime = new Date(isoStartDateTime);
      localStartTime.setMinutes(localStartTime.getMinutes() - new Date().getTimezoneOffset());
      event.dateStart = localStartTime;
      console.log('single timed event - local start time', isoStartDateTime, localStartTime);
      daysArray[startDate - 1].push(event);
    }

  // console.log('end of addEventsEachDay', { daysArray });
  });

  // put events in order from earliest to lastest
  daysArray.forEach((day) => {
    day.sort((a, b) => {
      return a.dateStart > b.dateStart ? 1 : -1;
    });
  });

  return daysArray;
};

export default addEventsEachDay;
