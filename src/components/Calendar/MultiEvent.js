
import React from "react";

import moment from "moment-timezone";


import { isAllDay, pSBC } from "../../lib/utils/helper";


function MultiEvent(props) {

  return (
    <div
      className="event-big"
      tabIndex="0"
      style={{ width: `calc(${props.length}00% + ${props.length - 1}px)` }}
    >


      <div style={{
        width: `calc(100% - ${8 * (props.arrowLeft + props.arrowRight)}px)`,
        borderRadius: '3px',
        background: `${props.color}`,
        '&:hover': {
          background: pSBC(-0.35, props.color),
        }
      }}
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


    </div>
  )
}


MultiEvent.defaultProps = {
  length: 1,
  arrowLeft: false,
  arrowRight: false,
}

export default MultiEvent;
