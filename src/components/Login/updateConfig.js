import { gapi } from 'gapi-script';

const updateConfig = async (hICalendarID, eventId, config) => {
  // create the event that we will use to store our preferences
  const configObj = {
    calendarId: hICalendarID,
    eventId,
    resource: {
      description: JSON.stringify(config),
      start: {
        date: '2017-01-01'
      },
      end: {
        date: '2017-01-01'
      }
    }
  }

  return gapi.client.calendar.events.update(configObj
  ).then(function (response) {
    console.log('config made', response);
    configObj.id = response.result.id;
    return configObj;
  });
}

export default updateConfig;