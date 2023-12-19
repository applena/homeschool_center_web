import GAPI from '../../lib/GAPI';

function removeAllEvents(calendarId, events) {
  if (!events.length) return;
  events.forEach(e => {
    if (e.status === 'cancelled') return;
    GAPI.remove(calendarId, e.id);
  })
}

export default removeAllEvents;