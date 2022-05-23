import {
  Checkbox,
  Chip,
  FormControl,
  Input as InputFromUI,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
} from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import {
  Button,
  DatePicker,
  Drawer,
  EditableTable,
  Input,
  UploadFile,
} from '@sas/ui-kit';
import { PageHeader } from 'Components/ui/Page';
import { format } from 'date-fns';
import { getIn, useFormik } from 'formik';
import { FC, useEffect, useState } from 'react';
import { FileWithPath } from 'react-dropzone';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { api, endpoints } from '../../../api';
import { Page, PageContent } from '../../ui/Page';
import { UploadImage } from '../../ui/UploadImage';
import { RequestFileType } from '../../ui/UploadImage/UploadImage';
import {
  getAdditionalValues,
  getOrganizationCard,
  saveFile,
  saveOrganizationCard,
} from './api';
import { initialState } from './helpers';
import './style.css';
import {
  Block,
  BlockTitle,
  BtnContainer,
  FullTable,
  HeaderContainer,
  HeaderContainerLeftSide,
  HeaderContainerRightSide,
  Load,
  SeveralElem,
  useStyles,
} from './styled';
import {
  CardDataTypes,
  DeputyHeadType,
  DeputyHeadTypeRow,
  DeputyHeadTypeValues,
  FilesPlaceType,
  StateProps,
  TableHeader,
} from './types';

const date_regex = /[0-9]{2}\.[0-9]{2}\.[0-9]{4}/;

const validationSchema = yup.object({
  address: yup.object({
    city: yup
      .string()
      .matches(/^[a-zA-zа-яА-я\s\-]+$/g, 'Некорректное значение')
      .required('Обязательное поле'),
    street: yup.string().required('Обязательное поле'),
    ZIPCode: yup
      .number()
      .typeError('Введите корректный индекс')
      .required('Обязательное поле'),
    house: yup.string().required('Обязательное поле'),
  }),
  fullName: yup.string().required('Обязательное поле'),
  shortName: yup.string().required('Обязательное поле'),
  email: yup.object({
    value: yup
      .string()
      .email('Введите корректрый Email')
      .required('Обязательное поле'),
  }),
  domain: yup.object({
    value: yup.string().required('Обязательное поле'),
  }),
  phone: yup.object({
    value: yup.string().required('Обязательное поле'),
  }),
  head: yup.object({
    dateAppointment: yup.string().required('Обязательное поле').nullable(true),
    dateBirth: yup.string().required('Обязательное поле').nullable(true),
    fullName: yup.string().required('Обязательное поле'),
    email: yup
      .string()
      .email('Введите корректрый Email')
      .required('Обязательное поле'),
    phoneWork: yup.string().required('Обязательное поле'),
    phoneMobile: yup.string().required('Обязательное поле'),
    lengthOfWork: yup.string().required('Обязательное поле'),
    position: yup.string().required('Обязательное поле'),
  }),
});

