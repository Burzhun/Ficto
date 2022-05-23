export type ObserverProjectTemplateType = {
  id: number;
  title: string;
  icon: string;
};

export type ObserverProjectTemplateListType = ObserverProjectTemplateType[];

export type ObserverProjectsListType = ObserverProjectNodeType[];

export type ObserverProjectNodeType = {
  archive: boolean;
  changesDate: string;
  expirationDate: string;
  icon: string;
  id: number;
  name: string;
  organization: string;
};
