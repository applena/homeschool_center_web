import { gapi } from 'gapi-script';

const makeHICalendar = async () => {
  console.log('calling GAPI to insert the HI calendar');
  return gapi.client.calendar.calendars.insert({
    summary: 'Home School Island',
    description: 'Home School Island is a calendar to keep track of your classes and home school events. It stores preferences for Home School Island in a single (ancient) event.'
  }).then (async function (response) {
    console.log('HI calendar created', response);
    const calendar = await gapi.client.calendar.calendars.get(response.result.id);
    console.log('is this the real calendar', {calendar})
    return response.result;
  })
}

export default makeHICalendar;