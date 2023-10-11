// filters all the events to just the ones that start or end in the active month
const filterEvents = (allCurrentEvents, activeMonth, activeYear) => {
  return allCurrentEvents.filter(e => {

    let endMonth = e.dateEnd ? e.dateEnd.getMonth() + 1 : undefined;
    const startMonth = e.dateStart ? e.dateStart.getMonth() + 1 : undefined;
    const startYear = e.dateStart ? e.dateStart.getFullYear() : undefined;
    const endYear = e.dateEnd ? e.dateEnd.getFullYear() : undefined;

    // console.log('FilterEvents', { allCurrentEvents, endMonth, startMonth, activeMonth, startYear, endYear, activeYear })
    if (e.dateEnd.getTime() < new Date(`${activeYear}-${activeMonth}-01`)) return false;
    if (e.dateStart.getTime() > new Date(`${activeYear}-${activeMonth + 1}-1`)) return false;

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