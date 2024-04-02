import createEvent from "../Calendar/AddEvent/createEvent/createEvent";

async function addTestEvents({ hICalendar }) {
  console.log("addTestEvents");
  const now = new Date("2023-12-30");
  const hourFromNow = new Date();
  hourFromNow.setHours(now.getHours() + 1);
  // const hourFromNowISOString = hourFromNow.toISOString();
  const testEvents = [
    {
      allDay: true,
      startDate: now,
      event: {
        summary: "weekly saturday",
        description: '{"description":"test","subject":"MATH"}',
        start: { timeZone: "America/Los_Angeles" },
        end: { timeZone: "America/Los_Angeles" },
      },
      repeats: true,
      rRuleObj: { FREQ: "WEEKLY", BYDAY: "SA" },
      ordinalIndex: 1,
      ordinalsOfMonth: "the first Saturday of the month",
    },
    // {
    //   summary: "single event",
    //   startDate: now,
    //   allDay: false,
    //   start: {
    //     dateTime: `${new Date().toISOString()}`,
    //     timeZone: "America/Los_Angeles",
    //   },
    //   end: {
    //     dateTime: `${hourFromNowISOString}`,
    //     timeZone: "America/Los_Angeles",
    //   },
    // },
  ];

  const addedEvents = [];

  for (let i = 0; i < testEvents.length; i++) {
    console.log("addTestEvent pre-loop", testEvents[i]);
    const createdEvent = await createEvent({ obj: testEvents[i], hICalendar });
    console.log("event successfully created", { createdEvent });
    addedEvents.push(createdEvent);
  }
  return addedEvents;
}

export default addTestEvents;
