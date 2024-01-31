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
        // TODO: multi-day events - need logic to handle events spaning more than one day 
      }
    } else {
      // not an all day event or a mulit-day event
      const localStartTime = new Date(isoStartDateTime);
      localStartTime.setMinutes(localStartTime.getMinutes() - new Date().getTimezoneOffset());
      event.dateStart = localStartTime;
      const localEndTime = new Date(event.dateEnd);
      localEndTime.setMinutes(localEndTime.getMinutes() - new Date().getTimezoneOffset());
      event.dateEnd = localEndTime
      console.log('single timed event - local start time', event.summary, isoStartDateTime, localStartTime);
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
