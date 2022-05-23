import { CardDataTypes } from './types';

export const initialDeputy = {
  dateAppointment: '',
  dateBirth: '',
  fullName: '',
  position: '',
  lengthOfWork: 0,
  phoneWork: '',
  phoneMobile: '',
  email: '',
};
export const initialValues: CardDataTypes = {
  fullName: '',
  shortName: '',
  inn: '',
  subjectsFederation: '',
  addOnClarification: '',
  address: {
    ZIPCode: '',
    city: '',
    street: '',
    house: '',
    housing: '',
    building: '',
  },
  phone: '',
  domain: '',
  email: '',
  head: {
    dateBirth: '',
    dateAppointment: '',
    fullName: '',
    position: '',
    lengthOfWork: '',
    phoneWork: '',
    phoneMobile: '',
    email: '',
    photo: null,
  },
  files: {
    accreditationFile: {},
    appointmentFile: {},
    doc: {},
    licenseFile: {},
    structureFile: {},
  },
  addOn: [],
};
export const initialFiles = {
  accreditation: null,
  appointment: null,
  doc: null,
  license: null,
  structure: null,
  photo: null,
};
