import { SET_MAIN_DATA } from '../types/data.types';

export const mainDataReducer = (state = [], action) => {
  switch (action.type) {
    case SET_MAIN_DATA: {
      return { ...state, ...action.payload };
    }
    default:
      return state;
  }
};
