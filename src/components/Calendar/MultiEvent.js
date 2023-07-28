
import React from "react";

import moment from "moment-timezone";

import { isAllDay, pSBC } from "../../lib/utils/helper";


function MultiEvent(props) {
  // console.log('muliEvent', { props })

  return (
    <div
      className="event-big"
      tabIndex="0"
      style={{ width: `calc(${props.length}00% + ${props.length - 1}px)` }}
      onClick={(e) => props.editEvent(e, props.id)}
    >


      <div style={{
        width: `calc(100% - ${8 * (props.arrowLeft + props.arrowRight)}px)`,
        borderRadius: '3px',
        background: props.color,
        border: `1px solid ${pSBC(-0.2, props.color)}`
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
