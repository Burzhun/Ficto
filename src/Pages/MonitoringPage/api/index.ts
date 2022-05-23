import { PaginationRequestType } from '@sas/ui-kit';
import { AxiosPromise } from 'axios';
import { api, endpoints } from '../../../api';
import { ObserverProjectsListType } from '../types';

type ObserverResponseListType = {
  payload: {
    result: ObserverProjectsListType;
    total: number;
  };
};

export const getObserverListWithPagination = (
  pagination: PaginationRequestType,
  currentProjectId: number
): AxiosPromise<ObserverResponseListType> => {
  const url = `${endpoints.observerTemplateProjectId(currentProjectId)}&limit=${
    pagination.limit
  }&offset=${pagination.offset}`;
  return api.get(url);
};
