/*
returns an array of events with a cancelled and changed array on events that have been cancelled or changed
*/

const processEvents = (formattedEvents, cancelled) => {
  let currentEvents = [];

  // loop through cancelled events and find the event that matches then give it a remove flag
  cancelled.forEach((event) => {
    const eventInstanceToBeRemoved = formattedEvents.find(
      (e) =>
        e.id === event.recurringEventId &&
        e.status === "confirmed" &&
        e.dateStart.toISOString() ===
          new Date(
            event.originalStartTime.date || event.originalStartTime.dateTime
          ).toISOString()
    );
    if (!eventInstanceToBeRemoved) {
      // console.log({ event });
      return;
    }
    eventInstanceToBeRemoved.remove = true;
    return;
  });

  // loop through formattedEvents and find the events that were changed and multi-day
  formattedEvents.forEach((event) => {
    if (event.originalStartTime && event.status !== "cacncelled") {
      // changed events to into an changed bucket on the original event
      const eventToBeChanged = formattedEvents.find(
        (e) =>
          e.id === event.recurringEventId &&
          e.status === "confirmed" &&
          e.dateStart.toISOString() ===
            new Date(
              event.originalStartTime.date || event.originalStartTime.dateTime
            ).toISOString()
      );

      eventToBeChanged.remove = true;
      currentEvents.push(event);
      return;
    } else if (event.dateEnd.getTime() - event.dateStart.getTime() > 86400000) {
      event.multiDay = true;
      event.daySpan = Math.floor(
        (event.dateEnd.getTime() - event.dateStart.getTime()) / 86400000
      );
    }

    currentEvents.push(event);
  });

  return currentEvents.filter((e) => !e.remove);
};

export default processEvents;
