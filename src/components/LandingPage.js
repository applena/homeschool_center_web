import Calendar from "./Calendar/Calendar";
import { useSelector } from "react-redux";

function LandingPage(props) {
  const eventsData = useSelector((state) => state.events);

  console.log("landing page,", props.isSignedIn, eventsData.length);

  return (
    <div id="landing-page">
      {props.isSignedIn && <Calendar events={eventsData} />}
    </div>
  );
}

export default LandingPage;
