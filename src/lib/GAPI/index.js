import get from './get';
import getOne from './getOne';
import update from './update';
import remove from './remove';
import create from './create';
import instance from './instance';

export const gapi = {
  get,
  getOne,
  instance,
  create,
  update,
  remove
}

export default gapi;