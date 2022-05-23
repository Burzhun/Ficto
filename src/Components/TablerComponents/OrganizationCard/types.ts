import { ReactElement } from 'react';

export type FileWithPath = {
  lastModified: string;
  lastModifiedDate: string;
  name: string;
  path: string;
  size: number;
  type: string;
  webkitRelativePath: string;
};

export type SaveResponseType = {
  payload: {
    id: string;
    link: string;
    name: string;
    size: number;
  };
};

export type FilesPlaceType =
  | 'appointmentFile'
  | 'accreditationFile'
  | 'docFile'
  | 'licenseFile'
  | 'structureFile'
  | 'photo';

export type AdditionalTypes = {
  Label: string;
  Value: string;
};

export type StateProps = {
  auth: { token: string };
  mainData: { account: { organizationID: number } };
};

export type FilePropsType = {
  id?: string;
  name?: string;
  link?: string;
  size?: number;
  content?: string;
};

export type CardDataTypes = {
  readonly id: number;
  fullName: string;
  shortName: string;
  inn: string;
  subjectsFederation: string;
  addOnClarification: string;
  address: {
    readonly id: number;
    ZIPCode: string;
    city: string;
    street: string;
    house: string;
    housing: string;
    building: string;
  };
  phone: {
    readonly id: number;
    value: string;
  };
  domain: {
    readonly id: number;
    value: string;
  };
  email: {
    readonly id: number;
    value: string;
  };
  head: {
    readonly id: number;
    dateBirth: string | null;
    dateAppointment: string | null;
    fullName: string;
    position: string;
    lengthOfWork: string;
    readonly phoneWorkId: number;
    phoneWork: string;
    readonly phoneMobileId: number;
    phoneMobile: string;
    readonly emailId: number;
    email: string;
    photo: FilePropsType;
  };
  deputyHeads: DeputyHeadType[];
  files: {
    accreditationFile: FilePropsType[];
    appointmentFile: FilePropsType[];
    docFile: FilePropsType[];
    licenseFile: FilePropsType[];
    structureFile: FilePropsType[];
  };
  dateBirth?: string;
  addOn: string[];
};

export type DeputyHeadType = {
  dateAppointment?: string | null;
  dateBirth?: string | null;
  email?: string;
  emailId?: number;
  fullName?: string;
  id?: number;
  lengthOfWork?: string;
  phoneMobile?: string;
  phoneMobileId?: number;
  phoneWork?: string;
  phoneWorkId?: number;
  photo?: FilePropsType | null;
  position?: string;
};

export type DeputyHeadTypeRow = {
  row: DeputyHeadType | undefined;
  rowIdx: number;
};

export type DeputyHeadTypeValues = {
  deputyHeads: Array<DeputyHeadType>;
};

export type TableHeader = {
  column: {
    name: string | ReactElement;
    idx: number;
  };
};
