function createStartEndTimeAllDay(obj) {
  console.log("all day event", obj.startDate);
  //"start": {"date": "2015-06-01"}
  const endDate = new Date(obj.startDate);
  endDate.setDate(endDate.getDate() + 1);
  obj.start = { date: obj.startDate.toISOString().substring(0, 10) };
  obj.end = { date: endDate.toISOString().substring(0, 10) };

  return obj;
}

export default createStartEndTimeAllDay;
