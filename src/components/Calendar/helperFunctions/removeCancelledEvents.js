const removeCancelledEvents = (updatedEvents) => {
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

export default removeCancelledEvents;