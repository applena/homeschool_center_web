import { gapi } from 'gapi-script';
import defalutConfig from '../../config/default';

const makeConfig = async (hICalendarID) => {
  // create the event that we will use to store our preferences
  console.log('makeConfig', hICalendarID)
  const configObj = {
    ...defalutConfig,
    calendarId: hICalendarID
  }

  const eventObj = {
    summary: 'hiConfig',
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

  console.log('makeConfig', { eventObj });
  console.log('calling GAPI to insert event', { eventObj });
  return gapi.client.calendar.events.insert(eventObj
  ).then(function (response) {
    // console.log('config made', response);
    configObj.id = response.results?.items[0].id || response.result.id;
    return configObj;
  });
}

export default makeConfig;