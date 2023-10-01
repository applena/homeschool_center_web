import React, { useState, useCallback, useMemo } from "react";

// internal libraries
// import gapi from '../../lib/GAPI';

// components
// import Event from "./Event";
// import MultiEvent from "./MultiEvent";
import AddEvent from './AddEvent/AddEvent';

// helper functions
import { Languages } from "../../lib/utils/languages";
import processEvents from "./helperFunctions/processEvents";
import formatEvents from "./helperFunctions/formatEvents";
import addCancelledChanged from "./helperFunctions/addCancelledChanged";
import filterEvents from './helperFunctions/filterEvents';
import addEventsEachDay from "./helperFunctions/addEventsEachDay";

// redux
import { useSelector } from 'react-redux';
// import { setEvents } from "../../redux/eventsSlice";

// styles
import './calendar.scss';

// global variables
const monthNames = [...Languages.EN.MONTHS];
const days = [...Languages.EN.DAYS];

// let renders = 0;

function Calendar(props) {
  // const [currentDay, setCurrentDay] = useState(new Date());

  const [activeYear, setActiveYear] = useState(new Date().getFullYear());
  const [activeMonth, setActiveMonth] = useState(new Date().getMonth() + 1);
  const [selectedEvent, setSelectedEvent] = useState(false);
  const [selectedDate, setSelectedDate] = useState(false);

  // redux
  const events = useSelector((state) => state.events);
  const hICalendar = useSelector((state) => state.hICalendar);

  // memos
  const daysInMonth = useMemo(() => new Date(activeYear, activeMonth, 0).getDate(), [activeYear, activeMonth]);

  const daysArr = useMemo(() => [...Array(daysInMonth + 1).keys()].slice(1), [daysInMonth]); //[1, 2, 3, 4, ...]

  const firstDayOfCurrentMonth = useMemo(() => (new Date(`${activeYear}-${`${activeMonth}`.padStart(2, '0')}-01`)), [activeYear, activeMonth]);

  const dayIdx = firstDayOfCurrentMonth.getUTCDay();

  // empty days at the end of the month
  const padDays = useMemo(() => ((((-daysInMonth - firstDayOfCurrentMonth) % 7) + 7) % 7), [daysInMonth, firstDayOfCurrentMonth]);

  const localCurrentMonthName = useMemo(() => monthNames[activeMonth - 1], [activeMonth]);

  const monthlyEvents = useMemo(() => {
    // console.log('in getCurrentMonthEvents')

    const formattedEvents = formatEvents(events);
    const { currentEvents, cancelled, changed } = processEvents(formattedEvents, hICalendar, activeMonth, activeYear);
    const allCurrentEvents = addCancelledChanged(currentEvents, cancelled, changed);
    const filteredEvents = filterEvents(allCurrentEvents, activeMonth);

    return filteredEvents;
  }, [activeMonth, activeYear, hICalendar, events])

  const eventsEachDay = useMemo(() => {
    console.log('in eventsEachDay');
    const daysArray = addEventsEachDay(monthlyEvents, daysInMonth, activeMonth);

    return daysArray;

  }, [activeMonth, daysInMonth, monthlyEvents])


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
  const lastMonth = useCallback(() => {
    const newMonth = activeMonth - 1 > 0 ? activeMonth - 1 : 12;
    setActiveMonth(newMonth);


    if (newMonth === 12) {
      setActiveYear(activeYear - 1);
    }
  }, [activeMonth, activeYear])

  //sets current month to following month
  const nextMonth = useCallback(() => {
    const newMonth = activeMonth === 12 ? 1 : activeMonth + 1;
    setActiveMonth(newMonth);

    if (newMonth === 1) {
      setActiveYear(activeYear + 1);
    }
  }, [activeMonth, activeYear])

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

  console.log({ eventsEachDay, daysArr })

  // renders++;
  // if (renders > 50) return;
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
            {eventsEachDay[day - 1]?.length ? eventsEachDay[day - 1].map((event, i) => (
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
