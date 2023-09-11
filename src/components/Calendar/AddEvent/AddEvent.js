import { useCallback, useEffect, useState } from 'react';
import './addEvent.scss';
import DeleteItem from './DeleteItem';
import UpdateItem from './UpdateItem';

// external libraries
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import TimePicker from 'react-time-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-clock/dist/Clock.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// my libraries
import gapi from '../../../lib/GAPI';

// redux
import { useSelector, useDispatch } from 'react-redux';
import { addEvent, modifyEvent } from '../../../redux/eventsSlice';
import { setHICalendarConfig } from '../../../redux/config';
// import { datetime, RRule, RRuleSet, rrulestr } from 'rrule';
// import moment from "moment-timezone";

// global variables
const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

function AddEvent(props) {
  // from redux
  const dispatch = useDispatch();
  const hICalendar = useSelector((state) => state.hICalendar);
  // const events = useSelector((state) => state.events);
  const config = useSelector((state) => state.config);
  const eventDate = props.selectedEvent?.start?.date || props.selectedEvent?.start?.dateTime || props.selectedDate;

  const [name, setName] = useState(props?.selectedEvent?.summary || '');
  const [description, setDescription] = useState('');
  const [eventType, setEventType] = useState('Select Event Type');
  const [subject, setSubject] = useState('');
  const [startDate, setStartDate] = useState(eventDate ? new Date(eventDate) : '');
  const [startTime, setStartTime] = useState(props.selectedEvent?.start?.dateTime ? props.selectedEvent?.start?.dateTime.split('T')[1].replace(':00Z', '') : '');
  const [endTime, setEndTime] = useState(props.selectedEvent?.end?.dateTime ? props.selectedEvent?.end?.dateTime.split('T')[1].replace(':00Z', '') : '');
  const [newSubject, setNewSubject] = useState(''); // TODO: make a new subject option
  const [allDay, setAllDay] = useState(props.selectedEvent?.start?.dateTime ? false : true);
  const [daySelected, setDaySelected] = useState(''); // used to display the day of week that a user seleced
  const [month, setMonth] = useState(''); // used to display the month user selected
  const [day, setDay] = useState(''); // used to display the day of the month (ie - 28th)
  const [ordinalsOfMonth, setOrdinalsOfMonth] = useState('');
  const [ordinalIndex, setOrdinalIndex] = useState(-1);
  const [deleteRepeatingItem, setDeleteRepeatingItem] = useState(false);
  const [modifiedEvent, setModifiedEvent] = useState({});

  // console.log('ADD EVENT', { startDate })
  // console.log('AddEvent state', { startDate }, props.selectedEvent)
  // REPEATING RULES
  const [rRuleObj, setRRuleObj] = useState({
    FREQ: 'HowOften',
    BYDAY: 'Day Of Week',
  });

  // booliean reveals repeating options
  const [repeats, setRepeats] = useState(props?.selectedEvent?.recurrence?.length ? true : false);

  const metaData = {
    description,
    subject
  };
  // "2011-06-03T10:00:00.000-07:00" - GAPI

  // console.log('AddEvent - start', { props })

  // construct the event obj
  const event = {
    'summary': name,
    'description': JSON.stringify(metaData),
    'start': {
      'timeZone': timeZone

    },
    'end': {
      'timeZone': timeZone
    },
    'reminders': {
      'useDefault': false,
      'overrides': [
        { 'method': 'email', 'minutes': 24 * 60 },
        { 'method': 'popup', 'minutes': 10 }
      ]
    }
  };

  // console.log('ADD EVENT', { subject, config })

  // creator: {email: 'applena@gmail.com'}
  // end: {date: '2023-07-05'}
  // htmlLink: "https://www.google.com/calendar/event?eid=NGJ2YWM4djRxb3FqazR1c2xyOWI3NzhraWdfMjAyMzA3MDQgYzk5ZDhuMW40dmxvbm4zYzF1Z2k4bzVzMmNAZw"
  // iCalUID: "4bvac8v4qoqjk4uslr9b778kig@google.com"
  // id: "4bvac8v4qoqjk4uslr9b778kig"
  // kind: "calendar#event"
  // recurrence: ['RRULE:FREQ=DAILY;BYDAY=MO,TU,WE,TH,FR']
  // reminders: {useDefault: false, overrides: Array(2)}
  // sequence: 0
  // start: {date: '2023-07-04'}
  // status: "confirmed"
  // summary: "weekday test"
  // updated: "2023-07-30T17:46:57.467Z"

  useEffect(() => {
    const obj = JSON.parse(props.selectedEvent?.description || '{}');

    setName(props.selectedEvent.summary);
    setDescription(obj?.description);
    setSubject(obj?.subject || config.subjectList[0]);
  }, [props.selectedEvent, config.subjectList])

  useEffect(() => {
    if (props.selectedEvent?.id) {
      // console.log('ADD EVENT - editMode = true', { props })

      if (props.selectedEvent.recurrence) {
        // ['RRULE:FREQ=DAILY;BYDAY=MO,TU,WE,TH,FR']
        // ['RRULE:FREQ=MONTHLY;BYDAY=1FR']
        // let rstr = `DTSTART:${moment(startDate).utc(true).format('YYYYMMDDTHHmmss')}Z\n${props.selectedEvent.recurrence[0]}`;
        // let rRule = RRule.fromString(rstr);
        // console.log('rRule in edit', { rRule, rstr });
        const repeatObj = {};
        const recurrenceArr = props.selectedEvent.recurrence[0].split(':')[1].split(';');
        recurrenceArr.forEach(rule => {
          const rulePart = rule.split('=');
          repeatObj[rulePart[0]] = rulePart[1];
        })

        setRRuleObj(repeatObj);

      }

    }
  }, [props.selectedEvent])

  useEffect(() => {
    const dayOfWeekString = {
      Mon: 'Monday',
      Tue: 'Tuesday',
      Wed: 'Wednesday',
      Thu: 'Thursday',
      Fri: 'Friday',
      Sat: 'Saturday',
      Sun: 'Sunday'
    }

    //find and set the ordinals - ex: 'thrid thursday of the month'
    const ordinals = ["", "first", "second", "third", "fourth", "fifth"];
    let date = props.selectedDate || new Date(props.selectedEvent?.start?.date) || new Date(props.selectedEvent?.startDate?.date) || new Date();

    // all day event - need to add in offset to make it not UTC
    if (props.selectedEvent?.start?.date) {
      date.setMinutes(date.getMinutes() + date.getTimezoneOffset())
    }
    let dateString = date + '';
    // dateString = 'Wed Aug 09 2023 00:00:00 GMT-0700 (Pacific Daylight Time)'
    let tokens = dateString.split(' ');

    // finds the number for the ordinal - ie: 1, 2, 3, 4, or 5
    const ordinalIndex = Math.ceil(tokens[2] / 7);
    setOrdinalIndex(ordinalIndex);
    const ordinalString = ordinals[ordinalIndex];
    const dayOfWeek = dayOfWeekString[tokens[0]];
    setOrdinalsOfMonth("the " + ordinalString + " " + dayOfWeek + " of the month");

    //find and set the day of the week
    let newStart = dateString.slice(0, 3);
    const dayOWeek = dayOfWeekString[newStart];
    setDaySelected(dayOWeek);

    //find and set the Month selected
    let monthIndex = date.getMonth();
    const getMonthByIndex = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'November', 'December'];
    setMonth(getMonthByIndex[monthIndex]);

    //set the day selected
    setDay(date.getDate());

  }, [props.selectedDate, props.selectedEvent]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // add start and end date/time
    if (!allDay) {
      let startDateTime = new Date(startDate);
      startDateTime.setHours(startTime.split(':')[0], startTime.split(':')[1]);

      let endDateTime = new Date(startDate);
      endDateTime.setHours(endTime.split(':')[0], endTime.split(':')[1]);

      event['start']['dateTime'] = startDateTime;
      event['end']['dateTime'] = endDateTime;
      console.log('start time', { startTime, startDate, startDateTime, event, endTime })
    } else {
      console.log('all day event', startDate)
      //"start": {"date": "2015-06-01"}
      const endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + 1);
      event['start']['date'] = startDate.toISOString().substring(0, 10);
      event['end']['date'] = endDate.toISOString().substring(0, 10);
    }

    // add recurrence
    if (repeats) {
      // const rule = new RRule({
      //   freq: RRule.WEEKLY,
      //   interval: 5,
      //   byweekday: [RRule.MO, RRule.FR],
      //   dtstart: datetime(2012, 2, 1, 10, 30),
      //   until: datetime(2012, 12, 31)
      // })
      // console.log('selected event recurrance', props.selectedEvent?.recurrence)
      let recurrence = [];
      if (!['How Often'].includes(rRuleObj.FREQ)) {
        if (rRuleObj.FREQ === 'MONTHLY') {
          console.log('!!', { ordinalIndex }, ordinalsOfMonth.split(' ')[2].substring(0, 2).toUpperCase())
          recurrence.push(`RRULE:FREQ=${rRuleObj.FREQ};BYDAY=${ordinalIndex}${ordinalsOfMonth.split(' ')[2].substring(0, 2).toUpperCase()}`)
          console.log('right after pushing', { recurrence })
        } else if (rRuleObj.FREQ === 'Weekdays') {
          recurrence.push(`RRULE:FREQ=DAILY`);
        } else {
          recurrence.push(`RRULE:FREQ=${rRuleObj.FREQ}`);
        }
        console.log('creating RRULE', { rRuleObj })
      }

      if (rRuleObj.BYDAY !== 'Day Of Week' && rRuleObj.FREQ !== 'MONTHLY') {
        recurrence.push(`BYDAY=${rRuleObj.BYDAY}`);
        console.log('pushing repeatsOn', { rRuleObj })
      }

      console.log('final', { recurrence })
      event['recurrence'] = [recurrence.join(';')];
    }

    let createdEvent = {};
    let updatedEvent = {};
    setModifiedEvent(event);
    console.log('event', { event })
    if (props.selectedEvent?.id) {
      try {
        const response = await gapi.update(hICalendar.id, props.selectedEvent.id, event);
        console.log('response from gapi', { response });
        updatedEvent = response.result;
        dispatch(modifyEvent(updatedEvent));
        props.setSelectedDate(false);
        props.setSelectedEvent(false);
        console.log('event successfully updated');
      } catch {
        console.log('problem updating event');
      }
    } else {
      try {
        const response = await gapi.create(hICalendar.id, event);
        console.log('response from gapi', { response })
        createdEvent = response.result;
        dispatch(addEvent(createdEvent));
        props.setSelectedDate(false);
        props.setSelectedEvent(false);

        console.log('event added successfully');
      } catch {
        console.log('problem adding event');
      }

    }
  }

  const addNewSubject = useCallback((e) => {
    e.preventDefault();
    // console.log(e.target.value, newSubject);
    setSubject(newSubject.toUpperCase());
    const newConfigObj = { ...config, subjectList: [...config.subjectList, newSubject.toUpperCase()] }

    dispatch(setHICalendarConfig(newConfigObj));
    // console.log('config', { newConfigObj });
    setNewSubject('');

  }, [newSubject, config, dispatch])

  const deleteSubject = useCallback((subject) => {
    const updatedSubjects = config.subjectList.filter(sub => sub !== subject);
    const newConfigObj = { ...config, subjectList: updatedSubjects }
    dispatch(setHICalendarConfig(newConfigObj));
    setSubject(updatedSubjects[0]);
  }, [config, dispatch])

  // console.log('render Add Event', { name, subject })

  return (
    <div
      className="modal show"
      style={{ display: 'block', position: 'initial' }}
    >
      <Modal.Dialog>
        <Modal.Header onHide={() => { props.setSelectedDate(false); props.setSelectedEvent(false) }} closeButton>
          <Modal.Title>Add Event</Modal.Title>
        </Modal.Header>

        <form>
          <Modal.Body>

            <div className='flex, flexCol'>
              <div className='flex'>
                <DropdownButton id="dropdown-basic-button" title={eventType}>
                  <Dropdown.Item
                    onClick={() => setEventType('Class')}
                  >Class</Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => setEventType('Everything Else')}
                  >Everything Else</Dropdown.Item>
                </DropdownButton>

                {eventType === 'Class' &&
                  <DropdownButton title={subject}>
                    {config.subjectList.map((sub, i) => (
                      <Dropdown.Item key={i + sub}>
                        <div className='flex subjects'>
                          <span onClick={(e) => {
                            console.log('setting subject', { sub });
                            setSubject(sub);
                          }}>{sub}</span>
                          <span onClick={() => deleteSubject(sub)}>x</span>
                        </div>
                      </Dropdown.Item>
                    ))}
                    <Dropdown.Divider />
                    <div className="dropdown-item">
                      <input value={newSubject} name="Create a New Subject" onChange={(e) => {
                        e.stopPropagation();
                        setNewSubject(e.target.value)
                        console.log('creating a new subject', e.target.value)
                      }}>
                      </input>
                      <button id='add-subject-button' onClick={(e) => addNewSubject(e)}>Add</button>
                    </div>
                  </DropdownButton>
                }
              </div>
              <label style={{ display: 'block', width: '100%' }}>
                <span style={{ marginRight: '8px' }}>Date</span>
                <DatePicker
                  selected={startDate}
                  onChange={(newDate) => setStartDate(newDate)}
                />
              </label>
            </div>

            <div className='flex'>
              <input style={{ display: 'inline-block', width: 'auto', marginRight: '10px' }} onClick={() => setRepeats(!repeats)} type="checkbox" defaultChecked={repeats} />
              <label>
                repeats
              </label>
            </div>

            {repeats &&
              <DropdownButton title={rRuleObj.FREQ}>
                <Dropdown.Item onClick={(e) => setRRuleObj({ ...rRuleObj, FREQ: 'DAILY' })}>Daily</Dropdown.Item>
                <Dropdown.Item onClick={(e) => setRRuleObj({ ...rRuleObj, FREQ: 'WEEKLY', BYDAY: daySelected.substring(0, 2).toUpperCase() })}>Weekly on {daySelected}</Dropdown.Item>
                <Dropdown.Item onClick={(e) => setRRuleObj({ ...rRuleObj, FREQ: 'MONTHLY' })}>Monthly on {ordinalsOfMonth}</Dropdown.Item>
                <Dropdown.Item onClick={(e) => setRRuleObj({ ...rRuleObj, FREQ: 'YEARLY' })}>Annually on {month} {day}</Dropdown.Item>
                <Dropdown.Item onClick={(e) => setRRuleObj({ ...rRuleObj, BYDAY: 'MO,TU,WE,TH,FR', FREQ: 'DAILY' })}>Every weekday (Monday to Friday)</Dropdown.Item>
              </DropdownButton>
            }

            <div className='flex flexCol'>
              <label>
                Name:
                <input
                  onChange={(e) => setName(e.target.value)}
                  type="text" name="name"
                  defaultValue={name}
                />
              </label>

              <label>
                Description:
                <input
                  onChange={(e) => setDescription(e.target.value)}
                  type="text"
                  name="description"
                  defaultValue={description}
                />
              </label>

              <div className='flex'>
                <input style={{ display: 'inline-block', width: 'auto', marginRight: '10px' }} onChange={() => setAllDay(!allDay)} type="checkbox" checked={allDay} />
                <label>
                  All Day
                </label>
              </div>

              {!allDay &&
                <div className='flex flexCol'>
                  <label>Start Time
                    <TimePicker
                      disableClock
                      onChange={setStartTime}
                      value={startTime}
                    />
                  </label>

                  <label>End Time
                    <TimePicker
                      disableClock
                      onChange={setEndTime}
                      value={endTime}
                    />
                  </label>
                </div>
              }
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button onClick={() => { props.setSelectedDate(false); props.setSelectedEvent(false) }} variant="secondary">Close</Button>
            <Button
              onClick={(e) => handleSubmit(e)}
              variant="primary">Save Changes</Button>

            {(props.selectedEvent?.id && !props.selectedEvent?.recurrence?.length) &&
              <DeleteItem
                setDeleteRepeatingItem={setDeleteRepeatingItem}
                hICalendar={hICalendar}
                setSelectedDate={props.setSelectedDate}
                setSelectedEvent={props.setSelectedEvent}
                text={'Delete'}
                selectedEvent={props.selectedEvent}
              />
            }
            {(props.selectedEvent?.id && props.selectedEvent?.recurrence?.length) &&
              <Button
                onClick={(e) => setDeleteRepeatingItem(true)}
              >
                Delete
              </Button>
            }
            {deleteRepeatingItem &&
              <div>
                <UpdateItem
                  text={'Just Today'}
                  hICalendar={hICalendar}
                  event={modifiedEvent}
                  allDay={allDay}
                  selectedEvent={props.selectedEvent}
                  setSelectedDate={props.setSelectedDate}
                  setSelectedEvent={props.setSelectedEvent}
                />

                <UpdateItem
                  text={'Today and All Future Events'}
                  hICalendar={hICalendar}
                  event={modifiedEvent}
                  allDay={allDay}
                  selectedEvent={props.selectedEvent}
                  setSelectedDate={props.setSelectedDate}
                  setSelectedEvent={props.setSelectedEvent}
                />

                <DeleteItem
                  setDeleteRepeatingItem={setDeleteRepeatingItem}
                  hICalendar={hICalendar}
                  setSelectedDate={props.setSelectedDate}
                  setSelectedEvent={props.setSelectedEvent}
                  text={'Delete All'}
                  selectedEvent={props.selectedEvent}
                />
              </div>
            }
          </Modal.Footer>
        </form>
      </Modal.Dialog>
    </div >
  )
}

export default AddEvent;