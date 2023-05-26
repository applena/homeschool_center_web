import { useCallback, useState } from 'react';
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

// libs
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from "moment";
import { useSelector, useDispatch } from 'react-redux';
import LandingPage from './components/LandingPage';
import Modal from 'react-modal';

// Modal.setAppElement(App);

moment.locale("en-GB");
const localizer = momentLocalizer(moment);

function App() {
  const [displayAddEvent, setDisplayAddEvent] = useState(false);
  // const [name, setName] = useState('');
  // const [grade, setGrade] = useState(0);

  // const [displayLogin, setDisplayLogin] = useState(false);
  // const [displaySignUp, setDisplaySignUp] = useState(false);


  const isSignedIn = useSelector((state) => state.signInStatus.signedIn);
  const eventsData = useSelector((state) => state.events);

  // const [eventsData, setEventsData] = useState([]);

  const handleSelect = useCallback(({ start, end }) => {
    // console.log(start);
    // console.log(end);

    setDisplayAddEvent(true);
    console.log('display add event', displayAddEvent)

    // const title = window.prompt("New Event name");
    // if (title)
    //   setEventsData([
    //     ...eventsData,
    //     {
    //       start,
    //       end,
    //       title
    //     }
    //   ]);
  }, [displayAddEvent]);

  console.log('App', { displayAddEvent });

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

      {isSignedIn &&
        <Calendar
          views={["day", "agenda", "month"]}
          selectable
          localizer={localizer}
          defaultDate={new Date()}
          defaultView="month"
          events={eventsData}
          style={{ height: "100vh" }}
          onSelectEvent={(event) => alert(event.title)}
          onSelectSlot={handleSelect}
        />
      }

      {displayAddEvent &&
        <AddEvent
          displayAddEvent={displayAddEvent}
          setDisplayAddEvent={() => setDisplayAddEvent(false)}
        />
      }
    </div>
  );
}

export default App;
