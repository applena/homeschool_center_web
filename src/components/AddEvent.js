import { useCallback, useState } from 'react';
// import Modal from 'react-modal';
import './addEvent.scss';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function AddEvent(props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [eventType, setEventType] = useState('Select Event Type');
  const [subject, setSubject] = useState('Subject');

  console.log({ subject })

  // let subtitle;
  console.log('Add event', props);
  // const afterOpenModal = useCallback(() => {
  //   // references are now sync'd and can be accessed.
  //   subtitle.style.color = '#f00';
  // }, [])

  const updateInput = (e, field) => {
    // console.log(e.target.value)
    switch (field) {
      case 'name':
        setName(e.target.value);
        break;
      case 'description':
        setDescription(e.target.value);
        break;
      default:
        return 'foo';
    }
  }

  // function afterOpenModal() {
  //   // references are now sync'd and can be accessed.
  //   subtitle.style.color = '#f00';
  // }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ name, description })
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

        <Modal.Body>
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

        </Modal.Body>

        <Modal.Footer>
          <Button onClick={() => props.setDisplayAddEvent(false)} variant="secondary">Close</Button>
          <Button variant="primary">Save changes</Button>
        </Modal.Footer>
      </Modal.Dialog>
    </div>
  )
}

export default AddEvent;