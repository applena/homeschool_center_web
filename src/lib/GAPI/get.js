import { gapi } from 'gapi-script';

export const get = async (id) => await gapi.client.calendar.events.list({ calendarId: id });

export default get;