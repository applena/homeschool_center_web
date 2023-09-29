// filters all the events to just the ones that start or end in the active month
const filterEvents = (allCurrentEvents, activeMonth) => {
  return allCurrentEvents.filter(e => {

    const endMonth = e.dateEnd ? e.dateEnd.getMonth() + 1 : undefined;
    const startMonth = e.dateStart ? e.dateStart.getMonth() + 1 : undefined;

    return endMonth < activeMonth || startMonth > activeMonth ? false : true;
  });
}

export default filterEvents;