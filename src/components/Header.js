import React, { useCallback, useEffect } from 'react';
import './header.scss';
import HSCLogo from '../assets/logo.png';
// import { BrowserRouter as Link } from "react-router-dom";
import { GoogleLogin, hasGrantedAllScopesGoogle } from '@react-oauth/google';
import { useSelector, useDispatch } from 'react-redux';
import { credentialResponse, signIn } from '../redux/signInStatus';
import getConfig from './Login/getConfig';
import makeConfig from './Login/makeConfig';
import makeHICalendar from './Login/makeHICalendar';
import { setHICalendarObj } from '../redux/hICalendar';
import { setHICalendarConfig } from '../redux/config';
import { setEvents } from '../redux/eventsSlice';
import { gapi } from 'gapi-script';
const _ = require('lodash');


// Array of API discovery doc URLs for APIs
const DISCOVERY_DOCS = [
  'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'
]

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/calendar';

function Header(props) {
  const credentials = useSelector((state) => state.signInStatus.credentialResponse);
  const isSignedIn = useSelector((state) => state.signInStatus.signedIn);
  const hICalendar = useSelector((state) => state.hICalendar);

  const dispatch = useDispatch();

  console.log({ hICalendar });
  // const [documents, setDocuments] = useState([]);

  /**
   * Print the summary and start datetime/date of the next ten events in
   * the authorized user's calendar. If no events are found an
   * appropriate message is printed.
   */

  const setUpHICalendar = useCallback(async (calendarList) => {
    // console.log('in setUpHICalendar', { calendarList });

    // get the hi calendar
    let hICalendar = calendarList.find((cal) => cal.summary === 'Home School Island')

    // if no hi calendar, make it
    if (!hICalendar) {
      console.log('no hi calendar found - making it');
      // make HI calendar and save to redux
      hICalendar = await makeHICalendar();
      console.log('made hi calendar', { hICalendar });
    } else {
      console.log('hICalendar found', { hICalendar })
    }
    dispatch(setHICalendarObj(hICalendar));

    if (!hICalendar.id) {
      return;
    }
    const events = await gapi.client.calendar.events.list({ calendarId: hICalendar.id })

    console.log({ events })
    dispatch(setEvents(events.result.items));

    // get the configEvent
    let configObject = await getConfig(hICalendar.id);

    // if no configEvent, make it
    if (!configObject) {
      console.log('no config event found - making it');
      // make config object and save to redux
      configObject = await makeConfig(hICalendar.id);
    }
    dispatch(setHICalendarConfig(configObject));
  }, [dispatch])

  const getCalendars = useCallback(() => {
    gapi.client.calendar.calendarList.list().then(function (response) {
      // alphabetize and store in app data
      let calendarList = _.sortBy(response.result.items, item => item.summaryOverride || item.summary);
      console.log('calendars fetched', calendarList);
      // ensure we have a MyQ calendar
      // require('./get.myq.calendar.js')();
      // answer the call:
      setUpHICalendar(calendarList);
    });
  }, [setUpHICalendar]);

  useEffect(() => {

    if (!credentials || isSignedIn) return;

    gapi.load('client', async () => {
      console.log(`gapi client loaded`);
      await gapi.client.init({
        clientId: process.env.REACT_APP_GOOGLE_DRIVE_CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
      });

      console.log(`gapi client getting tokenClient...`);
      let tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: process.env.REACT_APP_GOOGLE_DRIVE_CLIENT_ID,
        scope: SCOPES,
        callback: tokenResponse => {
          console.log({ tokenResponse });
          const isSignedIn = window.google.accounts.oauth2.hasGrantedAllScopes(tokenResponse, SCOPES)
          console.log(`gapi hasGrantedAllScopesGoogle`, { SCOPES, isSignedIn, tokenClient });

          if (!isSignedIn) {
            // prompts the user for calendar access
            console.log(`callback gapi client requestAccessToken`);
            tokenClient.requestAccessToken();
            return;
          }
          dispatch(signIn(true));
          getCalendars();
        },
      });


      const isSignedIn = hasGrantedAllScopesGoogle(
        credentials,
        SCOPES,
      );
      dispatch(signIn(isSignedIn));
      console.log({ isSignedIn, credentials });
      if (!isSignedIn) {
        // prompts the user for calendar access
        console.log(`gapi client requestAccessToken`);
        tokenClient.requestAccessToken();
        return;
      }

    });

    // getCalendars(function () {
    //   // getConfig(function () {
    //   //   getEvents(function (events) {
    //   //     createQueue(events);
    //   //   })
    //   // });
    // })

  }, [getCalendars, isSignedIn, dispatch, credentials])

  console.log('Header Render', { credentials, isSignedIn });
  return (
    <div id="header">
      <img alt="homeschool center name" src={HSCLogo} />
      {/* <nav>
        <ul>
          <li>
            <Link to="/features">Features</Link>
          </li>
          <li>
            <Link to="/resources">Resources</Link>
          </li>
          <li>
            <Link to="/plans">Plans</Link>
          </li>
        </ul>
      </nav> */}
      {!isSignedIn &&

        <GoogleLogin
          onSuccess={response => {
            console.log('GoogleLogin onSuccess', response);
            dispatch(credentialResponse(response));
          }}
          flow="implicit"
          auto_select
          onError={() => {
            console.log('Login Failed');
            dispatch(credentialResponse(false));
          }}
          useOneTap
        />

      }

    </div>
  )
}

export default Header;