import { useCallback, useEffect, useState } from 'react';
import './addEvent.scss';
import AddEditModal from './AddEditModal';
import createEvent from './createEvent';

// external libraries
import Modal from 'react-bootstrap/Modal';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-clock/dist/Clock.css';
import "react-datepicker/dist/react-datepicker.css";

// my libraries
import gapi from '../../../lib/GAPI';

// redux
import { useSelector, useDispatch } from 'react-redux';
import { addEvent } from '../../../redux/eventsSlice';

function AddEvent(props) {
  console.log('AddEvent', { props })
  // from redux
  const dispatch = useDispatch();
  const hICalendar = useSelector((state) => state.hICalendar);

  const handleSubmit = async (e, obj) => {
    console.log('handleSubmit', { obj });
    const createdEvent = await createEvent({ obj, hICalendar });
    dispatch(addEvent(createdEvent));
    props.setSelectedDate(false);
    // props.setSelectedEvent(false);
  }

  return (
    <div
      className="modal show"
      style={{ display: 'block', position: 'initial' }}
    >
      <Modal.Dialog>
        <Modal.Header onHide={() => { props.setSelectedDate(false) }} closeButton>
          <Modal.Title>Add Event</Modal.Title>
        </Modal.Header>

        <form>
          <AddEditModal
            selectedDate={props.selectedDate}
            newEvent={true}
            setSelectedDate={props.setSelectedDate}
            handleSubmit={handleSubmit}
          />
        </form>
      </Modal.Dialog>
    </div >
  )
}

export default AddEvent;