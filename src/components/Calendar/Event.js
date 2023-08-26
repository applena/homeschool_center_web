import React, { useState } from "react";

import moment from "moment-timezone";

// import FiberManualRecordIcon from "./svg/fiberManualRecord";


function Event(props) {
  // const [showTooltip, setShowTooltip] = useState(false);
  console.log('EVENT', props)

  return (
    <div
      className="event"
      tabIndex="0"
      onClick={(e) => props.editEvent(e, props.id)}
    >

      <span className="event-text-span" style={{ color: props.color }}>
        &bull;
      </span>
      <span>
        {moment(props.startTime).format("h:mma ").replace(':00', '')}
      </span>
      <span style={{ fontWeight: "500" }}>
        {props.name}
      </span>


    </div>
  )
}

Event.defaultProps = {
  color: '#4786ff'
}

export default Event;
