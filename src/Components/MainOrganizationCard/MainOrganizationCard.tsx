import { TextFieldProps } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import {
  Button,
  DatePicker,
  EditableTable,
  InformationBlock,
  Input,
  Page,
  PageContent,
  PageHeader,
  Select,
  UploadFile,
} from '@sas/ui-kit';
import { RowProps } from '@sas/ui-kit/dist/Table/types';
import { format, parse } from 'date-fns';
import { getIn, useFormik } from 'formik';
import React, { FC, useEffect, useState } from 'react';
import { FileWithPath } from 'react-dropzone';
import InputMask from 'react-input-mask';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { api, endpoints } from '../../api';
import { emailRegExp, nameRegExp, phoneRegExp } from '../../helpers/regExp';
import { UploadImage } from '../ui/UploadImage';
import { RequestFileType } from '../ui/UploadImage/UploadImage';
import {
  getAdditionalValues,
  getOrganizationCard,
  saveFile,
  saveOrganizationCard,
} from './api';
import DrawerForTable from './DrawerForTable';
import { initialFiles, initialValues } from './helper';
import './style.css';
import {
  BtnContainer,
  ErrorDiv,
  FullTable,
  HiddenLabel,
  InputContainer,
  InputLabel,
  InputLeftPosition,
  InputWithError,
  InputWithLabel,
  LeftSideContainer,
  RightSideContainer,
  TextFieldForPhone,
} from './styled';
import {
  AllFileType,
  DeputyHeadType,
  DeputyType,
  FilesPlaceType,
  TableHeader,
} from './types';

