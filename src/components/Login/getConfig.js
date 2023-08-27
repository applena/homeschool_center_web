import { gapi } from 'gapi-script';

const getConfig = async (hiCalendarId) => {
  console.log('getting the config', hiCalendarId)
  return gapi.client.calendar.events.list({
    'calendarId': hiCalendarId,
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 1,
    'orderBy': 'startTime'
  }).then(function (response) {
    if (!response.result.items.length) return false;
    const configEvent = response.result.items[0];
    console.log('got the config', configEvent)
    const configObj = JSON.parse(configEvent.description);
    configObj.id = configEvent.id;
    configObj.calendarId = hiCalendarId;
    return configObj;
    // if (app.configEvent.description) {
    //   app.config = JSON.parse(app.configEvent.description);
    // }
    // // app.$watch('config', function (newVal, oldVal) {
    // //   console.log('config changed: saving: ', newVal, oldVal);
    // //   saveConfig();
    // // })
    // console.log('config', app.config);
    // callback();
  });
};

export default getConfig;
