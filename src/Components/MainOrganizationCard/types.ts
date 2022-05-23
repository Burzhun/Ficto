import { ReactElement } from 'react';

export type FileType = {
  id: string;
  name: string;
};

export type AllFileType = {
  accreditation: FileType | null;
  appointment: FileType | null;
  doc: FileType | null;
  license: FileType | null;
  structure: FileType | null;
  photo: FileType | null;
};

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
  | 'appointment'
  | 'accreditation'
  | 'doc'
  | 'license'
  | 'structure'
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
  fullName: string;
  shortName: string;
  inn: string;
  subjectsFederation: string;
  addOnClarification: string;
  address: {
    ZIPCode: string;
    city: string;
    street: string;
    house: string;
    housing: string;
    building: string;
  };
  phone: string;
  domain: string;
  email: string;
  head: {
    dateBirth: string | null;
    dateAppointment: string | null;
    fullName: string;
    position: string;
    lengthOfWork: string;
    phoneWork: string;
    phoneMobile: string;
    email: string;
    photo: null | FilePropsType;
  };

  files: {
    accreditationFile: FilePropsType;
    appointmentFile: FilePropsType;
    doc: FilePropsType;
    licenseFile: FilePropsType;
    structureFile: FilePropsType;
    photo?: FilePropsType | null;
  };
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
export type DeputyType = {
  dateAppointment: string;
  dateBirth: string;
  fullName: string;
  position: string;
  lengthOfWork: number;
  phoneWork: string;
  phoneMobile: string;
  email: string;
};
