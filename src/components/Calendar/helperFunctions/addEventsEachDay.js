const addEventsEachDay = (monthlyEvents, daysInMonth, activeMonth) => {
  const daysArray = [...Array(daysInMonth)].map(day => []);
  monthlyEvents.forEach((event) => {
    let startDate = event.dateStart.getUTCDate();
    let endDate = event.dateEnd.getUTCDate();

    if (startDate - 1 < 0) return;

    if (startDate === endDate) {
      // deal with events that don't span multiple days
      daysArray[startDate - 1].push(event);
    } else {

      // if the event ends after the current month
      if (event.dateEnd.getMonth() + 1 !== activeMonth) {
        endDate = daysArray.length + 1;
      }

      // if the event started in a prior month
      if (event.dateStart.getMonth() + 1 !== activeMonth) {
        startDate = 1;
      }

      const duration = endDate - startDate;
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