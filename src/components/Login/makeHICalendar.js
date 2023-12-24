import { gapi } from 'gapi-script';

const makeHICalendar = async () => {
  console.log('calling GAPI to insert the HI calendar');
  return gapi.client.calendar.calendars.insert({
    summary: 'Home School Island',
    description: 'Home School Island is a calendar to keep track of your classes and home school events. It stores preferences for Home School Island in a single (ancient) event.'
  }).then(function (response) {
    console.log('HI calendar created', response);
    return response.result;
  })
}

export default makeHICalendar;