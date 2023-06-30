import { useCallback, useEffect, useState } from 'react';
import './addEvent.scss';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import TimePicker from 'react-time-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { gapi } from 'gapi-script';

function AddEvent(props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [eventType, setEventType] = useState('Select Event Type');
  const [subject, setSubject] = useState('Subject');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [repeats, setRepeats] = useState(false);
  const [repeatFrequency, setRepeatFrequency] = useState('How Often');
  const [newSubject, setNewSubject] = useState('');
  const [repeateNumberFrequency, setRepeatNumberFrequency] = useState(0);
  const [repeatsOn, setRepeatsOn] = useState('Day Of Week');
  const [endsOn, setEndsOn] = useState('never');
  const [endDate, setEndDate] = useState('');
  const [afterOccurance, setAfterOccurance] = useState('0 Occurances');
  const [startDate, setStartDate] = useState(props.dateSelected);
  const [allDay, setAllDay] = useState(false);
  const [repeatTimeFrame, setRepeatTimeFrame] = useState('How Often');

  // props.daySelected = 'Friday'
  // props.dateSelected = Sat Jun 10 2023 00:00:00 GMT-0700 (Pacific Daylight Time)
  // name = 'algebra'
  // description = 'a class on algebra'
  // subject = 'math'
  // startTime = '13:00'
  // repeats = true
  // repeatsFrequency = 'Daily'
  // props.day = 10
  // props.month = 'June'


  // console.log({ newSubject }, props.dateSelected)
  // console.log('Add event', props);
  // console.log('startDate', startDate.toISOString().substring(0, 10))

  const handleSubmit = (e) => {
    e.preventDefault();

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
      let startDateTime = new Date(startDate);
      startDateTime.setHours(startTime.split(':')[0], startTime.split(':')[1]);

      console.log('!!!', new Date(startDate.setHours('13', '15')))

      let endDateTime = new Date(startDate);
      endDateTime.setHours(endTime.split(':')[0], endTime.split(':')[1]);

      event['start']['dateTime'] = startDateTime;
      event['end']['dateTime'] = endDateTime;
    } else {
      //"start": {"date": "2015-06-01"}
      event['start']['date'] = startDate.toISOString().substring(0, 10);
      event['end']['date'] = startDate.toISOString().substring(0, 10);
    }

    // add recurrence
    if (repeats) {
      let recurrence = [];
      if (!['How Often', 'Custom'].includes(repeatFrequency)) {
        recurrence.push(`RRULE:FREQ=${repeatFrequency}`);
        console.log('pushing repeatFrequency', { repeatFrequency })
      }

      if (repeatTimeFrame !== 'How Often') {
        recurrence.push(`COUNT=${repeateNumberFrequency}`);
        console.log('pushing repeatNumberFrequency', { repeatTimeFrame, repeateNumberFrequency })
      }

      if (repeatsOn !== 'Day Of Week') {
        recurrence.push(`BYDAY=${repeatsOn}`);
        console.log('pushing repeatsOn', { repeatsOn })
      }

      if (endsOn === 'After') {
        recurrence.push(`COUNT=${afterOccurance}`);
        console.log('pushing endsOn', { endsOn, afterOccurance })
      }

      // if repeatFrequency is 'Custom'

      recurrence.join(';');

      // console.log({ recurrence })

      event['recurrence'] = recurrence;
    }

    console.log({ event });


    const request = gapi.client.calendar.events.insert({
      'calendarId': 'primary', // TODO: update to HI calendar ID
      'resource': event
    });

    request.execute(function (event) {
      console.log('Event created: ' + event.htmlLink);
    });

    // console.log({ event })
  }


  return (
    <div
      className="modal show"
      style={{ display: 'block', position: 'initial' }}
    >
      <Modal.Dialog>
        <Modal.Header onHide={() => props.setDisplayAddEvent(false)} closeButton>
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
                  selected={startDate === props.dateSelected ? props.dateSelected : startDate}
                  onChange={(startDate) => setStartDate(startDate)}
                />
              </label>

            </div>

            {repeatFrequency === 'Custom' &&
              <Modal.Body>
                <h2>Custom recurrence</h2>
                <div className="flex" style={{ alignItems: 'center' }}>Repeat every
                  <DropdownButton title={repeateNumberFrequency}>
                    <Dropdown.Item onClick={(e) => setRepeatNumberFrequency(e.target.textContent)}>1</Dropdown.Item>
                    <Dropdown.Item onClick={(e) => setRepeatNumberFrequency(e.target.textContent)}>2</Dropdown.Item>
                    <Dropdown.Item onClick={(e) => setRepeatNumberFrequency(e.target.textContent)}>3</Dropdown.Item>
                    <Dropdown.Item onClick={(e) => setRepeatNumberFrequency(e.target.textContent)}>4</Dropdown.Item>
                    <Dropdown.Item onClick={(e) => setRepeatNumberFrequency(e.target.textContent)}>5</Dropdown.Item>
                    <Dropdown.Item onClick={(e) => setRepeatNumberFrequency(e.target.textContent)}>6</Dropdown.Item>
                    <Dropdown.Item onClick={(e) => setRepeatNumberFrequency(e.target.textContent)}>7</Dropdown.Item>
                    <Dropdown.Item onClick={(e) => setRepeatNumberFrequency(e.target.textContent)}>8</Dropdown.Item>
                    <Dropdown.Item onClick={(e) => setRepeatNumberFrequency(e.target.textContent)}>9</Dropdown.Item>
                    <Dropdown.Item onClick={(e) => setRepeatNumberFrequency(e.target.textContent)}>10</Dropdown.Item>
                  </DropdownButton>

                  <DropdownButton title={repeatTimeFrame}>
                    <Dropdown.Item onClick={(e) => setRepeatTimeFrame('DAILY')}>Days</Dropdown.Item>
                    <Dropdown.Item onClick={(e) => setRepeatTimeFrame('WEEKLY')}>Weeks</Dropdown.Item>
                    <Dropdown.Item onClick={(e) => setRepeatTimeFrame('MONTHLY')}>Months</Dropdown.Item>
                    <Dropdown.Item onClick={(e) => setRepeatTimeFrame('YEARLY')}>Years</Dropdown.Item>
                  </DropdownButton>
                </div>
                <div className="flex" style={{ textAlign: 'left', alignItems: 'center' }}>Repeats on
                  <DropdownButton title={repeatsOn}>
                    <Dropdown.Item onClick={(e) => setRepeatsOn(e.target.textContent.substring(0, 2).toUpperCase())}>
                      Monday
                    </Dropdown.Item>
                    <Dropdown.Item onClick={(e) => setRepeatsOn(e.target.textContent.substring(0, 2).toUpperCase())}>
                      Tuesday
                    </Dropdown.Item>
                    <Dropdown.Item onClick={(e) => setRepeatsOn(e.target.textContent.substring(0, 2).toUpperCase())}>
                      Wednesday
                    </Dropdown.Item>
                    <Dropdown.Item onClick={(e) => setRepeatsOn(e.target.textContent.substring(0, 2).toUpperCase())}>
                      Thursday
                    </Dropdown.Item>
                    <Dropdown.Item onClick={(e) => setRepeatsOn(e.target.textContent.substring(0, 2).toUpperCase())}>
                      Friday
                    </Dropdown.Item>
                    <Dropdown.Item onClick={(e) => setRepeatsOn(e.target.textContent.substring(0, 2).toUpperCase())}>
                      Saturday
                    </Dropdown.Item>
                    <Dropdown.Item onClick={(e) => setRepeatsOn(e.target.textContent.substring(0, 2).toUpperCase())}>
                      Sunday
                    </Dropdown.Item>
                  </DropdownButton>
                </div>

                <div className='flex' style={{ alignItems: 'center' }}>
                  Ends
                  <DropdownButton title={endsOn}>
                    <Dropdown.Item onClick={(e) => setEndsOn(e.target.textContent)}>
                      never
                    </Dropdown.Item>
                    <Dropdown.Item onClick={(e) => setEndsOn(e.target.textContent)}>
                      On
                    </Dropdown.Item>
                    <Dropdown.Item onClick={(e) => setEndsOn(e.target.textContent)}>
                      After
                    </Dropdown.Item>
                  </DropdownButton>
                </div>

                {endsOn === 'On' &&
                  <Modal.Body>
                    <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
                  </Modal.Body>
                }

                {endsOn === 'After' &&
                  <Modal.Body>
                    <DropdownButton title={afterOccurance}>
                      <Dropdown.Item onClick={(e) => setAfterOccurance(1)}>
                        1 Occurances
                      </Dropdown.Item>
                      <Dropdown.Item onClick={(e) => setAfterOccurance(2)}>
                        2 Occurances
                      </Dropdown.Item>
                      <Dropdown.Item onClick={(e) => setAfterOccurance(3)}>
                        3 Occurances
                      </Dropdown.Item>
                      <Dropdown.Item onClick={(e) => setAfterOccurance(4)}>
                        4 Occurances
                      </Dropdown.Item>
                      <Dropdown.Item onClick={(e) => setAfterOccurance(5)}>
                        5 Occurances
                      </Dropdown.Item>
                      <Dropdown.Item onClick={(e) => setAfterOccurance(6)}>
                        6 Occurances
                      </Dropdown.Item>
                      <Dropdown.Item onClick={(e) => setAfterOccurance(7)}>
                        7 Occurances
                      </Dropdown.Item>
                      <Dropdown.Item onClick={(e) => setAfterOccurance(8)}>
                        8 Occurances
                      </Dropdown.Item>
                      <Dropdown.Item onClick={(e) => setAfterOccurance(9)}>
                        9 Occurances
                      </Dropdown.Item>
                      <Dropdown.Item onClick={(e) => setAfterOccurance(10)}>
                        10 Occurances
                      </Dropdown.Item>
                    </DropdownButton>
                  </Modal.Body>
                }

              </Modal.Body>
            }

            <div className='flex'>
              <input style={{ display: 'inline-block', width: 'auto', marginRight: '10px' }} onClick={() => setRepeats(!repeats)} type="checkbox" />
              <label>
                repeats
              </label>
            </div>

            {repeats &&
              <DropdownButton title={repeatFrequency}>
                <Dropdown.Item onClick={(e) => setRepeatFrequency('DAILY')}>Daily</Dropdown.Item>
                <Dropdown.Item onClick={(e) => setRepeatFrequency('WEEKLY')}>Weekly on {props.daySelected}</Dropdown.Item>
                <Dropdown.Item onClick={(e) => setRepeatFrequency('MONTHLY')}>Monthly on {props.ordinal}</Dropdown.Item>
                <Dropdown.Item onClick={(e) => setRepeatFrequency('YEARLY')}>Annually on {props.month} {props.day}</Dropdown.Item>
                <Dropdown.Item onClick={(e) => setRepeatFrequency('MO, TU, WE, TH, FR')}>Every weekday (Monday to Friday)</Dropdown.Item>
                <Dropdown.Item onClick={(e) => setRepeatFrequency(e.target.textContent)}>Custom</Dropdown.Item>
              </DropdownButton>
            }

            <div className='flex flexCol'>
              <label>
                Name:
                <input
                  onChange={(e) => setName(e.target.value)}
                  type="text" name="name" />
              </label>

              <label>
                Description:
                <input
                  onChange={(e) => setDescription(e.target.value)}
                  type="text" name="description" />
              </label>

              <div className='flex'>
                <input style={{ display: 'inline-block', width: 'auto', marginRight: '10px' }} onClick={() => setAllDay(!allDay)} type="checkbox" />
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
            <Button onClick={() => props.setDisplayAddEvent(false)} variant="secondary">Close</Button>
            <Button
              onClick={(e) => handleSubmit(e)}
              variant="primary">Save changes</Button>
          </Modal.Footer>
        </form>
      </Modal.Dialog>
    </div>
  )
}

export default AddEvent;