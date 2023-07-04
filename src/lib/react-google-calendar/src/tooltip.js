
import React from "react";
import PropTypes from "prop-types";

import moment from "moment-timezone";

import { Popper } from 'react-popper';

import { isAllDay, getCalendarURL } from "./utils/helper";

import Place from "./svg/place";
import Subject from "./svg/subject";
import CalendarToday from "./svg/calendarToday";

export default class Tooltip extends React.Component {
  constructor(props) {
    super(props);
    let allDay = isAllDay(this.props.startTime, this.props.endTime);

    this.state = {
      timeDisplay: Tooltip.getTimeDisplay(this.props.startTime, this.props.endTime, allDay),
      eventURL: getCalendarURL(this.props.startTime, this.props.endTime, this.props.name, this.props.description, this.props.location, allDay),
    }

  }

  static getTimeDisplay(startTime, endTime, allDay) {
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

  render() {
    let description;
    if (this.props.description) {
      description = <div className="details description">
        <div style={{ paddingRight: "10px" }}><Subject fill="currentColor" /></div>
        <div style={{ overflowWrap: "break-word", maxWidth: "calc(100% - 28px)" }}
          onMouseDown={e => { if (e.target.nodeName === 'A') { e.preventDefault() } }}
          dangerouslySetInnerHTML={{ __html: this.props.description }} />
      </div>;
    } else {
      description = <div></div>;
    }

    let location;
    if (this.props.location) {
      location = <div className="details location">
        <div style={{ paddingRight: "10px", display: "flex", alignItems: "center" }}><Place fill="currentColor" /></div>
        <div style={{ overflowWrap: "break-word", maxWidth: "calc(100% - 28px)" }}>{this.props.location}</div>
      </div>;
    } else {
      location = <div></div>;
    }

    let calendarName;
    if (this.props.calendarName) {
      calendarName = <div className="details calendarName">
        <div style={{ paddingRight: "10px", display: "flex", alignItems: "center" }}><CalendarToday fill="currentColor" /></div>
        <div>{this.props.calendarName}</div>
      </div>;
    } else {
      calendarName = <div></div>;
    }

    return (
      <Popper modifiers={[{ name: 'preventOverflow', options: { altAxis: true } }]}>
        {({ ref, style, placement, arrowProps }) => (
          <div
            className="tooltip"
            ref={ref}
            data-placement={placement}
            style={{ ...style, visibility: this.props.showTooltip ? "visible" : "hidden" }}
          >
            <div style={{
              position: "relative",
            }}>
              <div className="tooltip-div"
                onClick={this.props.closeTooltip}
              >
                &times;
              </div>
              <h2 className="tooltip-text" style={{ marginTop: "0px", paddingTop: "18.675px" }}>{this.props.name}</h2>
              <p className="display-linebreak">
                {this.state.timeDisplay}
              </p>
              {description}
              {location}
              {calendarName}
              <a
                href={this.state.eventURL}
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
