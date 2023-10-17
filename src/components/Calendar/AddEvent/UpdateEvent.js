import AddEditModal from './AddEditModal';

// external libraries
import Modal from 'react-bootstrap/Modal';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-clock/dist/Clock.css';
import "react-datepicker/dist/react-datepicker.css";
import Button from 'react-bootstrap/Button';

// my libraries
import gapi from '../../../lib/GAPI';

// redux
import { useSelector, useDispatch } from 'react-redux';
import { setEvents, modifyEvent, removeEvent } from '../../../redux/eventsSlice';

function UpdateItem(props) {
  // console.log('UpdateItem', { props })
  const dispatch = useDispatch();
  const hICalendar = useSelector((state) => state.hICalendar);
  const events = useSelector((state) => state.events);

  const deleteEvent = () => {
    props.setSelectedEvent(false);
    dispatch(removeEvent(props.selectedEvent.id));
    try {
      gapi.remove(hICalendar.id, props.selectedEvent.id);
      console.log('sucessfully removed event');
    } catch {
      console.log('error removing event');
    }
  }

  const handleSubmit = async (e, obj) => {
    e.preventDefault();

    console.log('UpdateEvent - handleSubmit', { obj });

    props.setSelectedEvent(false);

    if (props.text === 'Today and All Future Events') {
      const yesterday = new Date(props.selectedEvent.activeDate);
      yesterday.setDate(yesterday.getDate() - 1);

      const until = yesterday.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
      // console.log({ until, yesterday });

      const updatedSelectedEvent = { ...props.selectedEvent };

      updatedSelectedEvent.recurrence = [updatedSelectedEvent.recurrence[0].replace(/;UNTIL=.+Z/, '') + `;UNTIL=${until}`];
      console.log('UpdateEvent', { updatedSelectedEvent })

      try {
        await gapi.update(props.hICalendar.id, obj.id, updatedSelectedEvent);
        // await gapi.client.calendar.events.update({
        //   'calendarId': props.hICalendar.id,
        //   'eventId': id,
        //   'resource': updatedSelectedEvent
        // })
        console.log('event successfully updated');

        // find the event and replace it with updatedSelectedEvent
        events.forEach(event => {
          if (event.id === props.selectedEvent.id) {
            event = updatedSelectedEvent
          }
          dispatch(setEvents(events));
        })

        // const events = await gapi.client.calendar.events.list({ calendarId: hICalendar.id })
        // console.log({ events });
        props.setSelectedDate(false);
        props.setSelectedEvent(false);

      } catch {
        console.log('problem updating event');
      }

    }

    if (props.text === 'Save Changes') {

      try {
        console.log('update event', props.event)
        const response = await gapi.update(hICalendar.id, props.selectedEvent.id, props.event);
        console.log('response from gapi', { response });
        const updatedEvent = response.result;
        dispatch(modifyEvent(updatedEvent));
        props.setSelectedDate(false);
        props.setSelectedEvent(false);
        console.log('event successfully updated');
      } catch {
        console.log('problem updating event');
      }
    }

    if (props.text === 'Just Today') {
      console.log('just today')
      try {
        // const response = await gapi.getOne(hICalendar.id, props.selectedEvent?.id)
        const instance = await gapi.instances(hICalendar.id, props.selectedEvent?.id);

        // console.log('just today', { instance }, instance.result.item, props.selectedEvent.activeDate)

        const specificEvent = instance.result.items.find(item => {
          const itemDate = new Date(item.dateStart);
          const offset = itemDate.getTimezoneOffset();
          itemDate.setMinutes(itemDate.getMinutes() + offset);
          console.log(itemDate.getTime(), props.selectedEvent.activeDate.getTime(), itemDate.toISOString())
          return itemDate.getTime() === props.selectedEvent?.activeDate.getTime();
        });

        console.log('remove just today', specificEvent)

        try {
          const response = await gapi.remove(props.hICalendar.id, specificEvent.id);
          console.log('successfully removed event', { response });
          dispatch(setEvents([...events, { recurringEventId: props.selectedEvent.id, originalStartTime: { ...specificEvent.start }, status: 'cancelled' }]));

        } catch (e) {
          console.log('problem removing event', e.message)
        }
        // find the specific event in the redux's events and remove it
        // update redux with the removed event

      } catch (e) {
        console.log('error remove just today event', e.message);
      }
      // events.instances() 
    }
  }
  return (
    <div
      className="modal show"
      style={{ display: 'block', position: 'initial' }}
    >
      <Modal.Dialog>
        <Modal.Header onHide={() => { props.setSelectedDate(false); props.setSelectedEvent(false) }} closeButton>
          <Modal.Title>Update Event</Modal.Title>
        </Modal.Header>

        <form>
          <AddEditModal
            selectedDate={props.selectedDate}
            newEvent={false}
            setSelectedDate={props.setSelectedDate}
            handleSubmit={handleSubmit}
            selectedEvent={props.selectedEvent}
          />
        </form>
        <Button
          onClick={deleteEvent}
        >
          Delete Event
        </Button>
      </Modal.Dialog>
    </div >
  )
}

export default UpdateItem;