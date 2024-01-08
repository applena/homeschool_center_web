import moment from "moment";

const addEventsEachDay = (monthlyEvents, daysInMonth, activeMonth) => {
  // console.log("addEventsEachDay", { monthlyEvents, daysInMonth, activeMonth });
  const daysArray = [...Array(daysInMonth)].map((day) => []);
  monthlyEvents.forEach((event) => {
    // getting all the parts to compose the date string for moment
    // 2013-02-08 09:30:26.123+07:00
    const isoStartDate = event.dateStart.toISOString().split("T")[0]; //2023-12-03
    const isoEndDate = event.dateEnd.toISOString().split("T")[0];
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
    let endDate = moment(ed).date();
    // let startDate = moment(event.dateStart.getTime())
    //   .tz(event.dateStartTZ)
    //   .date();
    // let endDate = moment(event.dateEnd.getTime()).date();

    console.log("addEventsEachDay", { startDate, endDate, event });

    // if this is an all day or multi day event
    if (event.start.date) {
      console.log(
        "all day or multi-day event",
        { event },
        new Date(event.start.date).getDate(),
        new Date(event.end.date).getDate()
      );
      // if this is a one day all day event
      if (
        new Date(event.start.date).getDate() ===
        new Date(event.end.date).getDate() - 1
      ) {
        console.log("event starts and ends on the same day", event);
        daysArray[startDate - 1].push(event);
      }
    } else {
      let duration = moment(event.endDate).diff(moment(event.startDate));

      // if the event ends after the current month
      if (moment(event.dateEnd).month() + 1 !== activeMonth) {
        endDate = daysArray.length + 1;
        duration = daysArray.length + 1 - startDate; // TODO: this is wierd and not right - not sure what to do instead
        console.log("events ends in a later month", { duration });
      }

      // if the event started in a prior month
      if (moment(event.dateStart).month() + 1 !== activeMonth) {
        startDate = 1;
        duration = endDate - 1;
        console.log("events starts in a prior month", { duration });
      }

      console.log({ duration });

      for (let i = 0; i < duration; i++) {
        daysArray[startDate - 1 + i].push(event);
      }
    }
  });

  console.log({ daysArray });

  // put events in order from earliest to lastest
  daysArray.forEach((day) => {
    day.sort((a, b) => {
      return a.dateStart > b.dateStart ? 1 : -1;
    });
  });

  return daysArray;
};

export default addEventsEachDay;
