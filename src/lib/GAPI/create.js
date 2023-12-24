import { gapi } from 'gapi-script';

export const insert = async (calendarId, event) => {
  console.log('calling GAPI to insert calendar event', { event })
  const response = await gapi.client.calendar.events.insert({
    'calendarId': calendarId,
    'resource': event
  })
  console.log('adding event to googlel cal', { calendarId, event, response })
  return response;
};

export default insert;