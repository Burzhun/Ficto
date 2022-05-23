import { api, endpoints } from 'api';
import { FormProps } from './types';
import { AxiosPromise } from 'axios';

export const saveForm = (data: FormProps): AxiosPromise => {
  return api.post(endpoints.feedbackForm(), data);
};
export const getProjectTypes = (): AxiosPromise => {
  return api.get(endpoints.projectTypesList(), {});
};
