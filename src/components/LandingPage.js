import Calendar from './Calendar/Calendar';
import { useSelector, useDispatch } from 'react-redux';

function LandingPage(props) {
  const eventsData = useSelector((state) => state.events);
  const hICalendar = useSelector((state) => state.hICalendar)

  return (
    <div id="landing-page">
      {props.isSignedIn && eventsData.length &&
        <Calendar
          events={eventsData}
          summary={hICalendar.summary}
          color={hICalendar.backgroundColor}
        />
      }
    </div>
  )
}

export default LandingPage;