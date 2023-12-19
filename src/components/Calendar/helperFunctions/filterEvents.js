import moment from 'moment';
// filters all the events to just the ones that start or end in the active month
const filterEvents = (allCurrentEvents, activeMonth, activeYear) => {

  // console.log({ allCurrentEvents, activeMonth, activeYear })
  return allCurrentEvents.filter(e => {

    // let endMonth = e.dateEnd ? moment().month(e.dateEnd) + 1 : undefined;
    let endMonth = e.endMoment ? moment(e.endMoment).month() : undefined;
    // const startMonth = e.dateStart ? e.dateStart.getMonth() + 1 : undefined;
    const startMonth = e.startMoment ? moment(e.startMoment).month() : undefined;
    // const startYear = e.dateStart ? e.dateStart.getFullYear() : undefined;
    const startYear = e.startMoment ? moment(e.startMoment).year() : undefined;
    // const endYear = e.dateEnd ? e.dateEnd.getFullYear() : undefined;
    const endYear = e.endMoment ? moment(e.endMoment).year() : undefined;
    console.log({ endMonth, allCurrentEvents, startMonth, startYear, endYear })

    // if (e.dateEnd.getTime() < new Date(`${activeYear}-${activeMonth}-01`)) return false;
    // if (e.dateStart.getTime() > new Date(`${activeYear}-${activeMonth + 1}-1`)) return false;
    if (moment(e.endMoment).milliseconds() < moment(`${activeYear}-${activeMonth}-01`).milliseconds()) return false;
    if (moment(e.startMoment).milliseconds() > moment(`${activeYear}-${activeMonth + 1}-31`)) return false;

    if (endYear < activeYear) return false;
    if (startYear > activeYear) return false;

    // deal with endMonth = 1 and startMonth = 12
    // if (endYear === startYear + 1) endMonth = 13;

    if (startYear === endYear) {
      return (startMonth <= activeMonth && endMonth >= activeMonth) ? true : false;
    } else {
      return true;
    }
  });
}

export default filterEvents;