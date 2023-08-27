import { gapi } from 'gapi-script';

const makeConfig = async (hICalendarID) => {
  // create the event that we will use to store our preferences
  const configObj = {
    calendarId: hICalendarID,
    text: 'config',
    description: JSON.stringify({
      portfolio: {},
      transcript: {},
      subjectList: ['MATH', 'ELA', 'SCIENCE', 'HISTORY']
    }),
    start: {
      date: '2017-01-01'
    },
    end: {
      date: '2017-01-01'
    }
  }
  return gapi.client.calendar.events.insert(configObj
  ).then(function (response) {
    console.log('config made', response);
    return configObj;
  });
}

export default makeConfig;