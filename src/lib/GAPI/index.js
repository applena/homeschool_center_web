import get from "./get";
import getOne from "./getOne";
import update from "./update";
import remove from "./remove";
import create from "./create";
import instances from "./instances";
import deleteCalendar from "./deleteCalendar";

export const gapi = {
  get,
  getOne,
  instances,
  create,
  update,
  remove,
  deleteCalendar,
};

export default gapi;
