import { useState, useCallback, useEffect } from 'react';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import TimePicker from 'react-time-picker';
import Modal from 'react-bootstrap/Modal';
import DatePicker from "react-datepicker";
import Button from 'react-bootstrap/Button';
import './addEvent.scss';

// redux
import { setHICalendarConfig } from '../../../redux/config';
import { useSelector, useDispatch } from 'react-redux';

// global variables
const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

function AddEditModal(props) {
  console.log('AddEditModal', { props })
  // from redux
  const dispatch = useDispatch();
  const config = useSelector((state) => state.config);

  // state
  const [eventType, setEventType] = useState('Select Event Type');
  const [subject, setSubject] = useState(config.subjectList[0]);
  const [newSubject, setNewSubject] = useState(''); // TODO: make a new subject option
  const [description, setDescription] = useState(!props.newEvent ? props.selectedEvent?.description.description : '');
  const [startDate, setStartDate] = useState(!props.newEvent ? props.selectedEvent.dateStart : props.selectedDate);
  const [startTime, setStartTime] = useState(!props.newEvent ? props.selectedEvent.dateStart : '');
  const [endTime, setEndTime] = useState(!props.newEvent ? props.selectedEvent.dateEnd : '');
  const [daySelected, setDaySelected] = useState(''); // used to display the day of week that a user seleced
  const [ordinalsOfMonth, setOrdinalsOfMonth] = useState('');
  const [ordinalIndex, setOrdinalIndex] = useState(-1);
  const [month, setMonth] = useState(''); // used to display the month user selected
  const [day, setDay] = useState(''); // used to display the day of the month (ie - 28th)
  const [name, setName] = useState(!props.newEvent ? props.selectedEvent.summary : '');
  const [allDay, setAllDay] = useState(!props.newEvent ? props.selectedEvent.allDay : true);
  const [displayDeleteOptions, setDisplayDeleteOptions] = useState(false);

  console.log('AddEditModal - after state', { startDate }, props.selectedEvent)

  // REPEATING RULES
  const [rRuleObj, setRRuleObj] = useState({
    FREQ: 'HowOften',
    BYDAY: 'Day Of Week',
  });

  // booliean reveals repeating options
  const [repeats, setRepeats] = useState(false);

  const metaData = {
    description,
    subject
  };

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

    let dateString = startDate.toDateString();

    // dateString = 'Wed Aug 09 2023 00:00:00 GMT-0700 (Pacific Daylight Time)'
    let tokens = dateString.split(' ');

    // finds the number for the ordinal - ie: 1, 2, 3, 4, or 5
    const ordinalIndex = Math.ceil(tokens[2] / 7);
    setOrdinalIndex(ordinalIndex);
    const ordinalString = ordinals[ordinalIndex];
    // console.log({ ordinalString })
    const dayOfWeek = dayOfWeekString[tokens[0]];
    setOrdinalsOfMonth("the " + ordinalString + " " + dayOfWeek + " of the month");

    //find and set the day of the week
    let newStart = dateString.slice(0, 3);
    const dayOWeek = dayOfWeekString[newStart];
    setDaySelected(dayOWeek);

    //find and set the Month selected
    let monthIndex = startDate.getMonth();
    const getMonthByIndex = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'November', 'December'];
    setMonth(getMonthByIndex[monthIndex]);

    //set the day selected
    setDay(startDate.getDate());

  }, [props.selectedDate, startDate]);

  return (
    <div>
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
                  <input value={props.newSubject} name="Create a New Subject" onChange={(e) => {
                    e.stopPropagation();
                    props.setNewSubject(e.target.value)
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
              selected={new Date(startDate.toUTCString())}
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
        <div className='delete-options'>
          <Button onClick={() => { props.setSelectedDate(false); props.setSelectedEvent(false) }} variant="secondary">Close</Button>
          <Button
            onClick={(e) => props.handleSubmit(e, { allDay, startDate, startTime, endTime, event, repeats, rRuleObj, ordinalIndex, ordinalsOfMonth })}
            variant="primary">Save Changes</Button>
          {props.selectedEvent?.recurrence?.length ?
            <Button
              onClick={() => setDisplayDeleteOptions(true)}
            >
              Delete
            </Button>
            :
            <Button
              onClick={props.deleteEvent}
            >
              Delete Event
            </Button>
          }
        </div>
        {displayDeleteOptions &&
          <div className='delete-options'>
            <Button
              onClick={props.deleteFutureEvent}
            >
              Delete This And All Future Events
            </Button><Button
              onClick={props.deleteEvent}
            >
              Delete All Events
            </Button>
            <Button
              onClick={props.deleteSingleEvent}
            >
              Delete This Event
            </Button>
          </div>
        }
      </Modal.Footer>
    </div>
  )
}

export default AddEditModal;