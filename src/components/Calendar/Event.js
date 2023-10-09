import React from "react";


function Event(props) {
  // const [showTooltip, setShowTooltip] = useState(false);
  // console.log('EVENT', props)

  return (
    !props.event.allDay ?
      <div
        className="event"
        onClick={(e) => props.editEvent(e, props.id)}
      >
        <span className="event-text-span" style={{ color: props.color }}>
          &bull;
        </span>
        <span style={{ marginRight: '7px' }}>
          {`${props.event.dateStart.toLocaleTimeString('en-US').split(':')[0]}:${props.event.dateStart.toLocaleTimeString('en-US').split(':')[1]} ${props.event.dateStart.toLocaleTimeString('en-US').split(':')[2].split(' ')[1]}`}
        </span>
        <span style={{ fontWeight: "500" }}>
          {props.event.summary}
        </span>
      </div>
      :
      <div
        className="event-big"
        onClick={(e) => props.editEvent(e, props.id)}
      >
        <div style={{
          width: '100%',
          borderRadius: '3px',
          border: `1px solid ${props.color}`,
          height: '26px',
          background: props.event.color
        }}
        >
          <div
            className="event-text-one"
            style={{
              marginLeft: '5px',
              marginRight: '5px',
            }}
          >
            <span style={{ fontWeight: "500" }}>
              {props.event.summary}
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
