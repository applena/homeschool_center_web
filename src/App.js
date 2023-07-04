import { useCallback, useEffect, useState } from 'react';
import './app.scss';

// pages
// import CollectStudentInfo from './components/CollectStudentInfo';
import Header from './components/Header';
import Features from './components/Features';
import Plans from './components/Plans';
import Resources from './components/Resources';
import PrivacyPolicy from './docs/privacyPolicy';
import TOS from './docs/TOS';
import AddEvent from './components/AddEvent';
import './components/Calendar/calendar.scss';

// libs
import { Route, Routes, BrowserRouter } from "react-router-dom";
// import { Calendar, momentLocalizer } from 'react-big-calendar';
// import 'react-big-calendar/lib/css/react-big-calendar.css';
// import moment from "moment";
import Calendar from "./lib/react-google-calendar/src";
import { useSelector, useDispatch } from 'react-redux';
import LandingPage from './components/LandingPage';

// moment.locale("en-GB");
// const localizer = momentLocalizer(moment);

function App() {
  const [displayAddEvent, setDisplayAddEvent] = useState(false);
  const [daySelected, setDaySelected] = useState('');
  const [dateSelected, setDateSelected] = useState(new Date());
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [ordinalsOfMonth, setOrdinalsOfMonth] = useState('');


  const isSignedIn = useSelector((state) => state.signInStatus.signedIn);
  const eventsData = useSelector((state) => state.events);
  const hICalendar = useSelector((state) => state.hICalendar)

  // console.log({ eventsData })

  // console.log({ API_KEY, calendars })

  // const [eventsData, setEventsData] = useState([]);

  const handleSelect = useCallback(({ start, end }) => {

    setDateSelected(start);

    //find and set the ordinals - ex: 'thrid thursday of the month'
    const ordinals = ["", "first", "second", "third", "fourth", "fifth"];
    let date = start + '';
    let tokens = date.split(/[ ,]/);
    const dayOfWeek = getTheDayOfWeek(tokens[0]);
    setOrdinalsOfMonth("the " + ordinals[Math.ceil(tokens[2] / 7)] + " " + dayOfWeek + " of the month");

    //find and set the day of the week
    let newStart = start + '';
    newStart = newStart.slice(0, 3);
    const dayOWeek = getTheDayOfWeek(newStart);
    setDaySelected(dayOWeek);

    //find and set the Month selected
    let monthIndex = start.getMonth()
    switch (monthIndex) {
      case 0:
        setMonth('January');
        break;
      case 1:
        setMonth('February');
        break;
      case 2:
        setMonth('March');
        break;
      case 3:
        setMonth('April');
        break;
      case 4:
        setMonth('May');
        break;
      case 5:
        setMonth('June');
        break;
      case 6:
        setMonth('July');
        break;
      case 7:
        setMonth('August');
        break;
      case 8:
        setMonth('September');
        break;
      case 9:
        setMonth('October');
        break;
      case 10:
        setMonth('November');
        break;
      case 11:
        setMonth('December');
        break;
      default:
        setMonth('');
    }

    //set the day selected
    setDay(start.getDate());

    setDisplayAddEvent(true);
  }, []);

  const getTheDayOfWeek = (abrivation) => {
    switch (abrivation) {
      case 'Mon':
        return 'Monday';
      case 'Tue':
        return 'Tuesday';
      case 'Wed':
        return 'Wednesdday';
      case 'Thu':
        return 'Thursday';
      case 'Fri':
        return 'Friday';
      case 'Sat':
        return 'Saturday';
      case 'Sun':
        return ('Sunday');
      default:
        return ('');
    }
  }

  console.log('App', { displayAddEvent, eventsData });

  return (
    <div className="App">
      <Header />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/features" element={<Features />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/tos" element={<TOS />} />
        </Routes>
      </BrowserRouter>

      {isSignedIn && eventsData.length &&
        // <Calendar
        //   views={["day", "agenda", "month"]}
        //   selectable
        //   localizer={localizer}
        //   defaultDate={new Date()}
        //   defaultView="month"
        //   events={eventsData}
        //   style={{ height: "100vh" }}
        //   onSelectEvent={(event) => alert(event.title)}
        //   onSelectSlot={handleSelect}
        // />

        <Calendar
          events={eventsData}
          summary={hICalendar.summary}
          color={hICalendar.backgroundColor}
        />
      }

      {displayAddEvent &&
        <AddEvent
          displayAddEvent={displayAddEvent}
          daySelected={daySelected}
          dateSelected={dateSelected}
          month={month}
          day={day}
          ordinal={ordinalsOfMonth}
          setDisplayAddEvent={() => setDisplayAddEvent(false)}
        />
      }
    </div>
  );
}

export default App;
