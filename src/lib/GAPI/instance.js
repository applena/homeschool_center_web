import { gapi } from 'gapi-script';

export const instance = async (calendarId, eventId) => await gapi.client.calendar.events.instances({ calendarId, eventId });

export default instance;