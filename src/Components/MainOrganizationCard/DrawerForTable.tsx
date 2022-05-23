import { InputLabel, TextFieldProps } from '@material-ui/core';
import { Button, DatePicker, Drawer, Input } from '@sas/ui-kit';
import { format, parse } from 'date-fns';
import { useFormik } from 'formik';
import React, { FC, useEffect, useState } from 'react';
import InputMask from 'react-input-mask';
import * as yup from 'yup';
import { emailRegExp, nameRegExp, phoneRegExp } from '../../helpers/regExp';
import { saveDeputyStaff } from '../TablerComponents/OrganizationCard/api';
import { initialDeputy } from './helper';
import {
  ErrorDiv,
  InputWithError,
  InputWithLabel,
  TextFieldForPhone,
} from './styled';
import { DeputyType } from './types';

type PropsType = {
  isOpen: boolean;
  title: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  value: DeputyType[];
  setValue: React.Dispatch<React.SetStateAction<DeputyType[]>>;
  targetRow: number | null;
  setTargetRow: React.Dispatch<React.SetStateAction<number | null>>;
};
const validationSchema = yup.object({
  fullName: yup
    .string()
    .max(150, 'Максимум 150 символов')
    .matches(nameRegExp, 'Не корректно заполненное поле ФИО')
    .required('Поле ФИО обязательно для заполнения'),
  position: yup.string().required('Обязательное поле'),
  email: yup
    .string()
    .matches(emailRegExp, 'Некорректно заполненное поле E-mail')
    .required('Обязательное поле'),

  phoneMobile: yup
    .string()
    .matches(phoneRegExp, 'Некорректно заполненное поле Телефон')
    .required('Обязательное поле'),
  phoneWork: yup
    .string()
    .matches(phoneRegExp, 'Некорректно заполненное поле Телефон')
    .required('Обязательное поле'),
  dateBirth: yup
    .date()
    .min('1900-01-11T00:00:00Z', 'Некорректная дата')
    .max(new Date(), 'Некорректная дата')
    .required('Обязательное поле'),
  dateAppointment: yup.date().required('Обязательное поле'),
  lengthOfWork: yup.number().required('Обязательное поле'),
});

const DrawerForTable: FC<PropsType> = ({
  isOpen,
  setOpen,
  title,
  value,
  setValue,
  targetRow,
  setTargetRow,
}) => {
  const [initialState, setInitialState] = useState(initialDeputy);
  const changeDate = (value: DeputyType[], targetRow: number) => {
    const el = value[targetRow];
    const dateBirth = parse(el.dateBirth, 'dd.MM.yyyy', new Date());
    const resultBirth = format(dateBirth, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
    const dateAppointment = parse(el.dateAppointment, 'dd.MM.yyyy', new Date());
    const resultDateAppointment = format(
      dateAppointment,
      "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
    );
    return {
      ...el,
      dateBirth: resultBirth,
      dateAppointment: resultDateAppointment,
    };
  };

  useEffect(() => {
    if (targetRow !== null) {
      setInitialState(changeDate(value, targetRow));
    }
  }, []);
  const formSubmit = async () => {
    const { data } = await saveDeputyStaff({
      ...formik.values,
      lengthOfWork: Number(formik.values.lengthOfWork),
    });
    if (data.error) {
      const error = JSON.parse(data.error as string);
      const keys = Object.keys(error);
      keys.forEach((el) => {
        formik.setFieldError(el, error[el]);
      });
    } else {
      const result = {
        ...formik.values,
        lengthOfWork: Number(formik.values.lengthOfWork),
        dateAppointment: format(
          new Date(formik.values.dateAppointment),
          `dd.MM.yyyy`
        ),
        dateBirth: format(new Date(formik.values.dateBirth), `dd.MM.yyyy`),
      };
      if (targetRow === null) {
        setValue((prevState) => [...prevState, result]);
        formik.resetForm();
      } else {
        setValue((prevState) => {
          return prevState.map((el, index) => {
            return index === targetRow ? result : el;
          });
        });
        setTargetRow(null);
      }

      setOpen((prevState) => !prevState);
    }
  };

  const formik = useFormik({
    initialValues: initialState,
    validationSchema,
    enableReinitialize: true,
    onSubmit: formSubmit,
  });
  return (
    <Drawer
      isOpenMenu={isOpen}
      onCloseMenu={() => setOpen((prevState) => !prevState)}
      title={title}
    >
      <Input
        label={'ФИО'}
        name="fullName"
        value={formik.values?.fullName}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched?.fullName && Boolean(formik.errors?.fullName)}
        helperText={formik.touched?.fullName && formik.errors?.fullName}
      />
      <InputWithLabel>
        <InputLabel>Дата рождения:</InputLabel>
        <DatePicker
          name={'dateBirth'}
          value={formik.values?.dateBirth}
          key={formik.values.dateBirth}
          onChange={(data: string | null) => {
            if (data && !Number.isNaN(Date.parse(data))) {
              formik.setFieldValue('dateBirth', data);
            } else {
              formik.setFieldValue('dateBirth', '');
            }
          }}
          onBlurCapture={formik.handleBlur}
          error={formik.touched.dateBirth && Boolean(formik.errors.dateBirth)}
          helperText={formik.touched.dateBirth && formik.errors.dateBirth}
        />
      </InputWithLabel>
      <Input
        label={'Должность'}
        name="position"
        value={formik.values?.position}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.position && Boolean(formik.errors.position)}
        helperText={formik.touched.position && formik.errors.position}
      />
      <InputWithLabel>
        <InputLabel>Дата назначения на должность:</InputLabel>
        <DatePicker
          name={'dateAppointment'}
          value={formik.values?.dateAppointment}
          key={formik.values.dateAppointment}
          onChange={(data: string | null) => {
            if (data && !Number.isNaN(Date.parse(data))) {
              formik.setFieldValue('dateAppointment', data);
            } else {
              formik.setFieldValue('dateAppointment', '');
            }
          }}
          onBlurCapture={formik.handleBlur}
          error={
            formik.touched.dateAppointment &&
            Boolean(formik.errors.dateAppointment)
          }
          helperText={
            formik.touched.dateAppointment && formik.errors.dateAppointment
          }
        />
      </InputWithLabel>
      <Input
        label={'Стаж в должности'}
        name="lengthOfWork"
        value={formik.values?.lengthOfWork}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={
          formik.touched.lengthOfWork && Boolean(formik.errors.lengthOfWork)
        }
        helperText={formik.touched.lengthOfWork && formik.errors.lengthOfWork}
      />
      <InputWithError>
        <InputMask
          mask="+7 (999) 999-99-99"
          name={'phoneWork'}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.phoneWork}
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
        {formik.touched.phoneWork && formik.errors.phoneWork ? (
          <ErrorDiv>{formik.errors.phoneWork}</ErrorDiv>
        ) : null}
      </InputWithError>
      <InputWithError>
        <InputMask
          mask="+7 (999) 999-99-99"
          name={'phoneMobile'}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.phoneMobile}
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
        {formik.touched.phoneMobile && formik.errors.phoneMobile ? (
          <ErrorDiv>{formik.errors.phoneMobile}</ErrorDiv>
        ) : null}
      </InputWithError>
      <Input
        label={'Email'}
        name="email"
        value={formik.values?.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
      />
      <Button
        type="submit"
        // disabled={!formik.isValid}
        onClick={formik.submitForm}
      >
        Сохранить
      </Button>
      <Button
        onClick={() => {
          setOpen((prevState) => !prevState);
        }}
      >
        Отменить
      </Button>
    </Drawer>
  );
};
export default DrawerForTable;
