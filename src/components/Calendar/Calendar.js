import React, { useState, useCallback, useMemo } from "react";
import { zonedTimeToUtc, utcToZonedTime, format } from "date-fns-tz";

// components
import Event from "./Event";
import UpdateEvent from "./AddEvent/UpdateEvent";
import AddEvent from "./AddEvent/AddEvent";

// helper functions
import { Languages } from "../../lib/utils/languages";
import processEvents from "./helperFunctions/processEvents";
import formatEvents from "./helperFunctions/formatEvents";
import getDatesForRepeatingEvents from "./helperFunctions/getDatesForRepeatingEvents";
import filterEvents from "./helperFunctions/filterEvents";
import addEventsEachDay from "./helperFunctions/addEventsEachDay";
// redux
import { useSelector } from "react-redux";
// import { setEvents } from "../../redux/eventsSlice";

// styles
import "./calendar.scss";

// global variables
const monthNames = [...Languages.EN.MONTHS];
const days = [...Languages.EN.DAYS];

// let renders = 0;

function Calendar(props) {

  const [activeYear, setActiveYear] = useState(new Date().getFullYear());
  const [activeMonth, setActiveMonth] = useState(new Date().getMonth() + 1);
  const [selectedEvent, setSelectedEvent] = useState(false);
  const [selectedDate, setSelectedDate] = useState(false);
  const [eventsEachDay, setEventsEachDay] = useState([]);

  // redux
  const events = useSelector((state) => state.events);
  const hICalendar = useSelector((state) => state.hICalendar);

  // memos
  const daysInMonth = useMemo(
    () => new Date(activeYear, activeMonth, 0).getDate(),
    [activeYear, activeMonth]
  );

  const daysArr = useMemo(
    () => [...Array(daysInMonth + 1).keys()].slice(1),
    [daysInMonth]
  ); //[1, 2, 3, 4, ...]

  const firstDayOfCurrentMonth = useMemo(
    () => new Date(`${activeYear}-${`${activeMonth}`.padStart(2, "0")}-01`),
    [activeYear, activeMonth]
  );

  const dayIdx = firstDayOfCurrentMonth.getUTCDay();

  // empty days at the end of the month
  const padDays = useMemo(
    () => (((-daysInMonth - firstDayOfCurrentMonth) % 7) + 7) % 7,
    [daysInMonth, firstDayOfCurrentMonth]
  );

  const localCurrentMonthName = useMemo(
    () => monthNames[activeMonth - 1],
    [activeMonth]
  );

  const monthlyEvents = useMemo(() => {
    console.log('00 - montlyEvents', {events})
    // take in events
    // format events -> returns an array of events in the same format
    const formattedEvents = formatEvents(events, hICalendar);
    console.log('01 - formatEvents', {formattedEvents});
    
    // getDatesForRepeatingEvents -> returns an array of all the events including repeating ones
    const {allEvents, cancelled} = getDatesForRepeatingEvents({formattedEvents, activeMonth, activeYear});
    console.log('02 - getDatesForRepeatingEvents', {allEvents, cancelled});
    
    // processEvents -> returns an array of events with a cancelled and changed array on events that have been cancelled or changed
    const processedEvents = processEvents(allEvents, cancelled);
    console.log('03 - processEvents', {processedEvents});
    
    // filter events to just the active month
    const filteredEvents = filterEvents(processedEvents, activeMonth, activeYear);
    console.log('04 - filterEvents', {filteredEvents})
    
    const daysArray = addEventsEachDay(filteredEvents, daysInMonth, activeMonth);
    setEventsEachDay(daysArray);

    return processedEvents;

  }, [events, activeMonth, activeYear, hICalendar, daysInMonth]);

  const editEvent = useCallback(
    (e, id, day) => {
      e.stopPropagation();
      const chosenEvent = { ...monthlyEvents.find((event) => event.id === id) };
      // console.log('edit event', { chosenEvent, id, day, activeMonth })
      chosenEvent.activeDate = new Date(
        `${activeYear}-${activeMonth.toString().padStart(2, "0")}-${day
          .toString()
          .padStart(2, "0")}`
      );
      // chosenEvent.activeDate.setMinutes(chosenEvent.activeDate.getMinutes() + new Date().getTimezoneOffset());
      // chosenEvent.activeDate.setDate(obj.date);
      console.log("editEvent", { chosenEvent, activeYear, activeMonth, day });
      setSelectedEvent(chosenEvent);
    },
    [monthlyEvents, activeMonth, activeYear]
  );

  //sets current month to previous month
  const lastMonth = useCallback(() => {
    const newMonth = activeMonth - 1 > 0 ? activeMonth - 1 : 12;
    setActiveMonth(newMonth);

    if (newMonth === 12) {
      setActiveYear(activeYear - 1);
    }
  }, [activeMonth, activeYear]);

  //sets current month to following month
  const nextMonth = useCallback(() => {
    const newMonth = activeMonth === 12 ? 1 : activeMonth + 1;
    setActiveMonth(newMonth);

    if (newMonth === 1) {
      setActiveYear(activeYear + 1);
    }
  }, [activeMonth, activeYear]);

  //renders the day of week names ('SUN', 'MON'...) at the top of the calendar
  const renderDays = () => {
    return days.map((x, i) => (
      <div className="day-name" key={"day-of-week-" + i}>
        {x}
      </div>
    ));
  };

  const handleDayClick = useCallback(
    (day) => {
      const timeZoneString = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const utcDate = zonedTimeToUtc(
        `${activeYear}-${activeMonth.toString().padStart(2, "0")}-${day
          .toString()
          .padStart(2, "0")} 00:00:00`,
        `${timeZoneString}`
      );
      console.log({ utcDate }, `${activeYear}-${activeMonth}-${day} 00:00:00`);
      // in local time
      const selectedDateObj = new Date(utcDate);
      // console.log({ selectedDateObj, utcDate })
      setSelectedDate(selectedDateObj);
    },
    [activeYear, activeMonth]
  );

  console.log('Calendar Render', {monthlyEvents})

  // renders++;
  // if (renders > 50) return;
  return (
    <div className="calendar">
      <div className="calendar-header">
        <div className="calendar-navigate" onClick={lastMonth}>
          &#10094;
        </div>
        <div>
          <h2 className="calendar-title">
            {localCurrentMonthName + " " + activeYear}
          </h2>
        </div>
        <div className="calendar-navigate" onClick={nextMonth}>
          &#10095;
        </div>
      </div>
      <div className="calendar-body">
        {/* renders the names of the days at the top */}
        {renderDays()}

        {/* renders the empty days at the beginning of the month */}
        {[...Array(dayIdx)].map((day, i) => (
          <div className="day test" key={"empty-day-" + i}></div>
        ))}
        {/* render the days of the month */}
        {daysArr.length &&
          daysArr.map((day) => (
            <div
              className="day"
              key={"day-" + day}
              onClick={(e) => {
                handleDayClick(day);
              }}
            >
              {/* renders the numbers */} 
              <span className="day-span">{day}</span>
              {eventsEachDay[day - 1]?.length ? (
                eventsEachDay[day - 1].map((event, i) => (
                  <div
                    style={
                      event.allDay
                        ? {
                            backgroundColor: hICalendar.backgroundColor,
                            color: "white",
                          }
                        : {
                            color: "#333",
                            border: `1px solid ${hICalendar.backgroundColor}`,
                          }
                    }
                    className="innerDay flex"
                    id={"day-" + day}
                    key={`eventsEachDay-${i}`}
                  >
                    <Event
                      day={day}
                      editEvent={editEvent}
                      color={hICalendar.backgroundColor}
                      event={event}
                    />
                  </div>
                ))
              ) : (
                <div></div>
              )}
            </div>
          ))}

        {/* renders the empty days at the end of the month */}
        {[...Array(padDays)].map((x, i) => (
          <div className="day" key={"empty-day-2-" + i}></div>
        ))}
      </div>
      {selectedDate && (
        <AddEvent
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      )}
      {selectedEvent.id && (
        <UpdateEvent
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          setSelectedEvent={setSelectedEvent}
          selectedEvent={selectedEvent}
          events={events}
        />
      )}
    </div>
  );
}

export default Calendar;
