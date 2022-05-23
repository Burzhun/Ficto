import {
  SET_FILTER_REGION_SUBJECT,
  SHOW_FILTER_REGION_SUBJECT,
} from './filter.types';

type ReducerTypes = {
  subjects_federation: string;
  showSubjectFederation: boolean;
};

type ActionType = {
  type: string;
  payload: any;
};

const initialState = {
  subjects_federation: '',
  showSubjectFederation: false,
};

export const filterReducer = (
  state = initialState,
  action: ActionType
): ReducerTypes => {
  switch (action.type) {
    case SET_FILTER_REGION_SUBJECT:
      return { ...state, subjects_federation: action.payload };
    case SHOW_FILTER_REGION_SUBJECT:
      return { ...state, showSubjectFederation: action.payload };
    default:
      return state;
  }
};
