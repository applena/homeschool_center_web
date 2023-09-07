
// external libraries
import Button from 'react-bootstrap/Button';

// my libraries
import gapi from '../../../lib/GAPI';

// redux
import { removeEvent } from '../../../redux/eventsSlice';
import { useDispatch } from 'react-redux';

const DeleteItem = (props) => {
  const dispatch = useDispatch();

  console.log('DelteItem', props.selectedEvent)

  const deleteItem = async (e, id) => {
    props.setDeleteRepeatingItem(false);
    e.preventDefault();
    try {
      dispatch(removeEvent(id));
      console.log('DeleteItem', props.hICalendar.id, id, Object.keys(gapi))
      await gapi.remove(props.hICalendar.id, id);

      props.setSelectedDate(false);
      props.setSelectedEvent(false);
      console.log('sucessfully deleted')
    } catch (e) {
      console.log('something went wrong with delete', e.message);
    }
  }

  return (
    <Button
      onClick={(e) => deleteItem(e, props.selectedEvent.id)}
    >
      {props.text}
    </Button>
  )
}

export default DeleteItem;