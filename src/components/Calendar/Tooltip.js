
import React from "react";
import PropTypes from "prop-types";

import moment from "moment-timezone";

import { Popper } from 'react-popper';

import { isAllDay, getCalendarURL } from "../../lib/utils/helper";

import Place from "./svg/place";
import Subject from "./svg/subject";
import CalendarToday from "./svg/calendarToday";

function Tooltip(props) {

  const getTimeDisplay = (startTime, endTime, allDay) => {
    if (allDay) {
      let endDate = moment(endTime).subtract(1, "day");

      if (endDate.isSame(startTime, "day")) {
        return startTime.format("dddd, MMMM Do");
      } else {
        return startTime.format("MMM Do, YYYY") + " - " + endDate.format("MMM Do, YYYY");
      }
    } else {
      if (endTime.isSame(startTime, "day")) {
        return startTime.format("dddd, MMMM Do") + "\n"
          + startTime.format("h:mma") + " - " + endTime.format("h:mma");
      } else {
        return startTime.format("MMM Do, YYYY, h:mma") + " -\n" + endTime.format("MMM Do, YYYY, h:mma");
      }
    }
  }

  return (
    <Popper modifiers={[{ name: 'preventOverflow', options: { altAxis: true } }]}>
      {({ ref, style, placement }) => (
        <div
          className="tooltip"
          ref={ref}
          data-placement={placement}
          style={{ ...style, visibility: props.showTooltip ? "visible" : "hidden" }}
        >
          <div style={{
            position: "relative",
          }}>
            <div className="tooltip-div"
              onClick={props.closeTooltip}
            >
              &times;
            </div>
            <h2 className="tooltip-text" style={{ marginTop: "0px", paddingTop: "18.675px" }}>{props.name}</h2>
            <p className="display-linebreak">
              {getTimeDisplay(props.startTime, props.endTime, isAllDay(props.startTime, props.endTime))}
            </p>

            {props.description ?
              <div className="details description">
                <div style={{ paddingRight: "10px" }}>
                  <Subject fill="currentColor" />
                </div>
                <div
                  style={{ overflowWrap: "break-word", maxWidth: "calc(100% - 28px)" }}
                  onMouseDown={e => { if (e.target.nodeName === 'A') { e.preventDefault() } }}
                />
                {props.description}
              </div>
              :
              <div></div>
            }

            {props.location ?
              <div className="details location">
                <div style={{ paddingRight: "10px", display: "flex", alignItems: "center" }}>
                  <Place fill="currentColor" />
                </div>
                <div style={{ overflowWrap: "break-word", maxWidth: "calc(100% - 28px)" }}>{props.location}</div>
              </div>
              :
              <div></div>
            }

            {props.calendarName ?
              <div className="details calendarName">
                <div style={{ paddingRight: "10px", display: "flex", alignItems: "center" }}>
                  <CalendarToday fill="currentColor" />
                </div>
                <div>{props.calendarName}</div>
              </div>
              :
              <div></div>
            }
            <a
              href={getCalendarURL(props.startTime, props.endTime, props.name, props.description, props.location, isAllDay(props.startTime, props.endTime))}
              target="_blank"
              rel="noreferrer"
              onMouseDown={e => e.preventDefault()}
              style={{
                fontSize: "13px",
                tabIndex: -1
              }}
            >
              Copy to Calendar
            </a>
          </div>
        </div>
      )}
    </Popper>

  );
}

Tooltip.propTypes = {
  showTooltip: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  startTime: PropTypes.instanceOf(moment),
  endTime: PropTypes.instanceOf(moment),
  description: PropTypes.string,
  location: PropTypes.string,
  calendarName: PropTypes.string,
  closeTooltip: PropTypes.func.isRequired,
}

export default Tooltip;
