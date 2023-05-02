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
    return response.result.items[0];
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
