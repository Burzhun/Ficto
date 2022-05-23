import { api, endpoints } from 'api';
import { AxiosPromise } from 'axios';
import { AdditionalTypes, FilesPlaceType, SaveResponseType } from '../types';

export const getAdditionalValues = (): AxiosPromise<{
  payload: AdditionalTypes[];
}> => {
  return api.get(endpoints.additionalValuesUrl());
};
export const getOrganizationCard = (orgId: number): AxiosPromise => {
  return api.get(endpoints.organizationCard(orgId));
};
export const saveOrganizationCard = (
  orgId: number,
  data: unknown
): AxiosPromise<Record<string, unknown>> => {
  return api.put(endpoints.organizationCard(orgId), data);
};
export const saveDeputyStaff = (
  data: unknown
): AxiosPromise<Record<string, unknown>> => {
  return api.post(endpoints.organizationCardStaff(), data);
};

export const saveFile = (
  name: string,
  data: string | ArrayBuffer,
  size: number,
  type?: FilesPlaceType
): AxiosPromise<SaveResponseType> => {
  return api.post(endpoints.organizationFile(), {
    name,
    data,
    size,
  });
};