const validationSchema = yup.object({
  fullName: yup.string().required('Обязательное поле'),
  shortName: yup.string().required('Обязательное поле'),
  addOnClarification: yup.string().when('addOn', {
    is: (values) => {
      return values.includes('Иное');
    },
    then: yup.string().required('Обязательное поле'),
    otherwise: yup.string(),
  }),
  address: yup.object({
    city: yup
      .string()
      .matches(/^[a-zA-zа-яА-я\s\-]+$/g, 'Некорректное значение')
      .required('Обязательное поле'),
    street: yup.string().required('Обязательное поле'),
    ZIPCode: yup
      .string()
      .matches(/^[0-9\s\-]+$/g, 'Только цифры')
      .min(6, 'Введите корректный индекс,длинною в 6 цифр')
      .max(6, 'Введите корректный индекс,длинною в 6 цифр')
      .typeError('Введите корректный индекс')
      .required('Обязательное поле'),
    house: yup.string().required('Обязательное поле'),
  }),
  email: yup
    .string()
    .matches(emailRegExp, 'Некорректно заполненное поле E-mail')
    .required('Обязательное поле'),

  domain: yup.string().required('Обязательное поле'),
  phone: yup
    .string()
    .matches(phoneRegExp, 'Некорректно заполненное поле Телефон')
    .required('Обязательное поле'),
  head: yup.object({
    position: yup
      .string()
      .max(500, 'Максимум 500 символов')
      .required('Обязательное поле'),
    dateAppointment: yup.date().nullable().required('Обязательное поле'),
    dateBirth: yup
      .date()
      .min('1900-01-11T00:00:00Z', 'Некорректная дата')
      .max(new Date(), 'Некорректная дата')
      .nullable()
      .required('Обязательное поле'),
    fullName: yup
      .string()
      .max(150, 'Максимум 150 символов')
      .matches(nameRegExp, 'Не корректно заполненное поле ФИО')
      .required('Поле ФИО обязательно для заполнения'),
    email: yup
      .string()
      .matches(emailRegExp, 'Некорректно заполненное поле E-mail')
      .required('Обязательное поле'),
    phoneWork: yup
      .string()
      .matches(phoneRegExp, 'Некорректно заполненное поле Телефон')
      .required('Обязательное поле'),
    phoneMobile: yup
      .string()
      .matches(phoneRegExp, 'Некорректно заполненное поле Телефон')
      .required('Обязательное поле'),
    lengthOfWork: yup
      .number()
      .typeError('Укажите число')
      .required('Обязательное поле'),
  }),
});
export const MainOrganizationCard: FC = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [formikValue, setFormikValue] = useState(initialValues);
  const [currentDeputyHead, setCurrentDeputyHead] = useState<DeputyType[]>([]);
  const [targetRow, setTargetRow] = useState<number | null>(null);
  const [files, setFiles] = useState<AllFileType>(initialFiles);
  const [names, setNames] = useState<string[]>([]);

  function VerticalHeader(item: TableHeader) {
    return <div className="table_header">{item.column.name}</div>;
  }

  const organizationId = Number(localStorage.getItem('organizationId'));

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
        const { data } = await getOrganizationCard(organizationId);
        setFormikValue({
          ...data.payload,
          addOn: data.payload.addOn !== null ? data.payload.addOn : [],
        });
        setFiles(data.payload.files);
        setCurrentDeputyHead(
          data.payload.deputyHeads.map(
            (el: { dateAppointment: string; dateBirth: string }) => {
              return {
                ...el,
                dateAppointment: format(
                  new Date(el.dateAppointment),
                  `dd.MM.yyyy`
                ),
                dateBirth: format(new Date(el.dateBirth), `dd.MM.yyyy`),
              };
            }
          )
        );
      } catch (err) {
      }
    })();
  }, [organizationId]);

  const setFieldValue = (
    path: string,
    value: string | [] | DeputyHeadType[]
  ) => {
    formik.setFieldValue(path, value);
  };
  const fileUploadHandler = async (
    file: FileWithPath | null,
    binaryFile: string | null | ArrayBuffer,
    placeInState: FilesPlaceType
  ) => {
    if (file) {
      const { data } = await saveFile(file.name, binaryFile || '', file.size);
      const { id, name, link, size } = data.payload;
      setFiles((prevState) => ({
        ...prevState,
        [placeInState]: { id, name, link, size },
      }));
    } else {
      setFiles((prevState) => ({
        ...prevState,
        [placeInState]: null,
      }));
    }
  };

  const handleChangeHeadPhoto = async (value: RequestFileType) => {
    if (value) {
      try {
        const {
          data: {
            payload: { id, link, name, size },
          },
        } = await api.post(endpoints.organizationFile(), value);
        setFieldValue(`head.photo.id`, id);
        setFieldValue(`head.photo.link`, link);
        setFieldValue(`head.photo.size`, size);
        setFieldValue('head.photo.name', name);
      } catch (e) {}
    } else {
      setFieldValue(`head.photo.content`, '');
    }
  };
  const scrollToError = () => {
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
  };
  const addDeputyHandler = () => {
    setOpenDrawer((prev) => !prev);
    setTargetRow(null);
  };
  const editRow = (props: RowProps) => {
    setTargetRow(props.rowIdx);
    setOpenDrawer(true);
  };
  const deleteRow = (index: number) => {
    setCurrentDeputyHead((prevState) =>
      prevState.filter((el, i) => {
        return i !== index;
      })
    );
  };
  const submitForm = async () => {
    try {
      const { data } = await saveOrganizationCard(organizationId, {
        ...formik.values,
        head: {
          ...formik.values.head,
          lengthOfWork: Number(formik.values.head.lengthOfWork),
        },
        files: files,
        deputyHeads: currentDeputyHead.map((el) => {
          const dateBirth = parse(el.dateBirth, 'dd.MM.yyyy', new Date());
          const resultBirth = format(dateBirth, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
          const dateAppointment = parse(
            el.dateAppointment,
            'dd.MM.yyyy',
            new Date()
          );
          const resultDateAppointment = format(
            dateAppointment,
            "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
          );
          return {
            ...el,
            dateBirth: resultBirth,
            dateAppointment: resultDateAppointment,
          };
        }),
      });

      if (data.error) {
        const error = JSON.parse(data.error as string);
        const keys = Object.keys(error);
        keys.forEach((el) => {
          formik.setFieldError(el, error[el]);
        });
        if (Object.keys(formik.errors).length > 0) {
          scrollToError();
        }
      } else {
        toast.success('Данные успешно обновленны');
      }
    } catch (e) {
      toast.error('Произошла ошибка, попробуйте повторить попытку позже!')
    }
  };

  const formik = useFormik({
    initialValues: formikValue,
    validationSchema,
    enableReinitialize: true,
    onSubmit: submitForm,
  });

  useEffect(() => {
    if (!formik.values.addOn.includes('Иное')) {
      formik.setFieldValue('addOnClarification', '');
    }
  }, [formik.values.addOn]);

  return (
    <Page>
      <PageHeader title={'Информация об организации'} />
      <PageContent>
        <InformationBlock markdown={'Общее об учреждении'} />
        <InputContainer>
          <Input
            label="Полное наименование учреждения по Уставу"
            name="fullName"
            value={formik.values.fullName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.fullName && Boolean(formik.errors.fullName)}
            helperText={formik.touched.fullName && formik.errors.fullName}
          />
          <Input
            label="Краткое наименование учреждения по Уставу"
            name="shortName"
            value={formik.values.shortName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.shortName && Boolean(formik.errors.shortName)}
            helperText={formik.touched.shortName && formik.errors.shortName}
          />
        </InputContainer>
      </PageContent>
      <PageContent>
        <InformationBlock markdown={'Юридический адрес'} />
        <InputContainer>
          <Input
            label="Город"
            name="address.city"
            value={formik.values.address.city}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.address?.city &&
              Boolean(formik.errors.address?.city)
            }
            helperText={
              formik.touched.address?.city && formik.errors.address?.city
            }
          />
          <Input
            label="Улица"
            name="address.street"
            value={formik.values.address.street}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.address?.street &&
              Boolean(formik.errors.address?.street)
            }
            helperText={
              formik.touched.address?.street && formik.errors.address?.street
            }
          />
        </InputContainer>
        <InputContainer>
          <Input
            label="Индекс"
            name="address.ZIPCode"
            value={formik.values.address.ZIPCode}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.address?.ZIPCode &&
              Boolean(formik.errors.address?.ZIPCode)
            }
            helperText={
              formik.touched.address?.ZIPCode && formik.errors.address?.ZIPCode
            }
          />
          <Input
            label="Дом"
            name="address.house"
            value={formik.values.address.house}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.address?.house &&
              Boolean(formik.errors.address?.house)
            }
            helperText={
              formik.touched.address?.house && formik.errors.address?.house
            }
          />
          <Input
            label="Корпус"
            name="address.housing"
            value={formik.values.address.housing}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.address?.housing &&
              Boolean(formik.errors.address?.housing)
            }
            helperText={
              formik.touched.address?.housing && formik.errors.address?.housing
            }
          />
          <Input
            label="Строение"
            name="address.building"
            value={formik.values.address.building}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.address?.building &&
              Boolean(formik.errors.address?.building)
            }
            helperText={
              formik.touched.address?.building &&
              formik.errors.address?.building
            }
          />
        </InputContainer>
      </PageContent>
      <PageContent>
        <InformationBlock markdown="Контактные данные" />
        <InputContainer>
          <InputWithError>
            <InputMask
              mask="+7 (999) 999-99-99"
              name={'phone'}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.phone}
            >
              {(inputProps: JSX.IntrinsicAttributes & TextFieldProps) => (
                <TextFieldForPhone
                  {...inputProps}
                  label={'Мобильный телефон'}
                  variant="outlined"
                  type="tel"
                />
              )}
            </InputMask>
            {formik.touched.phone && formik.errors.phone ? (
              <ErrorDiv>{formik.errors.phone}</ErrorDiv>
            ) : null}
          </InputWithError>
          <Input
            label="Электронная почта"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <Input
            label="Сайт организации"
            name="domain"
            value={formik.values.domain}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.domain && Boolean(formik.errors.domain)}
            helperText={formik.touched.domain && formik.errors.domain}
          />
        </InputContainer>
      </PageContent>
      <PageContent>
        <InformationBlock markdown="Документы" />
        <InputLabel>Уставные документы:</InputLabel>
        <UploadFile
          fileUploadHandler={(file, binaryFile, placeInState) =>
            fileUploadHandler(file, binaryFile, placeInState as FilesPlaceType)
          }
          placeInState="doc"
          fileName={files.doc?.name}
        />
        <InputLabel>Образовательная лицензия:</InputLabel>
        <UploadFile
          fileUploadHandler={(file, binaryFile, placeInState) =>
            fileUploadHandler(file, binaryFile, placeInState as FilesPlaceType)
          }
          placeInState="license"
          fileName={files.license?.name}
        />
        <InputLabel>Аккредитация:</InputLabel>
        <UploadFile
          fileUploadHandler={(file, binaryFile, placeInState) =>
            fileUploadHandler(file, binaryFile, placeInState as FilesPlaceType)
          }
          placeInState="accreditationFile"
          fileName={files.accreditation?.name}
        />
        <InputLabel>Структура учреждения:</InputLabel>
        <UploadFile
          fileUploadHandler={(file, binaryFile, placeInState) =>
            fileUploadHandler(file, binaryFile, placeInState as FilesPlaceType)
          }
          placeInState="structure"
          fileName={files.structure?.name}
        />
        <InputLabel>Приказ о назначении директора:</InputLabel>
        <UploadFile
          fileUploadHandler={(file, binaryFile, placeInState) =>
            fileUploadHandler(file, binaryFile, placeInState as FilesPlaceType)
          }
          placeInState="appointment"
          fileName={files.appointment?.name}
        />
      </PageContent>
      <PageContent>
        <InformationBlock markdown="Дополнительные функции учреждения" />
        <Select
          label="Дополнительные функции учреждения"
          options={names}
          multiple
          value={formik.values.addOn}
          onChange={(e) => {
            formik.setFieldValue('addOn', e.target.value);
          }}
        />
        {formik.values.addOn !== null && formik.values.addOn.includes('Иное') && (
          <InputLeftPosition>
            <Input
              label="Иное:"
              name="addOnClarification"
              value={formik.values.addOnClarification}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.addOnClarification &&
                Boolean(formik.errors.addOnClarification)
              }
              helperText={
                formik.touched.addOnClarification &&
                formik.errors.addOnClarification
              }
            />
          </InputLeftPosition>
        )}
      </PageContent>

      <PageContent>
        <InputContainer>
          <LeftSideContainer>
            <InformationBlock markdown="Руководитель учреждения" />
            <InputContainer>
              <Input
                label="ФИО"
                name="head.fullName"
                value={formik.values.head.fullName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.head?.fullName &&
                  Boolean(formik.errors.head?.fullName)
                }
                helperText={
                  formik.touched.head?.fullName && formik.errors.head?.fullName
                }
              />
              <Input
                label="Должность"
                id={'head.position'}
                name="head.position"
                value={formik.values.head.position}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                error={
                  formik.touched.head?.position &&
                  Boolean(formik.errors.head?.position)
                }
                helperText={
                  formik.touched.head?.position && formik.errors.head?.position
                }
              />
            </InputContainer>
            <InputContainer>
              <InputWithLabel>
                <InputLabel>Дата рождения</InputLabel>
                <DatePicker
                  name="head.dateBirth"
                  value={formik.values.head.dateBirth}
                  key={formik.values.head.dateBirth}
                  onChange={(data: string | null) => {
                    if (data && !Number.isNaN(Date.parse(data))) {
                      formik.setFieldValue('head.dateBirth', data);
                    } else {
                      formik.setFieldValue('head.dateBirth', '');
                    }
                  }}
                  onBlurCapture={formik.handleBlur}
                  error={
                    formik.touched.head?.dateBirth &&
                    Boolean(formik.errors.head?.dateBirth)
                  }
                  helperText={
                    formik.touched.head?.dateBirth &&
                    formik.errors.head?.dateBirth
                  }
                />
              </InputWithLabel>
              <InputWithLabel>
                <InputLabel>Дата назначения на должность:</InputLabel>
                <DatePicker
                  name="head.dateAppointment"
                  value={formik.values.head.dateAppointment}
                  key={formik.values.head.dateAppointment}
                  error={
                    formik.touched.head?.dateAppointment &&
                    Boolean(formik.errors.head?.dateAppointment)
                  }
                  helperText={
                    formik.touched.head?.dateAppointment &&
                    formik.errors.head?.dateAppointment
                  }
                  onBlurCapture={formik.handleBlur}
                  onChange={(data: string | null) => {
                    if (data && !Number.isNaN(Date.parse(data))) {
                      formik.setFieldValue('head.dateAppointment', data);
                    } else {
                      formik.setFieldValue('head.dateAppointment', '');
                    }
                  }}
                />
              </InputWithLabel>
              <InputWithLabel>
                <HiddenLabel>'mok'</HiddenLabel>
                <Input
                  label="Стаж в должности руководителя  организации"
                  name="head.lengthOfWork"
                  value={formik.values.head.lengthOfWork}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.head?.lengthOfWork &&
                    Boolean(formik.errors.head?.lengthOfWork)
                  }
                  helperText={
                    formik.touched.head?.lengthOfWork &&
                    formik.errors.head?.lengthOfWork
                  }
                />
              </InputWithLabel>
            </InputContainer>
            <InputContainer>
              <Input
                label="Электронная почта"
                name="head.email"
                value={formik.values.head.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.head?.email &&
                  Boolean(formik.errors.head?.email)
                }
                helperText={
                  formik.touched.head?.email && formik.errors.head?.email
                }
              />
              <InputWithError>
                <InputMask
                  mask="+7 (999) 999-99-99"
                  name={'head.phoneWork'}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.head.phoneWork}
                >
                  {(inputProps: JSX.IntrinsicAttributes & TextFieldProps) => (
                    <TextFieldForPhone
                      {...inputProps}
                      label={'Рабочий телефон'}
                      variant="outlined"
                      type="tel"
                    />
                  )}
                </InputMask>
                {formik.touched.head?.phoneWork &&
                formik.errors.head?.phoneWork ? (
                  <ErrorDiv>{formik.errors.head?.phoneWork}</ErrorDiv>
                ) : null}
              </InputWithError>
              <InputWithError>
                <InputMask
                  mask="+7 (999) 999-99-99"
                  name={'head.phoneMobile'}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.head.phoneMobile}
                >
                  {(inputProps: JSX.IntrinsicAttributes & TextFieldProps) => (
                    <TextFieldForPhone
                      {...inputProps}
                      label={'Мобильный телефон'}
                      variant="outlined"
                      type="tel"
                    />
                  )}
                </InputMask>
                {formik.touched.head?.phoneMobile &&
                formik.errors.head?.phoneMobile ? (
                  <ErrorDiv>{formik.errors.head?.phoneMobile}</ErrorDiv>
                ) : null}
              </InputWithError>
            </InputContainer>
          </LeftSideContainer>
          <RightSideContainer>
            <UploadImage
              value={getIn(formik.values, 'head.photo')}
              onUpload={handleChangeHeadPhoto}
              onRemove={() => {
                formik.setFieldValue('head.photo', null);
              }}
            />
          </RightSideContainer>
        </InputContainer>
      </PageContent>
      <FullTable>
        <EditableTable
          columns={[
            { name: 'ФИО', key: 'fullName' },
            {
              name: 'Дата рождения',
              key: 'dateBirth',
              width: 120,
              headerRenderer: VerticalHeader,
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
          rows={currentDeputyHead}
          autoWidth={true}
          autoHeight={true}
          viewOnly={true}
          headerRowHeight={70}
          rowHeight={40}
          lineHeight={20}
          onEditHandler={editRow}
          onDeleteRow={deleteRow}
        />
        <span className="add-icon-wrapper">
          <AddCircleOutlineIcon
            className="add-icon"
            onClick={addDeputyHandler}
          />
        </span>
        {openDrawer && (
          <DrawerForTable
            isOpen={openDrawer}
            setOpen={setOpenDrawer}
            title={
              targetRow === null ? 'Добавить строку' : 'Редактировать строку'
            }
            value={currentDeputyHead}
            setValue={setCurrentDeputyHead}
            targetRow={targetRow}
            setTargetRow={setTargetRow}
          />
        )}
      </FullTable>
      <BtnContainer>
        <Button onClick={formik.submitForm}>Сохранить</Button>
      </BtnContainer>
    </Page>
  );
};
