function createStartEndTimeTimed(obj){
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

  return obj;
}

export default createStartEndTimeTimed;