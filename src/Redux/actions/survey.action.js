import { SET_SURVEY_DATA, SET_SURVEY_OPTIONS } from '../types/survey.types';

export const setSurveyData = (obj) => {
  return {
    type: SET_SURVEY_DATA,
    payload: obj,
  };
};

export const setSurveyOptions = (obj) => {
  return {
    type: SET_SURVEY_OPTIONS,
    payload: obj,
  };
};
