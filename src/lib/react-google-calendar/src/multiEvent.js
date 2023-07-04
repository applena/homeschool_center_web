
import React, { useState } from "react";

import moment from "moment-timezone";

import Tooltip from "./tooltip";

import { isAllDay, pSBC } from "./utils/helper";

import { Manager, Reference } from 'react-popper';

function MultiEvent(props) {

  const [showTooltip, setShowTooltip] = useState(false);

  const closeTooltip = () => {
    setShowTooltip(false);
  }

  const toggleTooltip = () => {
    setShowTooltip(!showTooltip);
  }

  return (
    <div
      className="event-big"
      tabIndex="0"
      onBlur={closeTooltip}
      style={{ width: `calc(${props.length}00% + ${props.length - 1}px)` }}
    >
      <Manager>
        <Reference>
          {({ ref }) => (
            <div style={{
              width: `calc(100% - ${8 * (props.arrowLeft + props.arrowRight)}px)`,
              borderRadius: '3px',
              background: `${props.color}`,
              '&:hover': {
                background: pSBC(-0.35, props.color),
              }
            }}

              onClick={toggleTooltip}
              ref={ref}
            >
              <div
                className="event-text-one"
                style={{
                  marginLeft: props.arrowLeft ? '2px' : '5px',
                  marginRight: props.arrowRight ? '0px' : '5px',
                }}
              >
                {
                  isAllDay(moment(props.startTime), moment(props.endTime)) ? "" : moment(props.startTime).format("h:mma ")
                }
                <span style={{ fontWeight: "500" }}>
                  {props.name}
                </span>
              </div>
            </div>
          )}

        </Reference>
        <Tooltip
          name={props.name}
          startTime={moment(props.startTime)}
          endTime={moment(props.endTime)}
          description={props.description}
          location={props.location}
          tooltipStyles={props.tooltipStyles}
          showTooltip={showTooltip}
          closeTooltip={closeTooltip}
          calendarName={props.calendarName}
        />
      </Manager>
    </div>
  )
}


MultiEvent.defaultProps = {
  length: 1,
  arrowLeft: false,
  arrowRight: false,
}

export default MultiEvent;
