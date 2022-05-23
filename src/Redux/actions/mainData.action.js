import { SET_MAIN_DATA } from '../types/data.types';

export const setMainData = (data) => {
  return {
    type: SET_MAIN_DATA,
    payload: data,
  };
};


