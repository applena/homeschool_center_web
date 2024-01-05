import moment from "moment";
// filters all the events to just the ones that start or end in the active month
const filterEvents = (allCurrentEvents, activeMonth, activeYear) => {
  // console.log({ allCurrentEvents, activeMonth, activeYear });
  return allCurrentEvents.filter((e) => {
    // let endMonth = e.dateEnd ? moment().month(e.dateEnd) + 1 : undefined;
    let endMonth = e.dateEnd ? moment(e.dateEnd).month() + 1 : undefined;
    // const startMonth = e.dateStart ? e.dateStart.getMonth() + 1 : undefined;
    const startMonth = e.dateStart
      ? moment(e.dateStart).month() + 1
      : undefined;
    // const startYear = e.dateStart ? e.dateStart.getFullYear() : undefined;
    const startYear = e.dateStart
      ? moment(e.dateStart.getTime()).year()
      : undefined;
    // const endYear = e.dateEnd ? e.dateEnd.getFullYear() : undefined;
    const endYear = e.dateEnd ? moment(e.dateEnd.getTime()).year() : undefined;
    console.log({ endMonth, allCurrentEvents, startMonth, startYear, endYear });

    // if (e.dateEnd.getTime() < new Date(`${activeYear}-${activeMonth}-01`)) return false;
    // if (e.dateStart.getTime() > new Date(`${activeYear}-${activeMonth + 1}-1`)) return false;
    if (
      moment(e.dateEnd.getTime()).milliseconds() <
      moment(`${activeYear}-${activeMonth}-01`).milliseconds()
    ) {
      console.log("event ended before current month");
      return false;
    }
    if (
      moment(e.dateStart.getTime()).milliseconds() >
      moment(`${activeYear}-${activeMonth + 1}-31`)
    ) {
      console.log("event started after the current month");
      return false;
    }
    if (endYear < activeYear) {
      console.log("event ends before current year");
      return false;
    }
    if (startYear > activeYear) {
      console.log("event begins after the current year");
      return false;
    }

    if (startYear === endYear) {
      return startMonth <= activeMonth && endMonth >= activeMonth
        ? true
        : false;
    } else {
      return true;
    }
  });
};

export default filterEvents;
