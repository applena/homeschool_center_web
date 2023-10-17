import { useCallback, useEffect, useState } from 'react';
import './addEvent.scss';
import AddEditModal from './AddEditModal';

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
  // from redux
  const dispatch = useDispatch();
  const hICalendar = useSelector((state) => state.hICalendar);

  const handleSubmit = async (e, obj) => {
    // add start and end date/time
    console.log('AddEvent - handleSubit', { obj })
    if (!obj.allDay) {
      console.log('not all day event', obj.startTime)
      let startDateTime = new Date(obj.startDate);
      startDateTime.setHours(obj.startTime.split(':')[0], obj.startTime.split(':')[1]);

      let endDateTime = new Date(obj.startDate);
      endDateTime.setHours(obj.endTime.split(':')[0], obj.endTime.split(':')[1]);

      obj.event['start']['dateTime'] = startDateTime;
      obj.event['end']['dateTime'] = endDateTime;
    } else {
      console.log('all day event', obj.startDate)
      //"start": {"date": "2015-06-01"}
      const endDate = new Date(obj.startDate)
      endDate.setDate(endDate.getDate() + 1);
      obj.event['start']['date'] = obj.startDate.toISOString().substring(0, 10);
      obj.event['end']['date'] = endDate.toISOString().substring(0, 10);
    }

    // add recurrence
    if (obj.repeats) {
      // const rule = new RRule({
      //   freq: RRule.WEEKLY,
      //   interval: 5,
      //   byweekday: [RRule.MO, RRule.FR],
      //   dtstart: datetime(2012, 2, 1, 10, 30),
      //   until: datetime(2012, 12, 31)
      // })
      // console.log('selected event recurrance', props.selectedEvent?.recurrence)
      let recurrence = [];
      if (!['How Often'].includes(obj.rRuleObj.FREQ)) {
        if (obj.rRuleObj.FREQ === 'MONTHLY') {
          recurrence.push(`RRULE:FREQ=${obj.rRuleObj.FREQ};BYDAY=${obj.ordinalIndex}${obj.ordinalsOfMonth.split(' ')[2].substring(0, 2).toUpperCase()}`)
        } else if (obj.rRuleObj.FREQ === 'Weekdays') {
          recurrence.push(`RRULE:FREQ=DAILY`);
        } else {
          recurrence.push(`RRULE:FREQ=${obj.rRuleObj.FREQ}`);
        }
      }

      if (obj.rRuleObj.BYDAY !== 'Day Of Week' && obj.rRuleObj.FREQ !== 'MONTHLY') {
        recurrence.push(`BYDAY=${obj.rRuleObj.BYDAY}`);
      }

      console.log('final', { recurrence })
      obj.event['recurrence'] = [recurrence.join(';')];
    }

    let createdEvent = {};
    console.log('event', obj.event);

    try {
      const response = await gapi.create(hICalendar.id, obj.event);
      createdEvent = response.result;
      dispatch(addEvent(createdEvent));
      props.setSelectedDate(false);
      props.setSelectedEvent(false);

      console.log('event added successfully');
    } catch {
      console.log('problem adding event');
    }
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