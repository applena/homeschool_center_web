import { gapi } from 'gapi-script';

export const instances = async (calendarId, eventId) => await gapi.client.calendar.events.instances({ calendarId, eventId });

export default instances;