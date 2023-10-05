// filters all the events to just the ones that start or end in the active month
const filterEvents = (allCurrentEvents, activeMonth, activeYear) => {
  return allCurrentEvents.filter(e => {

    const endMonth = e.dateEnd ? e.dateEnd.getMonth() + 1 : undefined;
    const startMonth = e.dateStart ? e.dateStart.getMonth() + 1 : undefined;
    const startYear = e.dateStart ? e.dateStart.getFullYear() : undefined;
    const endYear = e.dateEnd ? e.dateEnd.getFullYear() : undefined;

    console.log({ allCurrentEvents, endMonth, startMonth, activeMonth, startYear, endYear, activeYear })
    if (endYear < activeYear) { console.log('ends before activeYear'); return false; }
    if (startYear > activeYear) { console.log('begins after activeYear', { startYear, activeYear }); return false };

    return (startMonth <= activeMonth && endMonth >= activeMonth) ? true : false;
  });
}

export default filterEvents;