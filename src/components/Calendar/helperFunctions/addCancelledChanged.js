const addCancelledChanged = (currentEvents, cancelled, changed) => {
  // add changed events and cancelled events to corresponding event object
  currentEvents.forEach((event, idx, arr) => {
    if (!event.recurrence) return;
    // reduce the changed array to only ones that match the event id
    // pushing the changed events into the changedEvents array on the event itself
    changed.filter(change => change.recurringEventId === event.id).forEach((changedEvent) => {
      // console.log('found a changed event', {changedEvent})
      if(!arr[idx].changedEvents) arr[idx].changedEvents = [];
      arr[idx].changedEvents.push(changedEvent);
    });

    // finding all the canceled events that match the event.id
    // push each of those canceled events into the cancelledEvent arry on the event itself
    cancelled.filter(cancel => cancel.recurringEventId === event.id).forEach((cancel) => {
      // console.log('found a cancelled event', {cancel})
      if(!arr[idx].cancelledEvents) arr[idx].cancelledEvents = [];
      arr[idx].cancelledEvents.push(cancel.originalStartTime);
    });

  })

  return currentEvents;
}

export default addCancelledChanged;