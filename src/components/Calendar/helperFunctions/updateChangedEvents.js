// update changed events
const updateChangedEvents = (allEvents) => {
  const updatedEvents = allEvents.map(event => {
    let changed = event.changedEvents.find(ce => new Date(ce.dateStart).toISOString() === event.dateStart.toISOString());

    if (changed) event = changed;

    return event;
  })

  return updatedEvents.filter((event => {
    // remove the cancelled events
    let cancelled = false;
    if (event.cancelledEvents?.length) {
      event.cancelledEvents.forEach(ce => {
        // console.log({ ce })
        if ((ce.date || ce.dateTime) === event.dateStart.toISOString()) {
          cancelled = true;
        }
      })
    }
    if (cancelled) return false;
    return true;
  }))
}

export default updateChangedEvents;