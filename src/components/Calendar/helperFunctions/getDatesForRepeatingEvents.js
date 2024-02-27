import getDatesFromRRule from "./getDatesFromRRule";
import moment from 'moment';

const getDatesForRepeatingEvents = ({formattedEvents, activeMonth, activeYear}) => {
  const allEvents = [];
  const cancelled = [];
  
  console.log('getDatesForRepeatingEvents', {formattedEvents})
  formattedEvents.forEach(event => {
    const duration = moment(event.endMoment).diff(moment(event.startMoment));
    if(event.status === "cancelled") {
      cancelled.push(event);
      return;
    }
    if(event.repeating){
      //repeating events
      const nextMonth = activeMonth < 12 ? activeMonth + 1 : 1;
      let dates = getDatesFromRRule({
        str: event.recurrence[0],
        eventStart: event.startMoment,
        betweenStart: activeMonth + 1,
        betweenEnd: nextMonth,
        activeMonth: activeMonth + 1,
        activeYear: activeYear,
      });
      dates.forEach((day) => {
        const additionalEvent = {...event}
        additionalEvent.dateEnd = new Date(day.getTime() + duration);
        additionalEvent.dateStart = day;
        allEvents.push(additionalEvent);
      });
    } else if(!event.recurrence?.length && event.start.dateTime){
      //non-repeating events
      const additionalEvent = {...event};
      additionalEvent.dateEnd = new Date(new Date(event.dateStart).getTime() + duration);
      allEvents.push(additionalEvent);
    } else {
      allEvents.push(event);
    }
  })

  return {allEvents, cancelled};
}

export default getDatesForRepeatingEvents;