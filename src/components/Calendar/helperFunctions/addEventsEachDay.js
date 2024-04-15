import moment from "moment";

const addEventsEachDay = (monthlyEvents, daysInMonth, activeMonth) => {
  const daysArray = [...Array(daysInMonth)].map((day) => []);
  console.log("addEventsEachDay", { monthlyEvents, daysInMonth, activeMonth });
  monthlyEvents.forEach((event) => {
    const isoStartDateTime = event.dateStart.toISOString();
    const isoStartDate = isoStartDateTime.split("T")[0]; //2023-12-03
    const isoEndDate = isoStartDateTime.split("T")[0];
    const isoStartTime = event.dateStart.toISOString().split("T")[1]; // 00:00:00.000Z
    const isoEndTime = event.dateEnd.toISOString().split("T")[1];
    const dateTZ = event.dateStart
      .toTimeString()
      .split(" ")[1]
      .substring(3, event.dateStart.toTimeString().split(" ")[1].length); // -0800

    const st = `${isoStartDate} ${isoStartTime.substring(
      0,
      isoStartTime.length - 1
    )}${dateTZ}`;
    const ed = `${isoEndDate} ${isoEndTime.substring(
      0,
      isoStartTime.length - 1
    )}${dateTZ}`;

    let startDate = moment(st).date();

    console.log("addEventsEachDay", event.summary, isoStartDateTime, event);
    console.log(event.dateEnd - event.dateStart);

    // if this is an all day or multi day event
    if (event.start.date) {
      // if this is a one day all day event
      if (event.dateEnd - event.dateStart === 86400000) {
        daysArray[startDate - 1].push(event);
        console.log(
          "event starts and ends on the same day",
          event.summary,
          event,
          {
            startDate,
          }
        );
      } else {
        // TODO: multi-day events - need logic to handle events spaning more than one day
        console.log(
          "found multi-day event",
          event.summary,
          startDate - 1,
          event,
          event.daySpan
        );
        // console.log(daysArray[startDate - 1], startDate);
        for (let i = 0; i < event.daySpan; i++) {
          daysArray[startDate - 1 + i].push(event);
        }
      }
    } else {
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
