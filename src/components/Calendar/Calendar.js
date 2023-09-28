import React, { useEffect, useState, useCallback, useMemo } from "react";

// external libraries
import moment from "moment-timezone";
import { rrulestr, datetime } from "rrule";
import gud from "gud";

// internal libraries
import gapi from '../../lib/GAPI';

// components
import Event from "./Event";
import MultiEvent from "./MultiEvent";
import AddEvent from './AddEvent/AddEvent';

// helper functions
import { Languages } from "../../lib/utils/languages";

// redux
import { useSelector } from 'react-redux';
import { setEvents } from "../../redux/eventsSlice";

// styles
import './calendar.scss';

// global variables
const monthNames = [...Languages.EN.MONTHS];
const days = [...Languages.EN.DAYS];

function Calendar(props) {
  // const [currentDay, setCurrentDay] = useState(new Date());

  const [activeYear, setActiveYear] = useState(new Date().getFullYear());
  const [activeMonth, setActiveMonth] = useState(new Date().getMonth() + 1);
  const [selectedEvent, setSelectedEvent] = useState(false);
  const [selectedDate, setSelectedDate] = useState(false);
  // create array from 1 to number of days in month [1, 2, 3...]
  const [daysArr, setDaysArr] = useState([]);
  const [renderableEvents, setRenderableEvents] = useState([]);
  const [eventsEachDay, setEventsEachDay] = useState([]);

  // redux
  const events = useSelector((state) => state.events);
  const hICalendar = useSelector((state) => state.hICalendar);

  // functions 
  // //get dates based on rrule string between dates
  const getDatesFromRRule = useCallback((str, eventStart, betweenStart, betweenEnd) => {
    // console.log('getDatesFromRRule', { str, eventStart, betweenStart, betweenEnd });

    const strActiveMonth = activeMonth + ''

    //get recurrences using RRule
    let rstr = `DTSTART:${activeYear}${strActiveMonth.padStart(2, '0')}01T000000Z\n${str}`;
    // console.log('getDAtesFromRRule, rstr', { rstr })

    let rruleSet = rrulestr(rstr, { forceset: true });
    // console.log('getDatesFromRRule = rruleSet', rruleSet);

    // ('2012-05-01T10:30:00.000Z', '2012-07-01T10:30:00.000Z')

    //get dates
    let dates = rruleSet.between(datetime(activeYear, activeMonth, 1), datetime(activeYear, activeMonth, 31));

    return dates;
  }, [activeMonth, activeYear])

  // memos
  const daysInMonth = useMemo(() => new Date(activeYear, activeMonth, 0).getDate(), [activeYear, activeMonth]);

  const processedEvents = useMemo(() => {
    const allProcessedEvents = []
    const changed = [];
    const cancelled = [];

    // QUESTIONS:
    // 1. what info does an event give us when it is cancelled to tell us what day it was cancelled on
    // 2. how can i find the end dates/times of a reucrring event

    // events only have an originalStartTime if they are changed or cancelled
    renderableEvents.forEach((event) => {

      if (event.originalStartTime) {
        // 'cancelled' events into the cancelled array
        if (event.status === "cancelled") {
          cancelled.push(event);
          // changed events go into the changed array
        } else if (event.status === "confirmed") { //changed events
          changed.push(event);
        } else {
          console.log("Not categorized: ", event);
        }
      }

      // non recurring events
      if (!event.recurrence?.length && !event.originalStartTime) {
        console.log('found a non-repeating event', { event })
        //unchanged events
        if (event.status === "confirmed") {
          let newEvent = {
            ...event,
            changedEvents: [],
            cancelledEvents: [],
            calendarName: hICalendar.summary,
            color: hICalendar.backgroundColor
          }
          allProcessedEvents.push(newEvent);
        }

        // recurring events
      } else if (event.recurrence && !event.originalStartTime) {
        // gets all the dates for the event in the active month
        let dates = getDatesFromRRule(event.recurrence[0], event.dateStart, activeMonth, activeMonth + 1, event.timeZone);

        console.log({ dates })

        dates.forEach(day => {

          const duration = event.dateEnd - event.dateStart
          //unchanged events
          let newEvent = {
            ...event,
            dateStartTZ: event.dateStartTZ || `Etc/UTC`,
            dateEndTZ: event.dateEndTZ || 'Etc/UTC',
            changedEvents: [],
            cancelledEvents: [],
            calendarName: hICalendar.summary,
            color: hICalendar.backgroundColor,
            dateStart: day,
            dateEnd: new Date(day + duration)
          }
          console.log('found a repeating event', { newEvent })
          allProcessedEvents.push(newEvent);

        })
      }
    });

    // add changed events and cancelled events to corresponding event object
    allProcessedEvents.forEach((event, idx, arr) => {
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
    console.log({ allProcessedEvents })

    return allProcessedEvents
  }, [renderableEvents, hICalendar.summary, hICalendar.backgroundColor, activeMonth, getDatesFromRRule]);

  const firstDayOfCurrentMonth = useMemo(() => (new Date(`${activeYear}-${`${activeMonth}`.padStart(2, '0')}-01`)), [activeYear, activeMonth]);

  const dayIdx = firstDayOfCurrentMonth.getUTCDay();

  // empty days at the end of the month
  const padDays = useMemo(() => ((((-daysInMonth - firstDayOfCurrentMonth) % 7) + 7) % 7), [daysInMonth, firstDayOfCurrentMonth]);

  let localCurrentMonthName = useMemo(() => monthNames[activeMonth - 1], [activeMonth]);

  // console.log({ eventsEachDay })

  // useEffects
  useEffect(() => {

    let daysArray = [...Array(daysInMonth)].map(day => []);

    // put events in the right buckets
    processedEvents.forEach((event, i) => {
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

    // put events in order from earliest to lastest
    daysArray.forEach(day => {
      day.sort((a, b) => {
        return a.dateStart > b.dateStart ? 1 : -1;
      })
    })

    console.log({ daysArray })
    setEventsEachDay(daysArray);

  }, [processedEvents, daysInMonth, daysArr, activeMonth])

  useEffect(() => {
    // sets the days
    setDaysArr([...Array(daysInMonth + 1).keys()].slice(1));

    // fix the gapi object so that start and end have one value
    const formattedEvents = events.map(e => {
      const st = e.start?.date || e.start?.dateTime;
      const et = e.end?.date || e.end?.dateTime;
      return {
        ...e,
        allDay: e.start?.date ? true : false,
        dateEnd: et ? new Date(et) : undefined,
        dateStart: st ? new Date(st) : undefined,
        dateStartTZ: e.start?.timeZone,
        dateEndTZ: e.end?.timeZone
      }
    })

    // console.log({ formattedEvents })
    // filters all the events to just the ones that start or end in the active month
    const filteredEvents = formattedEvents.filter(e => {

      const endMonth = e.dateEnd ? e.dateEnd.getMonth() + 1 : undefined;
      const startMonth = e.dateStart ? e.dateStart.getMonth() + 1 : undefined;
      console.log(`${e.summary}`, { endMonth, startMonth, activeMonth, e })
      // console.log({ endMonth, startMonth });

      return endMonth < activeMonth || startMonth > activeMonth ? false : true;
    });

    setRenderableEvents(filteredEvents)

  }, [daysInMonth, events, activeMonth])


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

  //sets current month to previous month
  const lastMonth = () => {
    const newMonth = activeMonth - 1 > 0 ? activeMonth - 1 : 12;
    setActiveMonth(newMonth);


    if (newMonth === 12) {
      setActiveYear(activeYear - 1);
    }

  }

  //sets current month to following month
  const nextMonth = () => {
    const newMonth = activeMonth === 12 ? 1 : activeMonth + 1;
    setActiveMonth(newMonth);

    if (newMonth === 1) {
      setActiveYear(activeYear + 1);
    }
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

  // const handleDayClick = useCallback((day) => {
  //   // in local time
  //   const selectedDateObj = new Date(`${current.year()}-${current.month() + 1}-${`${day}`.padStart(2, '0')}`)
  //   setSelectedDate(selectedDateObj);

  // }, [current])

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
            {localCurrentMonthName + " " + activeYear}
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
        {[...Array(dayIdx)].map((day, i) => (
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
          // onClick={(e) => { handleDayClick(day) }}
          >
            {/* renders the numbers */}
            <span className="day-span">
              {day}
            </span>
            {eventsEachDay[day - 1].length ? eventsEachDay[day - 1].map((event, i) => (
              <div
                style={event.allDay ? { backgroundColor: hICalendar.backgroundColor, color: 'white' } : { color: '#333', border: `1px solid ${hICalendar.backgroundColor}` }} className="innerDay flex" id={"day-" + day}
                key={`eventsEachDay-${i}`}
              >
                {!event.allDay &&
                  <div>
                    <span style={{ color: hICalendar.backgroundColor }} className="event-text-span ">●</span>
                    <span>{`${event.dateStart.toLocaleTimeString().split(':')[0]}:${event.dateStart.toLocaleTimeString().split(':')[1]}`}</span>
                  </div>
                }
                <span className="event-name">{event.summary}</span>
              </div>
            ))
              :
              <div></div>
            }
          </div>
        ))}


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
