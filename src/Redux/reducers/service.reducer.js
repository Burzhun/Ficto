import {
  CHANGE_STATUS,
  SET_ABOUT_PROJECT_INFO,
  SET_LOADING,
  SHOW_ABOUT_PROJECT,
  SHOW_ABOUT_REPORT,
  SHOW_NAVIGATION_DRAWER,
} from '../types/service.types';

const initialState = {
  showAboutReport: false,
  showAboutProject: false,
  showNavigationDrawer: false,
  loading: false,
  template: true,
  sendStatus: { value: 'draft', label: 'Черновик', color: '#666666' },
  reportsList: [
    {
      id: 'a',
      title: 'Инфраструктура',
      color: '#466FDA',
    },
    {
      id: 'b',
      title: 'Численность',
      color: '#43E1EB',
    },
    {
      id: 'c',
      title: 'План мероприятий',
      color: '#F27128',
    },
    {
      id: 'd',
      title: 'Помещения',
      color: '#A8F2E0',
    },
    {
      id: 'e',
      title: 'Задания',
      color: '#FA56FD',
    },
    {
      id: 'f',
      title: 'Исследования',
      color: '#FA63AB',
    },
    {
      id: 'g',
      title: 'Отчетность',
      color: '#14EF86',
    },
  ],
  aboutProjectInfoData: {
    status: '',
    number: '',
    changeDate: '',
    expirationDate: '',
  },
};

export const serviceState = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_ABOUT_REPORT:
      return { ...state, showAboutReport: !state.showAboutReport };
    case SHOW_ABOUT_PROJECT:
      return { ...state, showAboutProject: action.payload };
    case CHANGE_STATUS:
      return { ...state, sendStatus: action.payload };
    case SET_LOADING:
      return { ...state, loading: action.payload };
    case SHOW_NAVIGATION_DRAWER:
      return { ...state, showNavigationDrawer: action.payload };
    case SET_ABOUT_PROJECT_INFO:
      return { ...state, aboutProjectInfoData: { ...action.payload } };
    default:
      return state;
  }
};
