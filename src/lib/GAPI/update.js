import { gapi } from 'gapi-script';

export const update = async (calendarId, eventId, updatedEvent) => await gapi.client.calendar.events.update({
  'calendarId': calendarId,
  'eventId': eventId,
  'resource': updatedEvent
})

export default update;