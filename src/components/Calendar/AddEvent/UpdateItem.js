// external libraries
import { gapi } from 'gapi-script';
import Button from 'react-bootstrap/Button';

function UpdateItem(props) {
  console.log('UpdateItem', { props })
  const updateItem = async (e, id) => {
    e.preventDefault();

    if (props.text === 'Today and All Future Events') {
      const endDateTime = new Date(props.selectedEvent.activeDate);
      endDateTime.setDate(endDateTime.getDate() - 1);
      console.log({ endDateTime })
      const updatedSelectedEvent = { ...props.selectedEvent, end: { ...props.selectedEvent.end } };

      // update endDate
      if (!props.allDay) {
        updatedSelectedEvent.end.dateTime = endDateTime.toISOString();
      } else {
        updatedSelectedEvent['end']['date'] = endDateTime.toISOString().substring(0, 10);
      }

      try {
        await gapi.client.calendar.events.update({
          'calendarId': props.hICalendar.id,
          'eventId': id,
          'resource': updatedSelectedEvent
        })
        console.log('event successfully updated');
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