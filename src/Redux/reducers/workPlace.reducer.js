import {
  ADD_NEW_WORKPLACE,
  CHANGE_CURRENT_WORKPLACE,
  ADD_START_REPORT_LIST,
  ADD_TABLE_LIST,
  SHOW_ORGANIZATION_CARD,
  // cspell:disable-next-line
} from '../types/workPlase.types';

const initialState = {
  workPlacesList: [
    {
      id: 'a',
      title: 'ЦРГОП и ИТ',
    },
    {
      id: 'b',
      title: 'ФГАОУ ДПО',
    },
  ],
  currentWorkPlace: localStorage.getItem('curr_wP'),
  showStatus: true,
};

export const workPlaces = (state = initialState, action) => {
  switch (action.type) {
    case ADD_NEW_WORKPLACE: {
      return {
        ...state,
        workPlacesList: [...state.workPlacesList, action.payload],
      };
    }
    case CHANGE_CURRENT_WORKPLACE:
      return { ...state, currentWorkPlace: action.payload };
    case ADD_START_REPORT_LIST:
      return { ...state, reportsList: action.payload };
    case ADD_TABLE_LIST:
      return { ...state, reportsInfoList: action.payload };
    case SHOW_ORGANIZATION_CARD:
      return { ...state, showStatus: action.payload };
    default:
      return state;
  }
};
