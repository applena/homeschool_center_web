// Events Returned From Google

// Single event with start and end time in the same day
const singleTimedEvent = {
  created: "2023-09-13T21:31:30.000Z",
  creator: { email: '' },
  end: { dateTime: '2023-09-17T22:45:00Z', timeZone: 'America/Los_Angeles' },
  etag: "\"3389281380554000\"",
  eventType: "default",
  htmlLink: "https://www.google.com/calendar/event?eid=MmEzaWdtNTBkMWhwbHY4bTllZ3VsYTUybTUgY21sOWtmYW83M3UzMWFhbjRodjBuN3ZiaW9AZw",
  iCalUID: "2a3igm50d1hplv8m9egula52m5@google.com",
  id: "2a3igm50d1hplv8m9egula52m5",
  kind: "calendar#event",
  organizer: { email: '', displayName: 'Home School Island', self: true },
  reminders: { useDefault: true },
  sequence: 0,
  start: { dateTime: '2023-09-17T21:45:00Z', timeZone: 'America/Los_Angeles' },
  status: "confirmed",
  summary: "singleTimedEvent"
}

// Repeating Event with a start and end time in the same day
const repeatingTimedEvent = {
  created: "2023-09-13T21:34:05.000Z",
  creator: { email: '' },
  end: { dateTime: '2023-09-17T20:00:00Z', timeZone: 'America/Los_Angeles' },
  etag: "\"3389281691944000\"",
  eventType: "default",
  htmlLink: "https://www.google.com/calendar/event?eid=MzY4dWhzdTlhOXBydTRhZWI5dDJwNGxzYmpfMjAyMzA5MTdUMTkwMDAwWiBjbWw5a2ZhbzczdTMxYWFuNGh2MG43dmJpb0Bn",
  iCalUID: "",
  id: "368uhsu9a9pru4aeb9t2p4lsbj",
  kind: "calendar#event",
  organizer: { email: '', displayName: 'Home School Island', self: true },
  recurrence: ['RRULE:FREQ=WEEKLY;BYDAY=SU'],
  reminders: { useDefault: true },
  sequence: 0,
  start: { dateTime: '2023-09-17T19:00:00Z', timeZone: 'America/Los_Angeles' },
  status: "confirmed",
  summary: "timed repeating event",
  updated: "2023-09-13T21:34:05.972Z"
}

// event spanning multiple days - non-repeating
const multiDayNonRepeating = {
  created: "2023-09-13T21:33:00.000Z",
  creator: { email: '' },
  end: { date: '2023-09-20' },
  etag: "\"3389281560902000\"",
  eventType: "default",
  htmlLink: "",
  iCalUID: "718r9ug9k3866iiriqok7ra5d8@google.com",
  id: "718r9ug9k3866iiriqok7ra5d8",
  kind: "calendar#event",
  organizer: { email: '', displayName: 'Home School Island', self: true },
  reminders: { useDefault: false },
  sequence: 0,
  start: { date: '2023-09-17' },
  status: "confirmed",
  summary: "multi day event non repeating",
  transparency: "transparent",
  updated: "2023-09-13T21:33:00.451Z"
}

// event spanning multiple days repeating
const multiDayRepeating = {
  created: "2023-09-13T21:33:21.000Z",
  creator: { email: '' },
  end: { date: '2023-09-20' },
  etag: "\"3389281624734000\"",
  eventType: "default",
  htmlLink: "",
  iCalUID: "",
  id: "6nkamh56jruh2faofdc0e7lrbj",
  kind: "calendar#event",
  organizer: { email: '', displayName: 'Home School Island', self: true },
  recurrence: ['RRULE:FREQ=WEEKLY;BYDAY=SU'],
  reminders: { useDefault: false },
  sequence: 0,
  start: { date: '2023-09-17' },
  status: "confirmed",
  summary: "multi day event repeating",
  transparency: "transparent",
  updated: "2023-09-13T21:33:32.367Z"
}

// all day event non-repeating
const allDaySingle = {
  created: "2023-09-13T21:31:57.000Z",
  creator: { email: '' },
  end: { date: '2023-09-18' },
  etag: "\"3389281435136000\"",
  eventType: "default",
  htmlLink: "",
  iCalUID: "797rkb1rtfadj9evagp6pc2qqe@google.com",
  id: "797rkb1rtfadj9evagp6pc2qqe",
  kind: "calendar#event",
  organizer: { email: '', displayName: 'Home School Island', self: true },
  reminders: { useDefault: false },
  sequence: 0,
  start: { date: '2023-09-17' },
  status: "confirmed",
  summary: "all day event single",
  transparency: "transparent",
  updated: "2023-09-13T21:31:57.568Z",
}

// all day event repeating
const allDayRepeating = {
  created: "2023-09-13T21:32:13.000Z",
  creator: { email: '' },
  end: { date: '2023-09-18' },
  etag: "\"3389281486488000\"",
  eventType: "default",
  htmlLink: "",
  iCalUID: "0uplt54funchakd8v9ce4g88kr@google.com",
  id: "0uplt54funchakd8v9ce4g88kr",
  kind: "calendar#event",
  organizer: { email: '', displayName: 'Home School Island', self: true },
  recurrence: ['RRULE:FREQ=WEEKLY;BYDAY=SU'],
  reminders: { useDefault: false },
  sequence: 0,
  start: { date: '2023-09-17' },
  status: "confirmed",
  summary: "all day repeating event",
  transparency: "transparent",
  updated: "2023-09-13T21:32:23.244Z"
}

// Cancelled Event
const cancelledEvent = {
  etag: "\"3389281410196000\"",
  id: "1fur4n45n1mf5m75vbad412f2p_20230917",
  kind: "calendar#event",
  originalStartTime: { date: '2023-09-17' },
  recurringEventId: "1fur4n45n1mf5m75vbad412f2p",
  status: "cancelled"
}

// Changed Event all day repeating
const changedEvent = {
  created: "2023-09-13T21:32:13.000Z",
  creator: { email: '' },
  end: { date: '2023-09-25' },
  etag: "\"3389284662252000\"",
  eventType: "default",
  htmlLink: "",
  iCalUID: "0uplt54funchakd8v9ce4g88kr@google.com",
  id: "0uplt54funchakd8v9ce4g88kr_20230924",
  kind: "calendar#event",
  organizer: { email: '', displayName: 'Home School Island', self: true },
  originalStartTime: { date: '2023-09-24' }, // UNIQUE KEY for changed events
  recurringEventId: "0uplt54funchakd8v9ce4g88kr",
  reminders: { useDefault: false },
  sequence: 0,
  start: { date: '2023-09-24' },
  status: "confirmed",
  summary: "all day repeating event - changed",
  transparency: "transparent",
  updated: "2023-09-13T21:58:51.126Z"
}
