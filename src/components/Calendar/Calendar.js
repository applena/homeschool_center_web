import React, { useEffect, useState, useCallback, useMemo } from "react";

import moment from "moment-timezone";
import { rrulestr } from "rrule";

import Event from "./Event";
import MultiEvent from "./MultiEvent";

import { isMultiEvent } from "../../lib/utils/helper";

import gud from "gud";
import { useSelector, useDispatch } from 'react-redux';

import { Languages, availableLanguages } from "../../lib/utils/languages";

import AddEvent from './AddEvent';

import './calendar.scss';

function Calendar(props) {
  const [monthNames, setMonthNames] = useState([...Languages.EN.MONTHS]);
  const [days, setDays] = useState([...Languages.EN.DAYS]);
  const [current, setCurrent] = useState(moment().startOf("month").utc(true)); //current position on calendar (first day of month)
  const [eventsEachDay, setEventsEachDay] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(false);
  const [selectedDate, setSelectedDate] = useState(false);

  const events = useSelector((state) => state.events);

  const editEvent = useCallback((e, id) => {
    console.log('edit event', { id })
    e.stopPropagation();
    const chosenEvent = events.find(event => event.id === id);
    setSelectedEvent(chosenEvent);
  }, [events])

  //TODO: refactor this too?
  //handles rendering and proper stacking of individual blocks 
  const renderMultiEventBlock = useCallback((eventsEachDay, startDate, length, props, arrowLeft, arrowRight) => {
    let multiEventProps = {
      tooltipStyles: props?.styles?.tooltip || {},//gets this.props.styles.tooltip if exists, else empty object
      multiEventStyles: props?.styles?.multiEvent || {},
    }

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

    //render event
    eventsEachDay[startDate - 1][chosenRow] = <div
      className="isEvent"
      key={`multi-event-${chosenRow}`}>
      <MultiEvent
        {...props}
        {...multiEventProps}
        editEvent={(e, id) => editEvent(e, id)}
        length={length}
        arrowLeft={arrowLeft}
        arrowRight={arrowRight}
        key={`multi-event-${gud()}`} />
    </div>;
  }, [editEvent])


  // decides how to render events
  const drawMultiEvent = useCallback((eventsEachDay, props) => {
    let startDrawDate;
    let blockLength = 1;
    let curDate;
    let endDate;

    let arrowLeft = false;
    let arrowRight = false;

    if (props.endTime.isSame(moment(props.endTime).startOf("day"), "second")) {
      endDate = moment(props.endTime).utc(true).subtract(1, "day");
    } else {
      endDate = moment(props.endTime).utc(true);
    }

    if (moment(props.startTime).utc(true).isBefore(current)) {
      if (props.showArrow) {
        arrowLeft = true;
      }

      startDrawDate = 1;
      curDate = moment(current).utc(true);
    } else {
      startDrawDate = props.startTime.date();
      curDate = moment(props.startTime).utc(true);
    }

    while (curDate.isSameOrBefore(endDate, "day")) {
      if (curDate.date() === current.daysInMonth() && !endDate.isSame(current, 'month')) {
        if (props.showArrow) {
          arrowRight = true;
        }

        //draw then quit
        renderMultiEventBlock(eventsEachDay, startDrawDate, blockLength, props, arrowLeft, arrowRight);
        break;
      }
      if (curDate.date() === current.daysInMonth() || curDate.isSame(endDate, "day")) {
        //draw then quit
        renderMultiEventBlock(eventsEachDay, startDrawDate, blockLength, props, arrowLeft, arrowRight);
        break;
      }
      if (curDate.day() === 6) {
        //draw then reset
        renderMultiEventBlock(eventsEachDay, startDrawDate, blockLength, props, arrowLeft, arrowRight);
        startDrawDate = moment(curDate).add(1, "day").date();
        blockLength = 0;
        arrowLeft = false;
        arrowRight = false;
      }

      blockLength++;
      curDate.add(1, "day");
    }
  }, [current, renderMultiEventBlock])

  //attempts to render in a placeholder then at the end
  const renderSingleEvent = useCallback((eventsEachDay, date, props) => {
    let foundEmpty = false;
    let nodes = eventsEachDay[date - 1];
    console.log('renderSingleEven', { nodes, props })
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].props.className.includes("event") && !nodes[i].props.className.includes("isEvent")) { //target only placeholders
        props.foo = 1;
        nodes[i] = <div className="isEvent" key={`single-event-${i}`}>
          <Event {...props} editEvent={(e, id) => editEvent(e, id)} key={`single-event-${i}`} />
        </div>;
        foundEmpty = true;
        break;
      }
    }
    if (!foundEmpty) {
      eventsEachDay[date - 1].push(<div className="isEvent" key={`single-event-${date - 1}`}><Event {...props} editEvent={(e, id) => editEvent(e, id)} /></div>)
    }
  }, [editEvent])


  //get array of arrays of length days in month containing the events in each day
  const getRenderEvents = useCallback((events, singleEvents) => {
    let eventsEachDay = [...Array(current.daysInMonth())].map((e) => []); //create array of empty arrays of length daysInMonth

    // console.log('beginning of get render events', { events })
    events.forEach((event) => {
      if (event.recurrence) {
        let duration = moment.duration(event.endTime.diff(event.startTime));
        let dates = getDatesFromRRule(event.recurrence[0], event.startTime, moment(current).subtract(duration), moment(current).add(1, "month"));

        // console.log('recurrance found', event.name, event.recurrence, { duration, dates })
        //render recurrences
        dates.forEach((date) => {
          //don't render if it is cancelled
          if (event.cancelledEvents.some((cancelledMoment) => (cancelledMoment.isSame(date, "day")))) {
            return;
          }

          let props;
          //update information if event has changed
          const changedEvent = event.changedEvents.find((changedEvent) => (changedEvent.originalStartTime.isSame(date, "day")));
          let eventStart = moment.utc(date); //since rrule works with utc times
          let eventEnd = moment(eventStart).add(duration);
          props = {
            name: event.name,
            startTime: eventStart,
            endTime: eventEnd,
            description: event.description,
            location: event.location,
            calendarName: event.calendarName,
            color: event.color,
            id: event.id
          };
          if (changedEvent) {
            props = { ...props, ...changedEvent }
          }

          // console.log('!!!!', { event })
          drawMultiEvent(eventsEachDay, props);
        });
      } else {
        //render event
        //check if event is in range
        // console.log('get Render Events', { event, current })
        if (event.startTime.month() !== current.month() || event.startTime.year() !== current.year()) {
          if (event.endTime.month() !== current.month() || event.endTime.year() !== current.year()) {
            return;
          }
        }

        drawMultiEvent(eventsEachDay, event);
      }
    });

    let eventProps = {
      tooltipStyles: props?.styles?.tooltip || {}, //gets this.props.styles.tooltip if exists, else empty object
      eventStyles: props?.styles?.event || {},
      eventCircleStyles: props?.styles?.eventCircle || {},
      eventTextStyles: props?.styles?.eventText || {},
    }

    singleEvents.forEach((event) => {
      if (event.recurrence) {
        let duration = moment.duration(event.endTime.diff(event.startTime));

        //get recurrences using RRule
        let dates = getDatesFromRRule(event.recurrence[0], event.startTime, moment(current), moment(current).add(1, "month"));

        //render recurrences
        dates.forEach((date) => {
          //check if it is in cancelled
          if (event.cancelledEvents.some((cancelledMoment) => (cancelledMoment.isSame(date, "day")))) {
            return;
          }

          //if event has changed
          const changedEvent = event.changedEvents.find((changedEvent) => (changedEvent.originalStartTime.isSame(date, "day")));
          let attributes = changedEvent ? {
            name: changedEvent.name,
            startTime: changedEvent.newStartTime,
            endTime: changedEvent.newEndTime,
            description: changedEvent.description,
            location: changedEvent.location,
            calendarName: event.calendarName,
            color: event.color
          }
            : {
              name: event.name,
              startTime: moment.utc(date), //avoid bad timezone conversions,
              endTime: moment(moment.utc(date)).add(duration),
              description: event.description,
              location: event.location,
              calendarName: event.calendarName,
              color: event.color

            }

          renderSingleEvent(eventsEachDay, moment(props.startTime).date(), { ...attributes, ...eventProps });
        });
      } else {
        //check if event is in current month
        if (event.startTime.month() !== current.month() || event.startTime.year() !== current.year()) {
          return;
        }

        renderSingleEvent(eventsEachDay, moment(event.startTime).date(), { ...event, ...eventProps });
      }
    });
    // console.log({ eventsEachDay })
    return eventsEachDay;
  }, [current, drawMultiEvent, props.startTime, renderSingleEvent, props.styles])

  //get easy to work with events and singleEvents from response
  const processEvents = useCallback((items, calendarName, color) => {
    let singleEvents = [];
    let events = [];
    let changed = [];
    let cancelled = [];

    items.forEach((event) => {
      // console.log('processEvent', { event })
      if (event.originalStartTime) { //cancelled or changed events
        if (event.status === "cancelled") { //cancelled events
          cancelled.push({
            recurringEventId: event.recurringEventId,
            originalStartTime: event.originalStartTime.dateTime ? moment(event.originalStartTime.dateTime) : moment.parseZone(event.originalStartTime.date),
          });
        } else if (event.status === "confirmed") { //changed events
          changed.push({
            recurringEventId: event.recurringEventId,
            name: event.summary,
            description: event.description,
            location: event.location,
            originalStartTime: event.originalStartTime.dateTime ? moment(event.originalStartTime.dateTime) : moment.parseZone(event.originalStartTime.date),
            newStartTime: event.start.dateTime ? moment(event.start.dateTime) : moment.parseZone(event.start.date),
            newEndTime: event.end.dateTime ? moment(event.end.dateTime) : moment.parseZone(event.end.date),
          });
        } else {
          console.log("Not categorized: ", event);
        }
      } else if (event.status === "confirmed") { //normal events
        let newEvent = {
          id: event.id,
          name: event.summary,
          startTime: event.start.dateTime ? moment(event.start.dateTime) : moment.parseZone(event.start.date),
          endTime: event.end.dateTime ? moment(event.end.dateTime) : moment.parseZone(event.end.date),
          description: event.description,
          location: event.location,
          recurrence: event.recurrence,
          changedEvents: [],
          cancelledEvents: [],
          calendarName: calendarName,
          color: color
        };

        if (isMultiEvent(newEvent.startTime, newEvent.endTime)) {
          events.push(newEvent);
        } else {
          singleEvents.push(newEvent);
        }
      } else {
        console.log("Not categorized: ", event);
      }
    });

    //add changed events and cancelled events to corresponding event object
    events.forEach((event, idx, arr) => {
      if (event.recurrence) {
        //push changed events
        changed.filter(change => change.recurringEventId === event.id).forEach((change) => {
          arr[idx].changedEvents.push(change);
        });

        //push cancelled events
        cancelled.filter(cancel => cancel.recurringEventId === event.id).forEach((cancel) => {
          arr[idx].cancelledEvents.push(cancel.originalStartTime);
        });
      }
    });

    singleEvents.forEach((event, idx, arr) => {
      if (event.recurrence) {
        //push changed events
        changed.filter(change => change.recurringEventId === event.id).forEach((change) => {
          arr[idx].changedEvents.push(change);
        });

        //push cancelled events
        cancelled.filter(cancel => cancel.recurringEventId === event.id).forEach((cancel) => {
          arr[idx].cancelledEvents.push(cancel.originalStartTime);
        });
      }
    });

    return { events, singleEvents };
  }, [])


  useEffect(() => {
    if (
      Boolean(props.language) &&
      availableLanguages.includes(props.language.toUpperCase())
    ) {
      // try to change language
      try {
        const lang = props.language.toUpperCase();
        setMonthNames([...Languages[lang].MONTHS]);
        setDays([...Languages[lang].DAYS]);
      } catch (err) {
        console.error("Error choosing a new language", err);
      }
    }


    //process events
    const { events, singleEvents } = processEvents(props.events, props.summary, props.color);
    // console.log('results of processEvents', { events, singleEvents })

    setEventsEachDay(getRenderEvents(events, singleEvents));
  }, [props.color, props.language, props.events, props.summary, getRenderEvents, processEvents])

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

  // const clearEvents = () => {
  //   for (let i = 1; i <= current.daysInMonth(); i++) {
  //     const node = document.getElementById("day-" + i);
  //     while (node.lastElementChild) {
  //       node.removeChild(node.lastElementChild);
  //     }
  //   }
  // }

  //renders the day of week names
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

  //renders the blocks for the days of each month
  const renderDates = useCallback((eventsEachDay) => {
    // console.log('render dates', { eventsEachDay })
    const days = [...Array(current.daysInMonth() + 1).keys()].slice(1); // create array from 1 to number of days in month

    const dayOfWeek = current.day(); //get day of week of first day in the month

    const padDays = (((-current.daysInMonth() - current.day()) % 7) + 7) % 7; //number of days to fill out the last row    

    return [
      [...Array(dayOfWeek)].map((x, i) => (
        <div
          className="day test"
          key={"empty-day-" + i}
        ></div>
      )),
      days.map(x => {
        // x is the day of the month -- ie. 23
        return (
          <div
            className="day"
            key={"day-" + x}
            onClick={() => {
              setSelectedDate(new Date(`${current.year()}-${current.month() + 1}-${`${x}`.padStart(2, '0')}`));
            }}
          >
            <span className="day-span">
              {x}
            </span>
            <div className="innerDay" id={"day-" + x}>{eventsEachDay[x - 1]}</div>
          </div>
        )
      }),
      [...Array(padDays)].map((x, i) => (
        <div
          className="day"
          key={"empty-day-2-" + i}
        ></div>
      ))
    ];
  }, [current])

  //get dates based on rrule string between dates
  const getDatesFromRRule = (str, eventStart, betweenStart, betweenEnd) => {
    //get recurrences using RRule
    let rstr = `DTSTART:${moment(eventStart).utc(true).format('YYYYMMDDTHHmmss')}Z\n${str}`;
    let rruleSet = rrulestr(rstr, { forceset: true });

    //get dates
    let begin = moment(betweenStart).utc(true).toDate();
    let end = moment(betweenEnd).utc(true).toDate();
    let dates = rruleSet.between(begin, end);
    // console.log('getting dates from RRule', { begin, end, dates, rstr, rruleSet })
    return dates;
  }

  let currentMonth = useMemo(() => monthNames[current.month()], [current, monthNames]);
  // console.log('calendar render', { selectedDate, current, currentMonth });

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
        {renderDays()}
        {renderDates(eventsEachDay)}
      </div>
      {props.showFooter &&
        <div className="calendar-footer">
          <div className="calendar-footer-timezone">
            All times shown your timezone ({moment().tz(moment.tz.guess()).format("z")})
          </div>
        </div>
      }

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
