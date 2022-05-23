import { LOGIN_USER, LOGOUT_USER } from '../types/auth.types';

export const login = (token, observer, cardView) => {
  return {
    type: LOGIN_USER,
    payload: { token, observer, cardView },
  };
};

export const logout = () => {
  return {
    type: LOGOUT_USER,
  };
};
