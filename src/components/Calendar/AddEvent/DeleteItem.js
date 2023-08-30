
// external libraries
import { gapi } from 'gapi-script';
import Button from 'react-bootstrap/Button';

// redux
import { removeEvent } from '../../../redux/eventsSlice';
import { useDispatch } from 'react-redux';

const DeleteItem = (props) => {
  const dispatch = useDispatch();

  const deleteItem = async (e, id) => {
    props.setDeleteRepeatingItem(false);
    e.preventDefault();
    try {
      dispatch(removeEvent(id));
      await gapi.client.calendar.events.delete({
        'calendarId': props.hICalendar.id,
        'eventId': id
      });
      props.setSelectedDate(false);
      props.setSelectedEvent(false);
      console.log('sucessfully deleted')
    } catch {
      console.log('something went wrong with delete');
    }
  }

  return (
    <Button
      onClick={(e) => deleteItem(e, props.selectedEvent.id)}
    >
      Delete
    </Button>
  )
}

export default DeleteItem;