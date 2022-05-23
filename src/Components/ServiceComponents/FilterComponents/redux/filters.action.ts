import { SET_FILTER_REGION_SUBJECT, SHOW_FILTER_REGION_SUBJECT } from './filter.types';
import { ActionType } from '../../../../Redux/types';


export const setFilterRegionSubject = (value: string): ActionType => {
  return {
    type: SET_FILTER_REGION_SUBJECT,
    payload: value
  }
}

export const showFilterRegionSubject = (bool: boolean): ActionType => {
  return {
    type: SHOW_FILTER_REGION_SUBJECT,
    payload: bool
  }
}
