import { useEffect, useState } from 'react';
import './addEvent.scss';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import TimePicker from 'react-time-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-clock/dist/Clock.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { gapi } from 'gapi-script';
import { useSelector, useDispatch } from 'react-redux';
import { setEvents, removeEvent } from '../../redux/eventsSlice';

function AddEvent(props) {
  const [name, setName] = useState(props?.selectedEvent?.summary || '');
  const [description, setDescription] = useState(props?.selectedEvent?.description || '');
  const [eventType, setEventType] = useState('Select Event Type');
  const [subject, setSubject] = useState('Subject');
  const [startDate, setStartDate] = useState(new Date(props.selectedEvent?.start?.date) || props.selectedDate);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [newSubject, setNewSubject] = useState(''); // TODO: make a new subject option
  const [allDay, setAllDay] = useState(true);
  const [daySelected, setDaySelected] = useState(''); // used to display the day of week that a user seleced
  const [month, setMonth] = useState(''); // used to display the month user selected
  const [day, setDay] = useState(''); // used to display the day of the month (ie - 28th)
  const [ordinalsOfMonth, setOrdinalsOfMonth] = useState('');

  // REPEATING RULES
  const [rRuleObj, setRRuleObj] = useState({
    FREQ: 'HowOften',
    BYDAY: 'Day Of Week',
  });

  // booliean reveals repeating options
  const [repeats, setRepeats] = useState(props?.selectedEvent?.recurrence?.length ? true : false);

  // from redux
  const dispatch = useDispatch();
  const hICalendar = useSelector((state) => state.hICalendar);

  // console.log('ADD EVENT', { props, repeats })

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
    if (props.selectedEvent?.id) {
      console.log('ADD EVENT - editMode = true', { props })
      setName(props.selectedEvent.summary);

      if (props.selectedEvent.recurrence) {
        // ['RRULE:FREQ=DAILY;BYDAY=MO,TU,WE,TH,FR']
        // ['RRULE:FREQ=MONTHLY;BYDAY=1FR']

        const repeatObj = {};
        const recurrenceArr = props.selectedEvent.recurrence[0].split(':')[1].split(';');
        recurrenceArr.forEach(rule => {
          const rulePart = rule.split('=');
          switch (rulePart[0]) {
            case 'FREQ':
              repeatObj.FREQ = rulePart[1];
              break;

            case 'BYDAY':
              repeatObj.BYDAY = rulePart[1];
              break;

            default:
              console.log('rule not found');
          }
        })

        setRRuleObj(repeatObj);

      }

    }
  }, [props.selectedEvent])

  useEffect(() => {
    // console.log('selected date from index', props)

    //find and set the ordinals - ex: 'thrid thursday of the month'
    const ordinals = ["", "first", "second", "third", "fourth", "fifth"];
    let date = props.selectedDate || new Date(props.selectedEvent?.start?.date) || new Date(props.selectedEvent?.startDate?.date) || new Date();
    let dateString = date + '';
    console.log({ date })
    // let tokens = date.split(/[ ,]/);
    let tokens = dateString.split(' ');
    const dayOfWeek = getTheDayOfWeek(tokens[0]);
    setOrdinalsOfMonth("the " + ordinals[Math.ceil(tokens[2] / 7)] + " " + dayOfWeek + " of the month");


    //find and set the day of the week
    let newStart = dateString.slice(0, 3);
    const dayOWeek = getTheDayOfWeek(newStart);
    setDaySelected(dayOWeek);

    // console.log('handle select', props.selectedDate);
    //find and set the Month selected
    let monthIndex = date.getMonth();
    // console.log({ monthIndex });
    switch (monthIndex) {
      case 0:
        setMonth('January');
        break;
      case 1:
        setMonth('February');
        break;
      case 2:
        setMonth('March');
        break;
      case 3:
        setMonth('April');
        break;
      case 4:
        setMonth('May');
        break;
      case 5:
        setMonth('June');
        break;
      case 6:
        setMonth('July');
        break;
      case 7:
        setMonth('August');
        break;
      case 8:
        setMonth('September');
        break;
      case 9:
        setMonth('October');
        break;
      case 10:
        setMonth('November');
        break;
      case 11:
        setMonth('December');
        break;
      default:
        setMonth('');
    }

    //set the day selected
    setDay(date.getDate());

  }, [props.selectedDate, props.selectedEvent]);

  const getTheDayOfWeek = (abrivation) => {
    switch (abrivation) {
      case 'Mon':
        return 'Monday';
      case 'Tue':
        return 'Tuesday';
      case 'Wed':
        return 'Wednesdday';
      case 'Thu':
        return 'Thursday';
      case 'Fri':
        return 'Friday';
      case 'Sat':
        return 'Saturday';
      case 'Sun':
        return ('Sunday');
      default:
        return ('');
    }
  }

  const deleteItem = async (e, id) => {
    e.preventDefault();
    try {
      dispatch(removeEvent(id));
      await gapi.client.calendar.events.delete({
        'calendarId': hICalendar.id,
        'eventId': id
      });
      props.setSelectedDate(false);
      props.setSelectedEvent(false);
      console.log('sucessfully deleted')
    } catch {
      console.log('something went wrong with delete');
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    props.setSelectedEvent(false);

    // "2011-06-03T10:00:00.000-07:00" - GAPI

    // construct the event obj
    const event = {
      'summary': name,
      'description': description,
      'start': {
        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone

      },
      'end': {
        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      'reminders': {
        'useDefault': false,
        'overrides': [
          { 'method': 'email', 'minutes': 24 * 60 },
          { 'method': 'popup', 'minutes': 10 }
        ]
      }
    };

    // add start and end date/time
    if (!allDay) {
      console.log('Not all day', allDay, startDate)
      let startDateTime = new Date(startDate);
      startDateTime.setHours(startTime.split(':')[0], startTime.split(':')[1]);

      let endDateTime = new Date(startDate);
      endDateTime.setHours(endTime.split(':')[0], endTime.split(':')[1]);

      event['start']['dateTime'] = startDateTime;
      event['end']['dateTime'] = endDateTime;
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
      let recurrence = [];
      if (!['How Often'].includes(rRuleObj.FREQ)) {
        if (rRuleObj.FREQ === 'MONTHLY') {
          recurrence.push(`RRULE:FREQ=${rRuleObj.FREQ};BYDAY=1${ordinalsOfMonth.split(' ')[2].substring(0, 2).toUpperCase()}`)
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

      event['recurrence'] = [recurrence.join(';')];
    }

    console.log({ event });

    if (props.selectedEvent?.id) {
      try {
        await gapi.client.calendar.events.update({
          'calendarId': hICalendar.id,
          'eventId': props.selectedEvent.id,
          'resource': event
        })
        console.log('event successfully updated');
      } catch {
        console.log('problem updating event');
      }
    } else {
      try {
        await gapi.client.calendar.events.insert({
          'calendarId': hICalendar.id,
          'resource': event
        });
        console.log('event added successfully');
      } catch {
        console.log('problem adding event');
      }

    }

    // request.execute(function (event) {
    //   console.log('Event created: ' + event.htmlLink);
    // });


    const events = await gapi.client.calendar.events.list({ calendarId: hICalendar.id })
    console.log({ events });
    dispatch(setEvents(events.result.items));
    props.setSelectedDate(false);
    props.setSelectedEvent(false);
  }

  console.log('render Add Event', { name })

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
                    <Dropdown.Item onClick={(e) => setSubject(e.target.textContent)}>ELA</Dropdown.Item>
                    <Dropdown.Item onClick={(e) => setSubject(e.target.textContent)}>Math</Dropdown.Item>
                    <Dropdown.Item onClick={(e) => setSubject(e.target.textContent)}>Science</Dropdown.Item>
                    <Dropdown.Item onClick={(e) => setSubject(e.target.textContent)}>History</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={(e) => e.stopPropagation()}><input type="text" name="Create a New Subject" onChange={(e) => { setNewSubject(e.target.value); setSubject(e.target.value) }}></input></Dropdown.Item>
                  </DropdownButton>
                }
              </div>
              <label style={{ display: 'block', width: '100%' }}>
                <span style={{ marginRight: '8px' }}>Date</span>
                <DatePicker
                  selected={props.selectedDate}
                  onChange={(startDate) => setStartDate(startDate)}
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
                <Dropdown.Item onClick={(e) => setRRuleObj({ ...rRuleObj, FREQ: 'WEEKLY' })}>Weekly on {daySelected}</Dropdown.Item>
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
                <input style={{ display: 'inline-block', width: 'auto', marginRight: '10px' }} onChange={() => setAllDay(!allDay)} type="checkbox" defaultChecked />
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
              variant="primary">Save changes</Button>
            {props.selectedEvent?.id &&
              <Button
                onClick={(e) => deleteItem(e, props.selectedEvent.id)}
              >
                Delete
              </Button>
            }
          </Modal.Footer>
        </form>
      </Modal.Dialog>
    </div >
  )
}

export default AddEvent;