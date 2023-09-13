import React, { useEffect, useState, useCallback, useMemo } from "react";

// external libraries
import moment from "moment-timezone";
import { rrulestr } from "rrule";
import gud from "gud";

// components
import Event from "./Event";
import MultiEvent from "./MultiEvent";
import AddEvent from './AddEvent/AddEvent';

// helper functions
import { Languages, availableLanguages } from "../../lib/utils/languages";

// redux
import { useSelector } from 'react-redux';

// styles
import './calendar.scss';

function Calendar(props) {
  const [monthNames, setMonthNames] = useState([...Languages.EN.MONTHS]);
  const [days, setDays] = useState([...Languages.EN.DAYS]);
  const [current, setCurrent] = useState(moment().startOf("month").utc(true)); //current position on calendar (first day of month) in UTC time
  const [eventsEachDay, setEventsEachDay] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(false);
  const [selectedDate, setSelectedDate] = useState(false);
  // create array from 1 to number of days in month [1, 2, 3...]
  const [daysArr, setDaysArr] = useState([]);
  //get day of week of first day in the month (ie 5 = friday)
  const [dayOfWeek, setDayOfWeek] = useState(current.day());
  //number of days to fill out the last row 
  const [padDays, setPadDays] = useState((((-current.daysInMonth() - current.day()) % 7) + 7) % 7);

  // redux
  const events = useSelector((state) => state.events);
  const hICalendar = useSelector((state) => state.hICalendar);

  // get array of arrays of length days in month containing the events in each day
  const getRenderEvents = useCallback((allEvents) => {
    console.log('getRenderEvents', { allEvents })
    const repeatingEvents = [];
    const nonRepeatingEvents = [];

    //create array of empty arrays of length daysInMonth
    let emptyMonthArrays = [...Array(current.daysInMonth())].map((e) => []);

    // separate repeating events and non-repeating events
    allEvents.forEach(event => event.recurrence ? repeatingEvents.push(event) : nonRepeatingEvents.push(event))

    renderNonRepeatingEvents(nonRepeatingEvents, emptyMonthArrays);

    // renderAllDayAndLongerEvents()
    // renderRepeatingEvents()
    // renderSingleTimedNonRepeatingEvents()

    // this is only for all day events
    // allEvents.forEach((event) => {
    //   if (!event.recurrence) return;
    //   let duration = moment.duration(moment(event.endTime).diff(moment(event.startTime)));

    //   // gets an array of dates for the month
    //   // [Sun Sep 17 2023 11:00:00 GMT-0700 (Pacific Daylight Time)...]
    //   let dates = getDatesFromRRule(event.recurrence[0], event.start, moment(current).subtract(duration), moment(current).add(1, "month"));

    //   // console.log({ dates });
    //   dates.forEach((date) => {
    //     // turn event.cancelledEvent from an array of objects into an array of dates
    //     const cancelledEvents = event.cancelledEvents.map(e => new Date(e.date || e.dateTime));

    //     //don't render if it is cancelled
    //     if (cancelledEvents.includes(date)) return;

    //     //update information if event has changed
    //     const changedEvent = event.changedEvents.find((changedEvent) => {
    //       const match = new Date(changedEvent.originalStartTime.date || changedEvent.originalStartTime.dateTime).getTime() === date.getTime()
    //       return match;
    //     });

    //   if (!changedEvent) return; // all done

    //   // console.log('changed event', { changedEvent })

    //   let props = {
    //     summary: event.summary,
    //     start: event.start,
    //     end: event.end,
    //     description: event.description,
    //     location: event.location,
    //     calendarName: event.calendarName,
    //     color: event.color,
    //     id: event.id,
    //     ...changedEvent
    //   };

    //   console.log('updated event info', { props, event })

    //   // eventsEachDay is an array of empty arrays at this point
    //   drawMultiEvent(eventsEachDay, props);
    // });


    // drawMultiEvent(eventsEachDay, event);

  });

  const renderNonRepeatingEvents = (nonRepeatingEvents, emptyMonthArrays) => {
    let i = emptyMonthArrays.length;
    // find events in current month
    // look at end date
    nonRepeatingEvents.filter(e => {
      let end = e.end.date || e.end.dateTime;
      const month = new Date(end).getMonth();
      console.log({ end, month });
      return e.end.date || e.end.dateTime
    })
    while (i > 0) {
      console.log(emptyMonthArrays[i])
      i--;
    }
  }

  // let eventProps = {
  //   tooltipStyles: props?.styles?.tooltip || {}, //gets this.props.styles.tooltip if exists, else empty object
  //   eventStyles: props?.styles?.event || {},
  //   eventCircleStyles: props?.styles?.eventCircle || {},
  //   eventTextStyles: props?.styles?.eventText || {},
  // }

  // sorts events that are not all day so they render from earliest to lastest
  // singleEvents.sort((a, b) => {
  //   const aTime = a.startTime.format('HH:mm');
  //   const bTime = b.startTime.format('HH:mm');

  //   const aDateTime = new Date(`2000-01-01T${aTime}:00Z`);
  //   const bDateTime = new Date(`2000-01-01T${bTime}:00Z`);
  //   return aDateTime > bDateTime ? 1 : -1;
  // });
  // console.log('single events', { singleEvents })

  // singleEvents.forEach((event) => {
  //   if (!event.recurrence) {
  //     //check if event is in current month
  //     if (event.startTime.month() !== current.month() || event.startTime.year() !== current.year()) {
  //       return;
  //     }

  // console.log('renderSingleEvent', event.name, event.startTime, moment(event.startTime).date())

  //   renderSingleEvent(eventsEachDay, moment(event.startTime).utc(true).date(), { ...event, ...eventProps });
  //   return;
  // };
  // let duration = moment.duration(event.endTime.diff(event.startTime));

  //get recurrences using RRule
  // console.log('single event get dates from rrule', event.name)
  // let dates = getDatesFromRRule(event.recurrence[0], event.startTime, moment(current), moment(current).add(1, "month"), event.timeZone);

  //render recurrences
  // dates.forEach((date) => {
  //   //check if it is in cancelled
  //   if (event.cancelledEvents.some((cancelledMoment) => (cancelledMoment.isSame(date, "day")))) {
  //     return;
  //   }

  //   //if event has changed
  //   const changedEvent = event.changedEvents.find((changedEvent) => (changedEvent.originalStartTime.isSame(date, "day")));
  //   let attributes = changedEvent ? {
  //     name: changedEvent.name,
  //     startTime: changedEvent.newStartTime,
  //     endTime: changedEvent.newEndTime,
  //     description: changedEvent.description,
  //     location: changedEvent.location,
  //     calendarName: event.calendarName,
  //     color: event.color,
  //     id: event.id
  //   }
  //     : {
  //   name: event.name,
  //   startTime: moment.utc(date), //avoid bad timezone conversions,
  //   endTime: moment(moment.utc(date)).add(duration),
  //   description: event.description,
  //   location: event.location,
  //   calendarName: event.calendarName,
  //   color: event.color,
  //   id: event.id
  // }

  // console.log('renderSingleEvent', event.name, event.startTime, attributes.startTime, date, event.recurrence)

  // renderSingleEvent(eventsEachDay, moment(date).date(), { ...attributes, ...eventProps });
  //   });
  // });
  // console.log({ eventsEachDay })
  // return eventsEachDay;
  // }, [current])

  // this function creates two arrays - singleEvents and allDayEvents
  // it puts all the changed and cancelled events into an array on the original event so that all events have a changedEvents and cancelledEvent array with any events that have been cancelled or changed.
  const processEvents = useCallback((allEvents, calendarName, color) => {
    let processedEvents = []
    let changed = [];
    let cancelled = [];

    // events only have an originalStartTime if they are changed or cancelled
    allEvents.forEach((event) => {
      if (event.originalStartTime) {
        // 'cancelled' events into the cancelled array
        if (event.status === "cancelled") {
          cancelled.push({
            recurringEventId: event.recurringEventId,
            originalStartTime: event.originalStartTime
          });
          // changed events go into the changed array
        } else if (event.status === "confirmed") { //changed events
          changed.push({
            recurringEventId: event.recurringEventId,
            summary: event.summary,
            description: event.description,
            location: event.location,
            originalStartTime: event.originalStartTime,
            newStart: event.start,  // object {date: '2023-09-17', timeZone: "America/Los_Angeles"} or {dateTime: '2023-09-17T18:00:00Z', timeZone: "America/Los_Angeles"}
            newEnd: event.end, // same format as start
            timeZone: event.start.timeZone
          });
        } else {
          console.log("Not categorized: ", event);
        }

        //unchanged events
      } else if (event.status === "confirmed") {
        let newEvent = {
          id: event.id,
          summary: event.summary,
          start: event.start,
          end: event.end,
          description: event.description,
          location: event.location,
          recurrence: event.recurrence,
          changedEvents: [],
          cancelledEvents: [],
          calendarName: calendarName,
          color: color,
          timeZone: event.start.timeZone
        }

        processedEvents.push(newEvent);

      } else {
        console.log("Not categorized: ", event);
      }
    });

    // add changed events and cancelled events to corresponding event object
    processedEvents.forEach((event, idx, arr) => {
      if (!event.recurrence) return;
      // reduce the changed array to only ones that match the event id
      // pushing the changed events into the changedEvents array on the event itself
      changed.filter(change => change.recurringEventId === event.id).forEach((changedEvent) => {
        arr[idx].changedEvents.push(changedEvent);
      });

      // finding all the canceled events that match the event.id
      // push each of those canceled events into the cancelledEvent arry on the event itself
      cancelled.filter(cancel => cancel.recurringEventId === event.id).forEach((cancel) => {
        arr[idx].cancelledEvents.push(cancel.originalStartTime);
      });

    });

    return processedEvents;
  }, [])

  useEffect(() => {
    setDaysArr([...Array(current.daysInMonth() + 1).keys()].slice(1));

    // console.log({ allDayEvents, singleEvents })

    getRenderEvents(processEvents(events, hICalendar.summary, hICalendar.backgroundColor));

    // setEventsEachDay(getRenderEvents(events, singleEvents));
  }, [current, events, hICalendar.summary, hICalendar.backgroundColor, processEvents])

  const editEvent = useCallback((obj) => {
    // console.log('edit event', { obj })
    obj.e.stopPropagation();
    const chosenEvent = { ...events.find(event => event.id === obj.id) };
    chosenEvent.activeDate = obj.current.toDate();
    chosenEvent.activeDate.setMinutes(chosenEvent.activeDate.getMinutes() + new Date().getTimezoneOffset());
    // console.log('current to date OBJ', chosenEvent.activeDate)
    chosenEvent.activeDate.setDate(obj.date);
    console.log('!', { chosenEvent, obj })
    setSelectedEvent(chosenEvent);
  }, [events])

  // //TODO: refactor this too?
  //handles rendering and proper stacking of individual blocks 
  const renderMultiEventBlock = useCallback((eventsEachDay, startDate, length, props) => {
    let multiEventProps = {
      tooltipStyles: props?.styles?.tooltip || {},//gets this.props.styles.tooltip if exists, else empty object
      multiEventStyles: props?.styles?.multiEvent || {},
    }

    // console.log('renderMultiEventBlock', { eventsEachDay })

    let maxBlocks = 0;
    let closedSlots = []; //keep track of rows that the event can't be inserted into

    for (let i = 0; i < length; i++) {
      let dayEvents = eventsEachDay[startDate - 1 + i];

      if (dayEvents.length > maxBlocks) {
        maxBlocks = dayEvents.length;
      }

      //address rows that are not the last element in closedSlots
      for (let j = 0; j < maxBlocks; j++) {
        if (j > dayEvents.length) {
          break;
        } else if (closedSlots.includes(j)) {
          continue;
        }
        if (dayEvents[j].props.className.includes("isEvent")) {
          closedSlots.push(j);
        }
      }
    }

    let chosenRow;
    for (let i = 0; i <= maxBlocks; i++) {
      if (!closedSlots.includes(i)) {
        chosenRow = i;
        break;
      }
    }

    //fill in placeholders
    for (let i = 0; i < length; i++) {
      //placeholders
      while (eventsEachDay[startDate - 1 + i].length <= chosenRow) {
        eventsEachDay[startDate - 1 + i].push(<div className="event below placeholder"></div>);
      }

      //rest of event that is under the main banner
      eventsEachDay[startDate - 1 + i][chosenRow] = <div className="isEvent event below"></div>;
    }

    // console.log('rendering mulit events', { props, multiEventProps })
    // console.log('start date -1', startDate - 1)
    //render event
    eventsEachDay[startDate - 1][chosenRow] = <div
      className="isEvent"
      key={`multi-event-${chosenRow}`}>
      <MultiEvent
        {...props}
        {...multiEventProps}
        editEvent={(e, id) => editEvent({ id, date: startDate, e, current })}
        length={length}
        key={`multi-event-${gud()}`} />
    </div>;
  }, [editEvent, current])


  // decides how to render events
  const drawMultiEvent = useCallback((eventsEachDay, props) => {
    // console.log('draw multi event', { eventsEachDay });
    let startDrawDate;
    let blockLength = 1;
    let curDate;
    let endDate;

    // if it is an event that ends at 12am, then set the endDate to be the day before
    if (moment(props.end.date || props.end.dateTime).isSame(moment(props.endTime).startOf("day"), "second")) {
      endDate = moment(props.end.date || props.end.dateTime).utc().subtract(1, "day");
    } else {
      endDate = moment(props.end.date || props.end.dateTime).utc();
    }
    // console.log('end date', { endDate })

    // if the start date is before the beginning of the month, then startDrawDate is 1 and currDate is the beginning of the month otherwise, it is the start date
    if (moment(props.start.date || props.start.dateTime).utc().isBefore(current)) {
      startDrawDate = 1;
      curDate = moment(current).utc();
    } else {
      startDrawDate = moment(props.start.date || props.start.dateTime).date();
      curDate = moment(props.start.date || props.start.dateTime).utc();
    }

    while (curDate.isSameOrBefore(endDate, "day")) {
      // if
      if (curDate.date() === current.daysInMonth() && !endDate.isSame(current, 'month')) {

        //draw then quit
        renderMultiEventBlock(eventsEachDay, startDrawDate, blockLength, props);
        break;
      }
      if (curDate.date() === current.daysInMonth() || curDate.isSame(endDate, "day")) {
        //draw then quit
        renderMultiEventBlock(eventsEachDay, startDrawDate, blockLength, props);
        break;
      }
      if (curDate.day() === 6) {
        //draw then reset
        renderMultiEventBlock(eventsEachDay, startDrawDate, blockLength, props);
        startDrawDate = moment(curDate).add(1, "day").date();
        blockLength = 0;
      }

      blockLength++;
      curDate.add(1, "day");
    }
  }, [current])

  // //attempts to render in a placeholder then at the end
  // const renderSingleEvent = useCallback((eventsEachDay, date, props) => {
  //   // console.log('ren derSingleEvent', { eventsEachDay, date, props });
  //   let foundEmpty = false;
  //   let nodes = eventsEachDay[date - 1];
  //   // console.log('renderSingleEven', { nodes, props })
  //   for (let i = 0; i < nodes.length; i++) {
  //     if (nodes[i].props.className.includes("event") && !nodes[i].props.className.includes("isEvent")) { //target only placeholders
  //       nodes[i] = <div className="isEvent" key={`single-event-${i}-${props.id}`}>
  //         <Event
  //           {...props}
  //           editEvent={(e, id) => editEvent({ id, date, e, current })} key={`e-single-event-${i}-${props.id}`}
  //         />
  //       </div>;
  //       foundEmpty = true;
  //       break;
  //     }
  //   }
  //   if (!foundEmpty) {
  //     eventsEachDay[date - 1].push(
  //       <div className="isEvent" key={`single-event-${date - 1}-${props.id}`}>
  //         <Event
  //           {...props}
  //           editEvent={(e, id) => editEvent({ id, date, e, current })}
  //         />
  //       </div>)
  //   }
  // }, [editEvent, current])

  //sets current month to previous month
  const lastMonth = () => {
    // console.log('last month', current.subtract(1, 'months'))
    setCurrent(moment(current.subtract(1, "months")));
  }

  //sets current month to following month
  const nextMonth = () => {
    // console.log('next month', current.add(1, 'months'))
    setCurrent(moment(current.add(1, "months")));
  }

  //renders the day of week names ('SUN', 'MON'...) at the top of the calendar
  const renderDays = () => {
    return days.map((x, i) => (
      <div
        className="day-name"
        key={"day-of-week-" + i}
      >
        {x}
      </div>
    ));
  }

  const handleDayClick = useCallback((day) => {
    // in local time
    const selectedDateObj = new Date(`${current.year()}-${current.month() + 1}-${`${day}`.padStart(2, '0')}`)
    setSelectedDate(selectedDateObj);

  }, [current])

  // //get dates based on rrule string between dates
  const getDatesFromRRule = (str, eventStart, betweenStart, betweenEnd) => {
    // console.log('getDatesFromRRule', { str, eventStart, betweenStart, betweenEnd });

    //get recurrences using RRule
    let rstr = `DTSTART:${moment(eventStart.date || eventStart.dateTime).utc().format('YYYYMMDDTHHmmss')}Z\n${str}`;
    // console.log('getDatesFromRRule = rstr', { rstr });


    let rruleSet = rrulestr(rstr, { forceset: true });

    //get dates
    let begin = moment(betweenStart).utc().toDate();
    let end = moment(betweenEnd).utc().toDate();
    let dates = rruleSet.between(begin, end);

    return dates;
  }

  let currentMonth = useMemo(() => monthNames[current.month()], [current, monthNames]);

  return (
    <div
      className="calendar"
    >
      <div className="calendar-header">
        <div
          className="calendar-navigate"
          onClick={lastMonth}
        >
          &#10094;
        </div>
        <div>
          <h2 className="calendar-title">
            {currentMonth + " " + current.year()}
          </h2>
        </div>
        <div
          className="calendar-navigate"
          onClick={nextMonth}
        >
          &#10095;
        </div>
      </div>
      <div className="calendar-body">
        {/* renders the names of the days at the top */}
        {renderDays()}

        {/* renders the empty days at the beginning of the month */}
        {[...Array(dayOfWeek)].map((day, i) => (
          <div
            className="day test"
            key={"empty-day-" + i}
          ></div>
        ))
        }
        {/* render the days of the month */}
        {daysArr.length && daysArr.map(day => (
          <div
            className="day"
            key={"day-" + day}
            onClick={(e) => { handleDayClick(day) }}>
            {/* renders the numbers */}
            <span className="day-span">
              {day}
            </span>
            <div className="innerDay" id={"day-" + day}>
              {eventsEachDay[day - 1]}
            </div>
          </div>
        )
        )}

        {/* renders the empty days at the end of the month */}
        {[...Array(padDays)].map((x, i) => (
          <div
            className="day"
            key={"empty-day-2-" + i}
          ></div>
        ))}

      </div>
      {(selectedDate || selectedEvent) &&
        <AddEvent
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          foo={1}
          selectedEvent={selectedEvent}
          setSelectedEvent={setSelectedEvent}
        />
      }
    </div>
  );
}


export default Calendar;
