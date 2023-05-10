import React, { useEffect, useState, useCallback } from 'react';
import { GoogleLogin, hasGrantedAllScopesGoogle } from '@react-oauth/google';

import { useSelector, useDispatch } from 'react-redux';
import { signIn } from '../../redux/signInStatus';
import { setHICalendarObj } from '../../redux/hICalendar';
import { setHICalendarConfig } from '../../redux/config';
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
  // const [credentialResponse, setCredentialResponse] = useState({});
  const isSignedIn = useSelector((state) => state.signInStatus.value);
  console.log('LOGIN', isSignedIn);
  const dispatch = useDispatch();
  const [clientIsLoaded, setClientIsLoaded] = useState(false);

  // const [documents, setDocuments] = useState([]);
  /**
   * Print the summary and start datetime/date of the next ten events in
   * the authorized user's calendar. If no events are found an
   * appropriate message is printed.
   */
  const listUpcomingEvents = useCallback(async () => {
  }, [])

  const setUpHICalendar = useCallback(async (calendarList) => {
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
    let configEvent = await getConfig(hICalendar.id);

    // if no configEvent, make it
    if (!configEvent) {
      console.log('no config event found - making it');
      // make config object and save to redux
      configEvent = await makeConfig(hICalendar.id);
      dispatch(setHICalendarConfig(configEvent));
    }
  }, [dispatch])

  // const authorizeCalendarAccess = async () => {

  // }

  useEffect(() => {
    if (!isSignedIn) return;
    if (clientIsLoaded) return;

    gapi.load('client', async () => {
      await gapi.client.init({
        clientId: process.env.REACT_APP_GOOGLE_DRIVE_CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
      });
      setClientIsLoaded(true);
      let tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: process.env.REACT_APP_GOOGLE_DRIVE_CLIENT_ID,
        scope: SCOPES,
        callback: '', // defined later
      });

      // prompts the user for calendar access
      tokenClient.requestAccessToken({ prompt: 'consent' });

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

  }, [isSignedIn, listUpcomingEvents, setUpHICalendar, clientIsLoaded])


  return (
    <div id="login">
      {!isSignedIn &&

        <GoogleLogin
          onSuccess={credentialResponse => {
            console.log(credentialResponse);
            dispatch(signIn(true));
            // setCredentialResponse(credentialResponse);
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
