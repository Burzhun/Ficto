import { LOGIN_USER, LOGOUT_USER } from '../types/auth.types';

const initialState = {
  isAuth: !!localStorage.getItem('userToken'),
  token: localStorage.getItem('userToken')
    ? localStorage.getItem('userToken')
    : null,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      return {
        ...state,
        isAuth: true,
        token: action.payload.token,
        observer: action.payload.observer,
        cardView: action.payload.cardView,
      };
    case LOGOUT_USER:
      return { ...state, isAuth: false, token: null };
    default:
      return state;
  }
};
