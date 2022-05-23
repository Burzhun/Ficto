import {
  SET_HOT_REF,
  SET_HOT_ROW_DATA,
  SET_HOT_SETTING,
  SET_HOT_WATCHERS,
  // cspell:disable-next-line
} from '../types/handontable.types';

const initialState = {
  data: {},
  settings: {},
  refHOT: null,
  watchers: null,
};

export const handsontableReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_HOT_ROW_DATA:
      return { ...state, data: action.payload };
    case SET_HOT_SETTING:
      return { ...state, settings: action.payload };
    case SET_HOT_REF:
      return { ...state, refHOT: action.payload };
    case SET_HOT_WATCHERS:
      return { ...state, watchers: action.payload };
    default:
      return state;
  }
};
