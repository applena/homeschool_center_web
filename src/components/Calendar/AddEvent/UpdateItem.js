// external libraries
import { gapi } from 'gapi-script';
import Button from 'react-bootstrap/Button';

function UpdateItem(props) {
  console.log('UpdateItem', { props })
  const updateItem = async (e, id) => {
    e.preventDefault();

    if (props.text === 'Today and All Future Events') {
      const yesterday = new Date(props.selectedEvent.activeDate);
      yesterday.setDate(yesterday.getDate() - 1);

      const until = yesterday.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
      console.log({ until });

      const updatedSelectedEvent = { ...props.selectedEvent };

      delete updatedSelectedEvent.activeDate;

      updatedSelectedEvent.recurrence = [updatedSelectedEvent.recurrence[0].replace(/;UNTIL=.+Z/) + `;UNTIL=${until}`];
      console.log('UpdateEvent', { updatedSelectedEvent })

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