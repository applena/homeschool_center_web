// filters all the events to just the ones that start or end in the active month
const filterEvents = (allCurrentEvents, activeMonth) => {
  console.log({ allCurrentEvents })
  return allCurrentEvents.filter(e => {

    let cancelled = false;
    if (e.cancelledEvents.length) {
      e.cancelledEvents.forEach(ce => {
        if (new Date(ce.date).toISOString() === e.dateStart.toISOString()) {
          cancelled = true;
        }
      })
    }

    if (cancelled) return false;

    const endMonth = e.dateEnd ? e.dateEnd.getMonth() + 1 : undefined;
    const startMonth = e.dateStart ? e.dateStart.getMonth() + 1 : undefined;

    return endMonth < activeMonth || startMonth > activeMonth ? false : true;
  });
}

export default filterEvents;