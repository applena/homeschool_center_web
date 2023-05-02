import React, { useEffect, useState, useCallback } from 'react';
import { GoogleLogin } from '@react-oauth/google';

import { useSelector, useDispatch } from 'react-redux';
import { signIn, setHICalendarObj, setHICalendarConfig } from '../../redux/signInStatus';
import { gapi } from 'gapi-script';

import getCalendars from './getCalendars';
import getConfig from './getConfig';
import makeConfig from './makeConfig';
import makeHICalendar from './makeHICalendar';

// Array of API discovery doc URLs for APIs
const DISCOVERY_DOCS = [
  'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'
]

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/calendar';



function Login(props) {
  const [credentialResponse, setCredentialResponse] = useState({});
  const isSignedIn = useSelector((state) => state.signInStatus.value);
  const hICalendarObj = useSelector((state) => state.hiCalendar);
  const config = useSelector((state) => state.config);
  console.log('LOGIN', isSignedIn);
  const dispatch = useDispatch();

  // const [documents, setDocuments] = useState([]);
  /**
   * Print the summary and start datetime/date of the next ten events in
   * the authorized user's calendar. If no events are found an
   * appropriate message is printed.
   */
  const listUpcomingEvents = useCallback(async () => {

    // look for a calendar named homeschool island
    // if it doesn't exist
    // create it 
    // create a configuration event for sometime in the past

    // let response;

    // const request = {
    //   'calendarId': 'primary',
    //   'timeMin': (new Date()).toISOString(),
    //   'showDeleted': false,
    //   'singleEvents': true,
    //   'maxResults': 10,
    //   'orderBy': 'startTime',
    // };
    // response = await gapi.client.calendar.events.list(request);

    // console.log({ response });
    // if (!response?.result?.items) return;


    // const events = response.result.items;
    // if (!events || events.length === 0) {
    //   document.getElementById('content').innerText = 'No events found.';
    //   return;
    // }
    // // Flatten to string to display
    // const output = events.reduce(
    //   (str, event) => `${str}${event.summary} (${event.start.dateTime || event.start.date})\n`,
    //   'Events:\n');
    // document.getElementById('content').innerText = output;
  }, [])

  const setUpHICalendar = async (calendarList) => {
    // get the hi calendar
    let hICalendar = calendarList.find((cal) => cal.summary === 'Home School Island')

    // if no hi calendar, make it
    if (!hICalendar) {
      console.log('no hi calendar found - making it');
      // make HI calendar and save to redux
      hICalendar = await makeHICalendar();
      console.log('made hi calendar', { hICalendar });
      dispatch(setHICalendarObj(hICalendar));
    }

    // get the configEvent
    const configEvent = await getConfig(hICalendar.id);

    // if no configEvent, make it
    if (!configEvent) {
      console.log('no config event found - making it');
      // make config object and save to redux
      const newConfig = await makeConfig(hICalendar.id, config);
      dispatch(setHICalendarConfig(newConfig));
    }
  }

  useEffect(() => {
    if (!isSignedIn) return;
    gapi.load('client', async () => {
      await gapi.client.init({
        clientId: process.env.REACT_APP_GOOGLE_DRIVE_CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
      });
      getCalendars(function (calendarList) {
        setUpHICalendar(calendarList)
      });
      listUpcomingEvents();
    });

    // getCalendars(function () {
    //   // getConfig(function () {
    //   //   getEvents(function (events) {
    //   //     createQueue(events);
    //   //   })
    //   // });
    // })

  }, [isSignedIn, listUpcomingEvents])


  return (
    <div id="login">
      {!isSignedIn &&

        <GoogleLogin
          onSuccess={credentialResponse => {
            console.log(credentialResponse);
            dispatch(signIn(true));
            setCredentialResponse(credentialResponse);
          }}
          auto_select
          onError={() => {
            console.log('Login Failed');
            dispatch(signIn(false));
          }}
          useOneTap
        />

      }

      {/* {documents.map((doc) => (
        <div>doc</div>
      ))} */}

    </div>
  )
}

export default Login;
