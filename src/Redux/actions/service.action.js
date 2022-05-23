import {
  CHANGE_STATUS,
  SET_ABOUT_PROJECT_INFO,
  SET_LOADING,
  SHOW_ABOUT_PROJECT,
  SHOW_ABOUT_REPORT,
  SHOW_NAVIGATION_DRAWER,
} from '../types/service.types';

export const showAboutReport = () => {
  return {
    type: SHOW_ABOUT_REPORT,
  };
};

export const showAboutProject = (bool) => {
  return {
    type: SHOW_ABOUT_PROJECT,
    payload: bool,
  };
};
export const showNavigationDrawer = (bool) => {
  return {
    type: SHOW_NAVIGATION_DRAWER,
    payload: bool,
  };
};

export const setAboutProjectInfo = (obj) => {
  return {
    type: SET_ABOUT_PROJECT_INFO,
    payload: obj,
  };
};

export const setSendStatus = (value) => {
  return {
    type: CHANGE_STATUS,
    payload: value,
  };
};

export const setLoadingApp = (bool) => {
  return {
    type: SET_LOADING,
    payload: bool,
  };
};
