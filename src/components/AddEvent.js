import { useCallback, useState } from 'react';
import './addEvent.scss';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import TimePicker from 'react-time-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

function AddEvent(props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [eventType, setEventType] = useState('Select Event Type');
  const [subject, setSubject] = useState('Subject');
  const [time, setTime] = useState();
  const [repeats, setRepeats] = useState(false);
  const [repeatFrequency, setRepeatFrequency] = useState('How Often');
  const [dayOfWeek, setDayOfWeek] = useState('');

  console.log({ repeats })
  console.log('Add event', props);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ name, description, eventType, subject })
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
                </DropdownButton>
              }
            </div>

            <div className='flex'>
              <input style={{ display: 'inline-block', width: 'auto', marginRight: '10px' }} onClick={() => setRepeats(!repeats)} type="checkbox" />
              <label>
                repeats
              </label>
            </div>

            {repeats &&
              <DropdownButton title={repeatFrequency}>
                <Dropdown.Item onClick={(e) => setSubject(e.target.textContent)}>Daily</Dropdown.Item>
                <Dropdown.Item onClick={(e) => setSubject(e.target.textContent)}>Weekly on {props.dateSelected}</Dropdown.Item>
                <Dropdown.Item onClick={(e) => setSubject(e.target.textContent)}>Monthly</Dropdown.Item>
                <Dropdown.Item onClick={(e) => setSubject(e.target.textContent)}>History</Dropdown.Item>
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

              <TimePicker
                disableClock
                onChange={setTime}
                value={time}
              />
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