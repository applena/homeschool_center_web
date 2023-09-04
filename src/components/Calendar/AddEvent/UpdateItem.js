// external libraries
import { gapi } from 'gapi-script';
import Button from 'react-bootstrap/Button';

// redux
import { useSelector, useDispatch } from 'react-redux';
import { setEvents } from '../../../redux/eventsSlice';
import { setHICalendarConfig } from '../../../redux/config';

function UpdateItem(props) {
  // console.log('UpdateItem', { props })
  const dispatch = useDispatch();
  const hICalendar = useSelector((state) => state.hICalendar);

  const updateItem = async (e, id) => {
    e.preventDefault();

    if (props.text === 'Today and All Future Events') {
      const yesterday = new Date(props.selectedEvent.activeDate);
      yesterday.setDate(yesterday.getDate() - 1);

      const until = yesterday.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
      // console.log({ until, yesterday });

      const updatedSelectedEvent = { ...props.selectedEvent };

      delete updatedSelectedEvent.activeDate;

      // console.log('UpdateItem', { updatedSelectedEvent })

      updatedSelectedEvent.recurrence = [updatedSelectedEvent.recurrence[0].replace(/;UNTIL=.+Z/, '') + `;UNTIL=${until}`];
      console.log('UpdateEvent', { updatedSelectedEvent })

      try {
        await gapi.client.calendar.events.update({
          'calendarId': props.hICalendar.id,
          'eventId': id,
          'resource': updatedSelectedEvent
        })
        console.log('event successfully updated');

        const events = await gapi.client.calendar.events.list({ calendarId: hICalendar.id })
        // console.log({ events });
        dispatch(setEvents(events.result.items));
        props.setSelectedDate(false);
        props.setSelectedEvent(false);

      } catch {
        console.log('problem updating event');
      }

    }

    if (props.text === 'Just Today') {
      // delete today
    }
  }
  return (
    <Button
      onClick={(e) => updateItem(e, props?.selectedEvent?.id, 'future')}
    >
      {props.text}
    </Button>
  )
}

export default UpdateItem;