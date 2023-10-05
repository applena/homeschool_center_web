// external libraries
import { rrulestr, datetime } from "rrule";

/*
function that takes in a time frame and returns a list of dates of events that occur in that timeframe

imput: 
str = "RRULE:FREQ=WEEKLY;BYDAY=SU"
eventStart = Sat Sep 02 2023 17:00:00 GMT-0700 (Pacific Daylight Time)
betweenStart = 9
betweenEnd = 10
activeMonth = 10
activeYear = 2023

returns: // ['2012-05-01T10:30:00.000Z', '2012-07-01T10:30:00.000Z']
*/
//get dates based on rrule string between dates
const getDatesFromRRule = (str, eventStart, betweenStart, betweenEnd, activeMonth, activeYear) => {
  // console.log('getDatesFromRRule', { str, eventStart, betweenStart, betweenEnd, activeMonth, activeYear });

  const rstrArr = eventStart.toISOString().split(/[-:.]/);
  delete rstrArr[5];
  let rstr = `DTSTART:${rstrArr.join('')}Z\n${str}`;
  // console.log('getDAtesFromRRule, rstr', { rstr })

  let rruleSet = rrulestr(rstr, { forceset: true });

  //get dates
  let dates = rruleSet.between(datetime(activeYear, activeMonth, 1), datetime(activeYear, activeMonth, 31));

  return dates;
}

export default getDatesFromRRule;