import GAPI from "../../../lib/GAPI";

async function createEvent({ obj, hICalendar }) {
  // add start and end date/time
  console.log("AddEvent - handleSubit", { obj }, JSON.stringify(obj));
  if (!obj.allDay) {
    console.log("not all day event", obj.startTime);
    let startDateTime = new Date(obj.startDate);
    startDateTime.setHours(
      obj.startTime.split(":")[0],
      obj.startTime.split(":")[1]
    );

    let endDateTime = new Date(obj.startDate);
    endDateTime.setHours(obj.endTime.split(":")[0], obj.endTime.split(":")[1]);

    obj.event["start"]["dateTime"] = startDateTime;
    obj.event["end"]["dateTime"] = endDateTime;
  } else {
    console.log("all day event", obj.startDate);
    //"start": {"date": "2015-06-01"}
    const endDate = new Date(obj.startDate);
    endDate.setDate(endDate.getDate() + 1);
    obj.event["start"]["date"] = obj.startDate.toISOString().substring(0, 10);
    obj.event["end"]["date"] = endDate.toISOString().substring(0, 10);
  }

  // add recurrence
  if (obj.repeats) {
    // const rule = new RRule({
    //   freq: RRule.WEEKLY,
    //   interval: 5,
    //   byweekday: [RRule.MO, RRule.FR],
    //   dtstart: datetime(2012, 2, 1, 10, 30),
    //   until: datetime(2012, 12, 31)
    // })
    // console.log('selected event recurrance', props.selectedEvent?.recurrence)
    let recurrence = [];
    if (!["How Often"].includes(obj.rRuleObj.FREQ)) {
      if (obj.rRuleObj.FREQ === "MONTHLY") {
        recurrence.push(
          `RRULE:FREQ=${obj.rRuleObj.FREQ};BYDAY=${
            obj.ordinalIndex
          }${obj.ordinalsOfMonth.split(" ")[2].substring(0, 2).toUpperCase()}`
        );
      } else if (obj.rRuleObj.FREQ === "Weekdays") {
        recurrence.push(`RRULE:FREQ=DAILY`);
      } else {
        recurrence.push(`RRULE:FREQ=${obj.rRuleObj.FREQ}`);
      }
    }

    if (
      obj.rRuleObj.BYDAY !== "Day Of Week" &&
      obj.rRuleObj.FREQ !== "MONTHLY"
    ) {
      recurrence.push(`BYDAY=${obj.rRuleObj.BYDAY}`);
    }

    console.log("final", { recurrence });
    obj.event["recurrence"] = [recurrence.join(";")];
  }

  let createdEvent = {};
  console.log("event", obj.event);

  console.log("calling GAPI to create event", obj.event);
  const response = await GAPI.create(hICalendar.id, obj.event).catch((e) =>
    console.error(e)
  );
  if (!response) return;
  createdEvent = response.result;
  console.log("event added successfully");
  return createdEvent;
}

export default createEvent;
