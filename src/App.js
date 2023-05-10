import { useState } from 'react';
import './app.scss';

// pages
// import CollectStudentInfo from './components/CollectStudentInfo';
import Header from './components/Header';
import Login from './components/Login/Login';
import SignUp from './components/SignUp';
import Features from './components/Features';
import Plans from './components/Plans';
import Resources from './components/Resources';
import PrivacyPolicy from './docs/privacyPolicy';
import TOS from './docs/TOS';

// libs
import { Route, Routes } from "react-router-dom";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from "moment";
import { useSelector } from 'react-redux';
// import GoogleAPICalendar from 'google-calendar-react';
// import Calendar from 'react-big-calendar';


moment.locale("en-GB");
const localizer = momentLocalizer(moment);

function App() {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState(0);

  const [displayLogin, setDisplayLogin] = useState(false);
  const [displaySignUp, setDisplaySignUp] = useState(false);

  const isSignedIn = useSelector((state) => state.signInStatus.value);

  const [eventsData, setEventsData] = useState([]);

  const handleSelect = ({ start, end }) => {
    console.log(start);
    console.log(end);
    const title = window.prompt("New Event name");
    if (title)
      setEventsData([
        ...eventsData,
        {
          start,
          end,
          title
        }
      ]);
  };

  return (
    <div className="App">
      <Header
        setDisplayLogin={(value) => setDisplayLogin(value)}
        setDisplaySignUp={(value) => setDisplaySignUp(value)}
      />

      <Routes>
        <Route exact path="features" element={<Features />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/tos" element={<TOS />} />
      </Routes>

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



      {/* <CollectStudentInfo
        updateName={(value) => setName(value)}
        updateGrade={(value) => setGrade(value)}
      /> */}
    </div>
  );
}

export default App;
