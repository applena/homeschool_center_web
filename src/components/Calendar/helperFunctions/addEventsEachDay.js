const addEventsEachDay = (monthlyEvents, daysInMonth, activeMonth) => {
  const daysArray = [...Array(daysInMonth)].map(day => []);
  monthlyEvents.forEach((event) => {
    let startDate = event.dateStart.getUTCDate();
    let endDate = event.dateEnd.getUTCDate();

    console.log('addEventsEachDay', { startDate, endDate }, daysArray.length)
    if (startDate - 1 < 0) return;

    if (startDate === endDate) {
      // deal with events that don't span multiple days
      daysArray[startDate - 1].push(event);
    } else {
      let duration = endDate - startDate;

      // if the event ends after the current month
      if (event.dateEnd.getUTCMonth() + 1 !== activeMonth) {
        endDate = daysArray.length + 1;
        duration = daysArray.length + 1 - startDate; // TODO: this is wierd and not right - not sure what to do instead
        console.log('events ends in a later month', { duration })
      }

      // if the event started in a prior month
      if (event.dateStart.getUTCMonth() + 1 !== activeMonth) {
        startDate = 1;
        duration = endDate - 1;
        console.log('events starts in a prior month', { duration })
      }

      console.log({ duration })

      for (let i = 0; i < duration; i++) {
        daysArray[startDate - 1 + i].push(event);
      }
    }
  })

  console.log({ daysArray })

  // put events in order from earliest to lastest
  daysArray.forEach(day => {
    day.sort((a, b) => {
      return a.dateStart > b.dateStart ? 1 : -1;
    })
  })

  return daysArray;
}

export default addEventsEachDay;