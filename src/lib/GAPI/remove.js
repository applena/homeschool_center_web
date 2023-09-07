import { gapi } from 'gapi-script';

export const remove = async (calendarId, eventId) => await gapi.client.calendar.events.delete({
  'calendarId': calendarId,
  'eventId': eventId
})

export default remove;