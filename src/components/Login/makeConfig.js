import { gapi } from 'gapi-script';

const makeConfig = async (hICalendarID) => {
  // create the event that we will use to store our preferences
  return gapi.client.calendar.events.insert({
    calendarId: hICalendarID,
    text: 'config',
    description: JSON.stringify({
      portfolio: {},
      transcript: {}
    }),
    start: {
      date: '2017-01-01'
    },
    end: {
      date: '2017-01-01'
    }
  }).then(function (response) {
    console.log('config made', response);
    return response;
  });
}

export default makeConfig;