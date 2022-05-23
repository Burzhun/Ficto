import { SET_SURVEY_DATA, SET_SURVEY_OPTIONS } from '../types/survey.types';

const initialState = {
  options: {},
  data: {},
};

export const surveyReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SURVEY_DATA: {
      return { ...state, data: action.payload };
    }
    case SET_SURVEY_OPTIONS: {
      return { ...state, options: action.payload };
    }
    default:
      return state;
  }
};
