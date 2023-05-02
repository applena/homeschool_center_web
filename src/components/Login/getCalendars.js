import { gapi } from 'gapi-script';

const _ = require('lodash');

const getCalendars = async (callback) => {
  gapi.client.calendar.calendarList.list().then(function (response) {
    // alphabetize and store in app data
    let calendarList = _.sortBy(response.result.items, item => item.summaryOverride || item.summary);
    console.log('calendars fetched', calendarList);
    // ensure we have a MyQ calendar
    // require('./get.myq.calendar.js')();
    // answer the call:
    callback(calendarList);
  });
};

export default getCalendars;