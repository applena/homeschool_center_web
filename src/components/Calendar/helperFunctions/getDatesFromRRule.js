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
  const endYear = betweenEnd === 1 ? activeYear + 1 : activeYear;


  const rstrArr = new Date(eventStart).toISOString().split(/[-:.]/);
  delete rstrArr[5];
  let rstr = `DTSTART:${rstrArr.join('')}Z\n${str}`;
  // console.log('getDAtesFromRRule, rstr', { rstr })

  let rruleSet = rrulestr(rstr, { forceset: true });

  const previousYear = activeMonth === 1 ? activeYear - 1 : activeYear;
  const previousMonth = activeMonth === 1 ? 12 : activeMonth - 1;

  // console.log('getDatesFromRRule', { str, eventStart, betweenStart, betweenEnd, activeMonth, activeYear, endYear, previousMonth, previousYear });
  //get dates
  let dates = rruleSet.between(datetime(previousYear, previousMonth, 1), datetime(endYear, betweenEnd, 1));

  return dates;
}

export default getDatesFromRRule;