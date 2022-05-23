import axios from 'axios';

// TODO: запилить обновление токена через интерцепторы

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use(function (config) {
  const token = localStorage.getItem('userToken') || '';
  config.headers['Content-Type'] = 'application/json';
  config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

export const endpoints = {
  feedbackForm: (): string => '/support/feedback',
  observerTemplateProjectList: (): string =>
    '/observer/template_project/repr/list',
  observerTemplateProjectId: (id: number): string =>
    `/observer/project/list?templateProjectId=${id}`,
  organizationCard: (organizationID: number): string =>
    `/organization/${organizationID}/card`,
  organizationCardStaff: (): string => `validation/organization/card/staff`,
  currentUser: () => '/currentUser',
  project: (currentProjectId: number): string => `/project/${currentProjectId}`,
  downloadProject: (currentProjectId: number): string =>
    `/observer/project/${currentProjectId}/methods/export?tables=[1,2,3]&orgs=[1,2,3]`,
  getTabs: (currentProjectId: number): string =>
    `/project/${currentProjectId}/tables/repr/list`,
  createTabs: (currentProjectId: number, currentableId: number): string =>
    `/project/${currentProjectId}/tables/${currentableId}/methods/by-template`,
  tabs: (id: number): string => `/tables/${id}`,
  sample: (currentProjectId: number): string =>
    `/project/${currentProjectId}/tables/repr/list?type=static&canCreate=true`,
  observerProject: (currentProjectId: number): string =>
    `/observer/project/${currentProjectId}`,
  projectTable: (currentProjectId: number, currentTableId: number) =>
    `/project/${currentProjectId}/tables/${currentTableId}`,
  observerProjectTable: (currentProjectId: number, currentTableId: number) =>
    `/observer/project/${currentProjectId}/tables/${currentTableId}`,
  projectFind: (offset: number): string => `/project/list?offset=${offset}`,
  loadMain: (): string => '/main',
  projectDataPrevious: (currentProjectId: number): string =>
    `/project/${currentProjectId}/previous`,
  additionalValuesUrl: (): string =>
    '/dictionary/additional-organizational-functions',
  projectTypesUrl: (): string => `/project/templates`,
  projectTypesList: (): string => `/template-project/list?limit=100000`,
  login: (): string => '/login',
  analyticsCard: (id: string, orgId: number): string =>
    `/analytics/${id}/${orgId}`,
  analyticsList: (): string => '/analytics/list',
  copyTable: (projectId: number, tableId: number): string =>
    `/project/${projectId}/tables/${tableId}/methods/cloning`,
  dictionary: (dictionaryValue: string): string =>
    `/dictionary${dictionaryValue}`,
  exportProject: (projectId: string): string => `/project/${projectId}/export`,
  organizationFile: (): string => `/file/organizationfile`,
  perelman: (): string => `/expect`,
  responsibles: (projectId: string): string =>
    `/project/${projectId}/responsibles`,
  templateList: (): string => `template-project/list?limit=1000`,
};

export const getUser = () => {
  return api.get(endpoints.currentUser());
};

export const getProject = (currentProjectId: number) => {
  return api.get(endpoints.project(currentProjectId));
};
export const getSample = (currentProjectId: number) => {
  return api.get(endpoints.sample(currentProjectId));
};
export const saveProject = (
  currentProjectId: number,
  data: { tables: unknown[] }
) => {
  console.log(currentProjectId);
  console.log(data);
  return api.post(endpoints.project(currentProjectId), data);
};

export const getCurrentTable = (
  currentProjectId: number,
  currentTable: number
) => {
  return api.get(endpoints.projectTable(currentProjectId, currentTable));
};

export { api };