export const OrganizationCard: FC = () => {
  const classes = useStyles();

  const [isShowEditDrawer, setIsShowEditDrawer] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRow, setCurrentRow] = useState<DeputyHeadType | undefined>(
    undefined
  );
  const [value, setValue] = useState<DeputyHeadType>({});

  const [names, setNames] = useState<string[]>([]);
  const [state, setState] = useState<CardDataTypes>(initialState);
  const mainData = useSelector((state: StateProps) => state.mainData);

  useEffect(() => {
    (async () => {
      try {
        const {
          data: { payload },
        } = await getAdditionalValues();
        setNames(payload.map((node: { Value: string }) => node.Value));
      } catch (err) {}
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const {
          data: { payload },
        } = await getOrganizationCard(mainData.account.organizationID);

        const deputyHeadsCopy = payload.deputyHeads.map(
          (deputy: DeputyHeadType) => {
            const birth = deputy.dateBirth
              ? format(new Date(String(deputy.dateBirth)), 'dd.MM.yyyy')
              : null;
            const appointment = deputy.dateAppointment
              ? format(new Date(String(deputy.dateAppointment)), 'dd.MM.yyyy')
              : null;

            return {
              ...deputy,
              dateBirth: birth,
              dateAppointment: appointment,
            };
          }
        );

        setState({
          ...payload,
          deputyHeads: deputyHeadsCopy,
        });
      } catch (err) {}
    })();
  }, [mainData]);

  const openEditHandler = (
    props: DeputyHeadTypeRow,
    data: DeputyHeadType[]
  ) => {
    setIsEditing(true);
    setValue(data[props.rowIdx]);
    setCurrentRow(props.row);
    setIsShowEditDrawer(true);
  };

  const openAddHandler = () => {
    setIsEditing(false);
    setValue({});
    setCurrentRow({});
    setIsShowEditDrawer(true);
  };

  const closeDrawerHandler = () => {
    setIsShowEditDrawer(!isShowEditDrawer);
  };

  const changeRowHandler = (
    values: DeputyHeadTypeValues,
    setFieldValue: (s: string, ar: Array<DeputyHeadType>) => void
  ) => {
    if (isEditing)
      onRowUpdate(value, currentRow, values.deputyHeads, setFieldValue);
    else {
      onRowAdd(value, values.deputyHeads, setFieldValue);
    }
    //currentRow?.onRowChange({...currentRow?.row, task: value})
    setValue({});
    setIsShowEditDrawer(false);
  };

  const setFieldValue = (
    path: string,
    value: string | [] | DeputyHeadType[]
  ) => {
    formik.setFieldValue(path, value);
  };

  const fileUploadHandler = async (
    file: FileWithPath | null,
    binaryFile: string | null | ArrayBuffer,
    placeInState: FilesPlaceType,
    setFieldValue: (field: string, value: string | []) => void
  ) => {
    if (file) {
      try {
        const {
          data: {
            payload: { id },
          },
        } = await saveFile(
          file.name,
          binaryFile || '',
          file.size,
          placeInState
        );
        setFieldValue(`files.${placeInState}[0].id`, id);
        setFieldValue(`files.${placeInState}[0].name`, file.name);
      } catch (e) {}
    } else {
      setFieldValue(`files.${placeInState}`, []);
    }
  };
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const onRowAdd = (
    newData: DeputyHeadType,
    deputyHeads1: Array<DeputyHeadType>,
    setFieldValue: (s: string, ar: Array<DeputyHeadType>) => void
  ) =>
    new Promise<void>((resolve) => {
      const newDataCopy = {
        ...newData,
        dateBirth: format(new Date(String(newData.dateBirth)), 'dd.MM.yyyy'),
        dateAppointment: format(
          new Date(String(newData.dateAppointment)),
          'dd.MM.yyyy'
        ),
      };
      setTimeout(() => {
        resolve();
        setFieldValue('deputyHeads', [...deputyHeads1, newDataCopy]);
      }, 600);
    });
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const onRowUpdate = (
    newData: DeputyHeadType,
    oldData: DeputyHeadType | undefined,
    deputyHeads1: Array<DeputyHeadType>,
    setFieldValue: (s: string, ar: Array<DeputyHeadType>) => void
  ) =>
    new Promise<void>((resolve) => {
      const newDataCopy = {
        ...newData,
        dateBirth: newData.dateBirth?.match(/[0-9]{2}\.[0-9]{2}\.[0-9]{4}/)
          ? newData.dateBirth
          : format(new Date(String(newData.dateBirth)), 'dd.MM.yyyy'),
        dateAppointment: newData.dateAppointment?.match(
          /[0-9]{2}\.[0-9]{2}\.[0-9]{4}/
        )
          ? newData.dateAppointment
          : format(new Date(String(newData.dateAppointment)), 'dd.MM.yyyy'),
      };

      setTimeout(() => {
        resolve();
        if (oldData) {
          const deputyHeads = [...deputyHeads1];
          deputyHeads[deputyHeads.indexOf(oldData)] = newDataCopy;
          setFieldValue('deputyHeads', deputyHeads);
        }
      }, 600);
    });
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const onRowDelete = (
    i: number,
    deputyHeads1: Array<DeputyHeadType>,
    setFieldValue: (s: string, ar: Array<DeputyHeadType>) => void
  ) => {
    setTimeout(() => {
      const deputyHeads = [...deputyHeads1];
      deputyHeads.splice(i, 1);
      setFieldValue('deputyHeads', deputyHeads);
    }, 600);
  };

  const handleChangeHeadPhoto = async (
    value: RequestFileType,
    setFieldValue: (field: string, value: string) => void
  ) => {
    if (value) {
      try {
        const {
          data: {
            payload: { id, link },
          },
        } = await api.post(endpoints.organizationFile(), value);
        setFieldValue(`head.photo.id`, id);
        setFieldValue(`head.photo.link`, link);
      } catch (e) {}
    } else {
      setFieldValue(`head.photo.content`, '');
    }
  };

  function setAddOn(name: string, checked: boolean) {
    let values = formik.values.addOn;
    if (checked && !values.includes(name)) {
      values.push(name);
    } else {
      if (!checked && values.includes(name)) {
        values = values.filter((t) => t !== name);
      }
    }
    formik.setFieldValue('addOn', values);
  }

  const convertDate = (date: string | null | undefined) => {
    if (!date) return '';
    if (date.match(date_regex)) {
      const parts = date.split('.');
      return parts[2] + '-' + parts[1] + '-' + parts[0];
    } else {
      return date;
    }
  };

  function VerticalHeader(item: TableHeader) {
    return <div className="table_header">{item.column.name}</div>;
  }

  function rowHeight(rows: readonly DeputyHeadType[], i: number): number {
    const k = window.outerWidth / 1920;
    return (
      Math.max(
        1,
        Math.floor((rows[i].lengthOfWork || '').length / (36 * k)) + 1,
        Math.floor((rows[i].fullName || '').length / (25 * k)) + 1,
        Math.floor((rows[i].position || '').length / (25 * k)) + 1
      ) *
        25 +
      10
    );
  }

  const handleSubmit: (formikState: CardDataTypes) => Promise<void> = async (
    formikState: CardDataTypes
  ): Promise<void> => {
    try {
      const dateMyDeputy = (str: string) => {
        if (!str) return '';
        const arr = str.split('.');
        const obj = new Date(
          parseInt(arr[2]),
          parseInt(arr[1]) - 1,
          parseInt(arr[0]) + 1
        );
        return obj.toISOString();
      };

      const deputyHeadsCopy = formikState.deputyHeads.map(
        (deputy: DeputyHeadType) => {
          return {
            ...deputy,
            dateBirth: dateMyDeputy(deputy.dateBirth as string),
            dateAppointment: dateMyDeputy(deputy.dateAppointment as string),
          };
        }
      );

      const dateMy = (str: string) => {
        const arr = str.split('-').reverse();
        const obj = new Date(
          parseInt(arr[2]),
          parseInt(arr[1]) - 1,
          parseInt(arr[0]) + 1
        );
        return obj.toISOString();
      };
      console.log({
        ...formikState,
        head: {
          ...formikState.head,
          dateBirth: dateMy(formikState.head.dateBirth as string),
          dateAppointment: dateMy(formikState.head.dateAppointment as string),
        },
        deputyHeads: deputyHeadsCopy,
      });
      await saveOrganizationCard(mainData.account.organizationID, {
        ...formikState,
        head: {
          ...formikState.head,
          dateBirth: dateMy(formikState.head.dateBirth as string),
          dateAppointment: dateMy(formikState.head.dateAppointment as string),
        },
        deputyHeads: deputyHeadsCopy,
      });

      toast.success('Данные успешно сохранены!');
    } catch (err) {
      toast.error('Не удалось сохранить данные!');
    }
  };

  function form_submit() {
    formik.validateForm(formik.values).then((errors) => {
      if (Object.keys(errors).length > 0) {
        const el = document.querySelectorAll('.Mui-error');
        if (el.length) {
          window.scrollTo({
            top:
              (el[0] as HTMLElement).getBoundingClientRect().top +
              window.pageYOffset -
              200,
            behavior: 'smooth',
          });
        }
      } else {
        handleSubmit(formik.values);
      }
    });
  }

  const formik = useFormik({
    initialValues: state,
    validationSchema,
    enableReinitialize: true,
    onReset: (values) => {
      // resetForm({ values: state });
    },
    onSubmit: (values) => {
      form_submit();
    },
  });
  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Page>
          <PageHeader title={'Информация об организации'} />
          <PageContent>
            <BlockTitle>Общее об учреждении</BlockTitle>
            <SeveralElem>
              <Input
                label="Полное наименование учреждения по Уставу:"
                id={'fullName'}
                name={'fullName'}
                value={formik.values.fullName}
                onChange={formik.handleChange}
                error={
                  !formik.touched.fullName && Boolean(formik.errors.fullName)
                }
                helperText={!formik.touched.fullName && formik.errors.fullName}
              />
              <Input
                label="Краткое наименование учреждения по Уставу:"
                id={'shortName'}
                name={'shortName'}
                value={formik.values.shortName}
                onChange={formik.handleChange}
                error={
                  !formik.touched.shortName && Boolean(formik.errors.shortName)
                }
                helperText={
                  !formik.touched.shortName && formik.errors.shortName
                }
              />
            </SeveralElem>
          </PageContent>
          <PageContent>
            <BlockTitle>Юридический адрес</BlockTitle>
            <SeveralElem>
              <Input
                label="Город:"
                id={'address.city'}
                name={'address.city'}
                value={formik.values.address.city}
                onChange={formik.handleChange}
                error={
                  !formik.touched.address?.city &&
                  Boolean(formik.errors.address?.city)
                }
                helperText={
                  !formik.touched.address?.city && formik.errors.address?.city
                }
              />
              <Input
                label="Улица:"
                id={'address.street'}
                name={'address.street'}
                value={formik.values.address.street}
                onChange={formik.handleChange}
                error={
                  !formik.touched.address?.street &&
                  Boolean(formik.errors.address?.street)
                }
                helperText={
                  !formik.touched.address?.street &&
                  formik.errors.address?.street
                }
              />
            </SeveralElem>
            <SeveralElem>
              <Input
                label="Индекс:"
                id={'address.ZIPCode'}
                name={'address.ZIPCode'}
                value={formik.values.address.ZIPCode}
                onChange={formik.handleChange}
                error={
                  !formik.touched.address?.ZIPCode &&
                  Boolean(formik.errors.address?.ZIPCode)
                }
                helperText={
                  !formik.touched.address?.ZIPCode &&
                  formik.errors.address?.ZIPCode
                }
              />
              <Input
                label="Дом:"
                id={'address.house'}
                name={'address.house'}
                value={formik.values.address.house}
                onChange={formik.handleChange}
                error={
                  !formik.touched.address?.house &&
                  Boolean(formik.errors.address?.house)
                }
                helperText={
                  !formik.touched.address?.house && formik.errors.address?.house
                }
              />
              <Input
                label="Корпус:"
                id={'address.housing'}
                name={'address.housing'}
                value={formik.values.address.housing}
                onChange={formik.handleChange}
                error={
                  !formik.touched.address?.housing &&
                  Boolean(formik.errors.address?.housing)
                }
                helperText={
                  !formik.touched.address?.housing &&
                  formik.errors.address?.housing
                }
              />
              <Input
                label="Строение:"
                id={'address.building'}
                name={'address.building'}
                value={formik.values.address.building}
                onChange={formik.handleChange}
                error={
                  !formik.touched.address?.building &&
                  Boolean(formik.errors.address?.building)
                }
                helperText={
                  !formik.touched.address?.building &&
                  formik.errors.address?.building
                }
              />
            </SeveralElem>
          </PageContent>
          <PageContent>
            <BlockTitle>Контактные данные</BlockTitle>
            <SeveralElem>
              <Input
                label="Телефон:"
                id={'phone.value'}
                name={'phone.value'}
                value={formik.values.phone.value}
                onChange={formik.handleChange}
                error={
                  !formik.touched.phone?.value &&
                  Boolean(formik.errors.phone?.value)
                }
                helperText={
                  !formik.touched.phone?.value && formik.errors.phone?.value
                }
              />
              <Input
                label="Электронная почта:"
                id={'email.value'}
                name={'email.value'}
                value={formik.values.email.value}
                onChange={formik.handleChange}
                error={
                  !formik.touched.email?.value &&
                  Boolean(formik.errors.email?.value)
                }
                helperText={
                  !formik.touched.email?.value && formik.errors.email?.value
                }
              />
              <Input
                label="Сайт организации:"
                id={'domain.value'}
                name={'domain.value'}
                value={formik.values.domain.value}
                onChange={formik.handleChange}
                error={
                  !formik.touched.domain?.value &&
                  Boolean(formik.errors.domain?.value)
                }
                helperText={
                  !formik.touched.domain?.value && formik.errors.domain?.value
                }
              />
            </SeveralElem>
          </PageContent>
          <Block>
            <BlockTitle>Документы</BlockTitle>
            <Load>
              <InputLabel style={{ textAlign: 'left', margin: '10px' }}>
                Уставные документы:
              </InputLabel>
              <UploadFile
                fileUploadHandler={(file, binaryFile, placeInState) =>
                  fileUploadHandler(
                    file,
                    binaryFile,
                    placeInState as FilesPlaceType,
                    setFieldValue
                  )
                }
                placeInState="docFile"
                fileName={formik.values.files.docFile[0]?.name}
              />
            </Load>
            <Load>
              <InputLabel style={{ textAlign: 'left', margin: '10px' }}>
                Образовательная лицензия:
              </InputLabel>
              <UploadFile
                fileUploadHandler={(file, binaryFile, placeInState) =>
                  fileUploadHandler(
                    file,
                    binaryFile,
                    placeInState as FilesPlaceType,
                    setFieldValue
                  )
                }
                placeInState="licenseFile"
                fileName={formik.values.files.licenseFile[0]?.name}
              />
            </Load>
            <Load>
              <InputLabel style={{ textAlign: 'left', margin: '10px' }}>
                Аккредитация:
              </InputLabel>
              <UploadFile
                fileUploadHandler={(file, binaryFile, placeInState) =>
                  fileUploadHandler(
                    file,
                    binaryFile,
                    placeInState as FilesPlaceType,
                    setFieldValue
                  )
                }
                placeInState="accreditationFile"
                fileName={formik.values.files.accreditationFile[0]?.name}
              />
            </Load>
            <Load>
              <InputLabel style={{ textAlign: 'left', margin: '10px' }}>
                Структура учреждения:
              </InputLabel>
              <UploadFile
                fileUploadHandler={(file, binaryFile, placeInState) =>
                  fileUploadHandler(
                    file,
                    binaryFile,
                    placeInState as FilesPlaceType,
                    setFieldValue
                  )
                }
                placeInState="structureFile"
                fileName={formik.values.files.structureFile[0]?.name}
              />
            </Load>
            <Load>
              <InputLabel style={{ textAlign: 'left', margin: '10px' }}>
                Приказ о назначении директора:
              </InputLabel>
              <UploadFile
                fileUploadHandler={(file, binaryFile, placeInState) =>
                  fileUploadHandler(
                    file,
                    binaryFile,
                    placeInState as FilesPlaceType,
                    setFieldValue
                  )
                }
                placeInState="appointmentFile"
                fileName={formik.values.files.appointmentFile[0]?.name}
              />
            </Load>
          </Block>
          <PageContent>
            <FormControl className={classes.formControl}>
              <BlockTitle>Дополнительные функции учреждения</BlockTitle>
              <Select
                name="addOn"
                multiple
                input={<InputFromUI />}
                renderValue={(selected: any) => (
                  <div className={classes.chips}>
                    {selected.map((value: string) => (
                      <Chip
                        key={value}
                        label={value}
                        className={classes.chip}
                      />
                    ))}
                  </div>
                )}
                value={formik.values.addOn}
              >
                {names.map((name: string) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox
                      name="addOn"
                      onChange={(e, checked) => {
                        setAddOn(name, checked);
                      }}
                      checked={formik.values.addOn.includes(name)}
                    />

                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </PageContent>
          {formik.values.addOn.indexOf('Иное') > -1 ? (
            <PageContent>
              <Input
                label="Иное:"
                id={'addOnClarification'}
                name={'addOnClarification'}
                value={formik.values.addOnClarification}
                onChange={formik.handleChange}
                error={Boolean(formik.errors.addOnClarification)}
                helperText={formik.errors.addOnClarification}
              />
            </PageContent>
          ) : (
            ''
          )}
          <PageContent>
            <HeaderContainer>
              <HeaderContainerLeftSide>
                <BlockTitle>Руководитель учреждения</BlockTitle>
                <SeveralElem>
                  <Input
                    label="Фамилия Имя Отчество:"
                    id={'head.fullName'}
                    name={'head.fullName'}
                    value={formik.values.head.fullName}
                    onChange={formik.handleChange}
                    error={Boolean(formik.errors.head?.fullName)}
                    helperText={formik.errors.head?.fullName}
                    style={{ width: '100%' }}
                  />
                  <DatePicker
                    label="Дата рождения:"
                    value={state.head.dateBirth}
                    key={state.head.dateBirth}
                    error={Boolean(formik.errors.head?.dateBirth)}
                    helperText={formik.errors.head?.dateBirth}
                    onChange={(data: string | null) => {
                      if (data && !Number.isNaN(Date.parse(data))) {
                        formik.setFieldValue('head.dateBirth', data);
                      } else {
                        formik.setFieldValue('head.dateBirth', '');
                      }
                    }}
                  />
                </SeveralElem>
                <SeveralElem>
                  <Input
                    label="Должность:"
                    id={'head.position'}
                    name={'head.position'}
                    value={formik.values.head.position}
                    onChange={formik.handleChange}
                    error={
                      !formik.touched.head?.position &&
                      Boolean(formik.errors.head?.position)
                    }
                    helperText={
                      !formik.touched.head?.position &&
                      formik.errors.head?.position
                    }
                    style={{ width: '100%' }}
                  />
                  <DatePicker
                    label="Дата назначения на должность:"
                    value={state.head.dateAppointment}
                    key={state.head.dateAppointment}
                    error={
                      !formik.touched.head?.dateAppointment &&
                      Boolean(formik.errors.head?.dateAppointment)
                    }
                    helperText={
                      !formik.touched.head?.dateAppointment &&
                      formik.errors.head?.dateAppointment
                    }
                    onChange={(data: string | null) => {
                      if (data && !Number.isNaN(Date.parse(data))) {
                        formik.setFieldValue('head.dateAppointment', data);
                      } else {
                        formik.setFieldValue('head.dateAppointment', '');
                      }
                    }}
                  />

                  <Input
                    label="Стаж в должности руководителя данной организации:"
                    id={'head.lengthOfWork'}
                    name={'head.lengthOfWork'}
                    value={formik.values.head.lengthOfWork}
                    onChange={formik.handleChange}
                    error={
                      !formik.touched.head?.lengthOfWork &&
                      Boolean(formik.errors.head?.lengthOfWork)
                    }
                    helperText={
                      !formik.touched.head?.lengthOfWork &&
                      formik.errors.head?.lengthOfWork
                    }
                    style={{ width: '100%' }}
                  />
                </SeveralElem>
                <SeveralElem>
                  <Input
                    label="Электронная почта:"
                    id={'head.email'}
                    name={'head.email'}
                    value={formik.values.head.email}
                    onChange={formik.handleChange}
                    error={
                      !formik.touched.head?.email &&
                      Boolean(formik.errors.head?.email)
                    }
                    helperText={
                      !formik.touched.head?.email && formik.errors.head?.email
                    }
                  />
                  <Input
                    label="Телефон рабочий:"
                    id={'head.phoneWork'}
                    name={'head.phoneWork'}
                    value={formik.values.head.phoneWork}
                    onChange={formik.handleChange}
                    error={
                      !formik.touched.head?.phoneWork &&
                      Boolean(formik.errors.head?.phoneWork)
                    }
                    helperText={
                      !formik.touched.head?.phoneWork &&
                      formik.errors.head?.phoneWork
                    }
                  />
                  <Input
                    label="Телефон мобильный:"
                    id={'head.phoneMobile'}
                    name={'head.phoneMobile'}
                    value={formik.values.head.phoneMobile}
                    onChange={formik.handleChange}
                    error={
                      !formik.touched.head?.phoneMobile &&
                      Boolean(formik.errors.head?.phoneMobile)
                    }
                    helperText={
                      !formik.touched.head?.phoneMobile &&
                      formik.errors.head?.phoneMobile
                    }
                  />
                </SeveralElem>
              </HeaderContainerLeftSide>
              <HeaderContainerRightSide>
                <UploadImage
                  value={getIn(formik.values, 'head.photo')}
                  onUpload={(file) => {
                    handleChangeHeadPhoto(file, setFieldValue);
                  }}
                  onRemove={() => {
                    formik.setFieldValue('head.photo', {});
                  }}
                />
              </HeaderContainerRightSide>
            </HeaderContainer>
          </PageContent>
          <FullTable>
            <span className="organization_table">
              <EditableTable
                headerRowHeight={70}
                columns={[
                  { name: 'ФИО', key: 'fullName' },
                  {
                    name: 'Дата рождения',
                    key: 'dateBirth',
                    width: 140,
                  },
                  { name: 'Должность', key: 'position' },
                  {
                    name: 'Дата назначения на должность',
                    key: 'dateAppointment',
                    width: 160,
                    headerRenderer: VerticalHeader,
                  },
                  {
                    name: 'Стаж в должности заместителя руководителя данной организации',
                    key: 'lengthOfWork',
                    width: 200,
                    headerRenderer: VerticalHeader,
                  },
                  { name: 'Телефон рабочий', key: 'phoneWork' },
                  { name: 'Телефон мобильный', key: 'phoneMobile' },
                  { name: 'Электронная почта', key: 'email' },
                ]}
                onDeleteRow={(i: number) => {
                  onRowDelete(i, formik.values.deputyHeads, setFieldValue);
                }}
                autoWidth={true}
                autoHeight={true}
                rows={formik.values.deputyHeads}
                rowHeight={rowHeight}
                viewOnly={true}
                lineHeight={20}
                onEditHandler={(props: DeputyHeadTypeRow) => {
                  openEditHandler(props, formik.values.deputyHeads);
                }}
              />
            </span>
            <span
              style={{
                position: 'absolute',
                top: '15px',
                right: '2%',
                cursor: 'pointer',
              }}
            >
              <AddCircleOutlineIcon
                onClick={() => {
                  openAddHandler();
                }}
                style={{ width: '25px', height: '25px' }}
              />
            </span>
            <Drawer
              isOpenMenu={isShowEditDrawer}
              title={isEditing ? 'Изменить строку' : 'Добавить строку'}
              onCloseMenu={closeDrawerHandler}
            >
              <Input
                label={'ФИО'}
                value={value.fullName || ''}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setValue({ ...value, fullName: event.target.value })
                }
              />
              <DatePicker
                label="Дата рождения"
                variant="standard"
                value={convertDate(currentRow?.dateBirth)}
                onChange={(data: string | null) => {
                  if (data && !Number.isNaN(Date.parse(data))) {
                    setValue({ ...value, dateBirth: data });
                  } else {
                    setValue({ ...value, dateBirth: '' });
                  }
                }}
              />
              <Input
                label={'Должность'}
                value={value.position || ''}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setValue({ ...value, position: event.target.value })
                }
              />
              <DatePicker
                label="Дата назначения на должность"
                value={convertDate(value.dateAppointment)}
                onChange={(data: string | null) => {
                  if (data && !Number.isNaN(Date.parse(data))) {
                    setValue({ ...value, dateAppointment: data });
                  } else {
                    setValue({ ...value, dateAppointment: '' });
                  }
                }}
              />
              <Input
                label={
                  'Стаж в должности заместителя руководителя данной организации'
                }
                value={value.lengthOfWork || ''}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setValue({ ...value, lengthOfWork: event.target.value })
                }
              />
              <Input
                label={'Телефон рабочий'}
                value={value.phoneWork || ''}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setValue({ ...value, phoneWork: event.target.value })
                }
              />
              <Input
                label={'Телефон мобильный'}
                value={value.phoneMobile || ''}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setValue({ ...value, phoneMobile: event.target.value })
                }
              />
              <Input
                label={'Электронная почта'}
                value={value.email || ''}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setValue({ ...value, email: event.target.value })
                }
              />
              <Button
                onClick={() => changeRowHandler(formik.values, setFieldValue)}
                disabled={
                  !value.dateBirth || !value.dateAppointment || !value.fullName
                }
              >
                {isEditing ? 'Изменить' : 'Добавить'}
              </Button>
              <Button onClick={() => setIsShowEditDrawer(false)}>
                Отменить
              </Button>
            </Drawer>
          </FullTable>
          <BtnContainer>
            <Button size="medium" onClick={form_submit}>
              Сохранить
            </Button>
          </BtnContainer>
        </Page>
      </form>
    </>
  );
};
