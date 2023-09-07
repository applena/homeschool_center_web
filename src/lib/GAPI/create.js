import { gapi } from 'gapi-script';

export const insert = async (calendarId, event) => await gapi.client.calendar.events.insert({
  'calendarId': calendarId,
  'resource': event
});

export default insert;