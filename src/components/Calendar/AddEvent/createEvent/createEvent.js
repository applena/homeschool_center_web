import GAPI from "../../../../lib/GAPI";
import createStartEndTimeTimed from "./createStartEndTimeTimed";
import createStartEndTimeAllDay from "./createStartEndTimeAllDay";

async function createEvent({ event, hICalendar }) {
  console.log("createEvent", event);
  // add start and end date/time
  console.log("AddEvent - handleSubit", event, JSON.stringify(event));
  let newObj = {};
  if (!event.allDay) {
    newObj = createStartEndTimeTimed(event);
  } else {
    newObj = createStartEndTimeAllDay(event);
  }

  console.log("creating the event object", { newObj });

  // add recurrence
  if (event.repeats) {
    // const rule = new RRule({
    //   freq: RRule.WEEKLY,
    //   interval: 5,
    //   byweekday: [RRule.MO, RRule.FR],
    //   dtstart: datetime(2012, 2, 1, 10, 30),
    //   until: datetime(2012, 12, 31)
    // })
    // console.log('selected event recurrance', props.selectedEvent?.recurrence)
    let recurrence = [];
    if (!["How Often"].includes(event.rRuleObj.FREQ)) {
      if (event.rRuleObj.FREQ === "MONTHLY") {
        recurrence.push(
          `RRULE:FREQ=${event.rRuleObj.FREQ};BYDAY=${
            event.ordinalIndex
          }${event.ordinalsOfMonth.split(" ")[2].substring(0, 2).toUpperCase()}`
        );
      } else if (event.rRuleObj.FREQ === "Weekdays") {
        recurrence.push(`RRULE:FREQ=DAILY`);
      } else {
        recurrence.push(`RRULE:FREQ=${event.rRuleObj.FREQ}`);
      }
    }

    if (
      event.rRuleObj.BYDAY !== "Day Of Week" &&
      event.rRuleObj.FREQ !== "MONTHLY"
    ) {
      recurrence.push(`BYDAY=${event.rRuleObj.BYDAY}`);
    }

    console.log("final", { recurrence });
    event.event["recurrence"] = [recurrence.join(";")];
  }

  let createdEvent = {};
  console.log("event", event);

  console.log("calling GAPI to create event", event);
  const response = await GAPI.create(hICalendar.id, event).catch((e) =>
    console.error(e)
  );
  if (!response) return;
  createdEvent = response.result;
  console.log("event added successfully");
  return createdEvent;
}

export default createEvent;
