import {
  SET_HOT_REF,
  SET_HOT_ROW_DATA,
  SET_HOT_SETTING,
  SET_HOT_WATCHERS,
  // cspell:disable-next-line
} from '../types/handontable.types';

export const setHOTRowData = (obj) => {
  return {
    type: SET_HOT_ROW_DATA,
    payload: obj,
  };
};

export const setHOTSettings = (obj) => {
  return {
    type: SET_HOT_SETTING,
    payload: obj,
  };
};

export const setHOTRef = (el) => {
  return {
    type: SET_HOT_REF,
    payload: el,
  };
};

export const setHOTWatchers = (obj) => {
  return {
    type: SET_HOT_WATCHERS,
    payload: obj,
  };
};
