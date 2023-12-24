import { gapi } from "gapi-script";

export const deleteCalendar = async (calendarId) => {
  console.log(gapi.client);
  await gapi.client.calendar.calendars.delete({ calendarId });
};
export default deleteCalendar;
