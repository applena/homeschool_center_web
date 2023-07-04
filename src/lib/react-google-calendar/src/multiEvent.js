
import React from "react";

import moment from "moment-timezone";

import Tooltip from "./tooltip";

import { isAllDay, pSBC } from "./utils/helper";

import { Manager, Reference } from 'react-popper';

export default class MultiEvent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      startTime: moment(this.props.startTime),
      endTime: moment(this.props.endTime),
      color: this.props.color,
      darkColor: pSBC(-0.35, this.props.color),

      showTooltip: false,
    }

    this.state.allDay = isAllDay(this.state.startTime, this.state.endTime);

    this.toggleTooltip = this.toggleTooltip.bind(this);
    this.closeTooltip = this.closeTooltip.bind(this);
  }

  closeTooltip() {
    this.setState({ showTooltip: false });
  }

  toggleTooltip() {
    this.setState({ showTooltip: !this.state.showTooltip });
  }

  render() {
    return (
      <div
        className="event-big"
        tabIndex="0"
        onBlur={this.closeTooltip}
        style={{ width: `calc(${this.props.length}00% + ${this.props.length - 1}px)` }}
      >
        <Manager>
          <Reference>
            {({ ref }) => (
              <div style={{
                width: `calc(100% - ${8 * (this.props.arrowLeft + this.props.arrowRight)}px)`,
                borderRadius: '3px',
                background: `${this.state.color}`,
                '&:hover': {
                  background: this.state.darkColor,
                }
              }}

                onClick={this.toggleTooltip}
                ref={ref}
              >
                <div
                  className="event-text-one"
                  style={{
                    marginLeft: this.props.arrowLeft ? '2px' : '5px',
                    marginRight: this.props.arrowRight ? '0px' : '5px',
                  }}
                >
                  {
                    this.state.allDay ? "" : this.state.startTime.format("h:mma ")
                  }
                  <span style={{ fontWeight: "500" }}>
                    {this.props.name}
                  </span>
                </div>
              </div>
            )}

          </Reference>
          <Tooltip
            name={this.props.name}
            startTime={moment(this.props.startTime)}
            endTime={moment(this.props.endTime)}
            description={this.props.description}
            location={this.props.location}
            tooltipStyles={this.props.tooltipStyles}
            showTooltip={this.state.showTooltip}
            closeTooltip={this.closeTooltip}
            calendarName={this.props.calendarName}
          />
        </Manager>
      </div>
    )
  }
}


MultiEvent.defaultProps = {
  color: '#4786ff',
  length: 1,
  arrowLeft: false,
  arrowRight: false,
}
