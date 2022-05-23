// cspell:disable-next-line
import { v4 as uuidv4 } from 'uuid';
import {
  ADD_NEW_WORKPLACE,
  ADD_START_REPORT_LIST,
  ADD_TABLE_LIST,
  CHANGE_CURRENT_WORKPLACE,
  SHOW_ORGANIZATION_CARD,
} from '../types/workPlase.types';

export const addNewWork = (data) => {
  const newWork = {
    // cspell:disable-next-line
    id: uuidv4(),
    title: data,
  };
  return {
    type: ADD_NEW_WORKPLACE,
    payload: newWork,
  };
};

export const changeCurrentWorkPlace = (current) => {
  return {
    type: CHANGE_CURRENT_WORKPLACE,
    payload: current,
  };
};

export const startReportsList = (data) => {
  return {
    type: ADD_START_REPORT_LIST,
    payload: data,
  };
};
export const loadTableList = (data) => {
  return {
    type: ADD_TABLE_LIST,
    payload: data,
  };
};
export const showOrganizationCard = (data) => {
  return {
    type: SHOW_ORGANIZATION_CARD,
    payload: data,
  };
};
