import React, { useState } from "react";

import moment from "moment-timezone";

import FiberManualRecordIcon from "./svg/fiberManualRecord";

import Tooltip from "./tooltip";

import { Manager, Reference } from 'react-popper';

function Event(props) {
  const [showTooltip, setShowTooltip] = useState(false);

  const closeTooltip = () => {
    setShowTooltip(false);
  }

  const toggleTooltip = () => {
    console.log('toggle tool tip', showTooltip);
    setShowTooltip(!showTooltip);
  }

  return (
    <div
      className="event"
      tabIndex="0"
      onBlur={closeTooltip}
    >
      <div className="reference"
        onClick={toggleTooltip}
      >
        <div
          className="event-text">
          <span className="event-text-span" style={{ color: props.color }}>
            <FiberManualRecordIcon fill="currentColor" fontSize="inherit" width="100%" />
          </span>
          <span>
            {moment(props.startTime).format("h:mma ")}
          </span>
          <span style={{ fontWeight: "500" }}>
            {props.name}
          </span>
        </div>
      </div>
    </div>
  )
}

Event.defaultProps = {
  color: '#4786ff'
}

export default Event;
