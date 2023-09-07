import { gapi } from 'gapi-script';

export const getOne = async (calendarId, eventId) => await gapi.client.calendar.events.get({ calendarId, eventId });

export default getOne;