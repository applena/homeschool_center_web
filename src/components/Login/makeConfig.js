import { gapi } from 'gapi-script';

const makeConfig = async (hICalendarID) => {
  // create the event that we will use to store our preferences
  const configObj = {
    portfolio: {},
    transcript: {},
    calendarId: hICalendarID,
    subjectList: ['MATH', 'ELA', 'SCIENCE', 'HISTORY']
  }

  const eventObj = {
    calendarId: hICalendarID,
    text: 'config',
    description: JSON.stringify(configObj),
    start: {
      date: '2017-01-01'
    },
    end: {
      date: '2017-01-01'
    }
  }
  return gapi.client.calendar.events.insert(eventObj
  ).then(function (response) {
    console.log('config made', response);
    configObj.id = response.results.items[0];
    return configObj;
  });
}

export default makeConfig;