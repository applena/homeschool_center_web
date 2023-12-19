import React from 'react';
import Button from 'react-bootstrap/Button';
import GAPI from '../../../lib/GAPI';

function DeleteEvent(props) {
  const deleteEvent = (calendarId, eventId) => {
    GAPI.remove(calendarId, eventId);
  }

  return (
    <div>
      <Button onClick={() => deleteEvent(props.calendarId, props.eventId)}>Delete Event</Button>
    </div>
  )
}

export default DeleteEvent;