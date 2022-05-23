import { Button, TextFieldProps } from '@material-ui/core';
import { Input } from '@sas/ui-kit';
import { useFormik } from 'formik';
import React, { FC } from 'react';
import InputMask from 'react-input-mask';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { api, endpoints } from '../../../../api';
import {
  BtnContainerUI,
  ErrorDiv,
  InputWithError,
  TextFieldForPhone,
} from '../../../../Containers/TablerContainers/MainLayout/MainHeader/components/FeedbackForm/styled';
import {
  emailRegExp,
  nameRegExp,
  phoneRegExp,
} from '../../../../helpers/regExp';
import { setResponsibles } from '../../../../Redux/actions/data.action';
import { showAboutProject } from '../../../../Redux/actions/service.action';
import { rootReducer } from '../../../../Redux/rootReducer';
import { FeedbackFormUi, Info } from './styled';

type RootState = ReturnType<typeof rootReducer>;
export const ReportForm: FC = () => {
  const dispatch = useDispatch();
  const { currentProjectId } = useSelector((state: RootState) => state.data);
  const responsibles = useSelector(
    (state: RootState) => state.data.responsibles
  );
  const initValues = {
    responsibleExecutorName: responsibles?.responsible_executor?.fullName || '',
    responsibleExecutorPosition:
      responsibles?.responsible_executor?.position || '',
    responsibleExecutorPhone:
      responsibles?.responsible_executor?.phone || '+7 (  )    -  -  ',
    responsibleExecutorEmail: responsibles?.responsible_executor?.email || '',
    responsibleForDataName: responsibles?.responsible_for_data?.fullName || '',
    responsibleForDataPosition:
      responsibles?.responsible_for_data?.position || '',
    responsibleForDataPhone:
      responsibles?.responsible_for_data?.phone || '+7 (  )    -  -  ',
    responsibleForDataEmail: responsibles?.responsible_for_data?.email || '',
  };

  const formik = useFormik({
    initialValues: initValues,
    validationSchema: Yup.object().shape({
      responsibleExecutorName: Yup.string()
        .matches(nameRegExp, 'Не корректно заполненное поле ФИО')
        .required('Обязательно для заполнения'),
      responsibleExecutorPosition: Yup.string()
        .matches(/^[А-Яа-я-0-9\s]*$/, 'Не корректно заполненное поле ')
        .required('Обязательно для заполнения'),
      responsibleExecutorPhone: Yup.string()
        .matches(phoneRegExp, 'Не корректно заполненное поле')
        .required('Обязательно для заполнения'),
      responsibleExecutorEmail: Yup.string().matches(
        emailRegExp,
        'Некорректно заполненное поле E-mail'
      ),
      responsibleForDataName: Yup.string()
        .matches(
          /^([А-Я]|[А-Я][\x27а-я]{1,}|[А-Я][\x27а-я]{1,}\-([А-Я][\x27а-я]{1,}|(оглы)|(кызы)))\040[А-Я][\x27а-яa-z]{1,}(\040[А-Я][\x27а-я]{1,})?$/,
          'Не корректно заполненное поле ФИО'
        )
        .required('Обязательно для заполнения'),
      responsibleForDataPosition: Yup.string()
        .matches(/^[А-Яа-я-0-9\s]*$/, 'Не корректно заполненное поле ')
        .required('Обязательно для заполнения'),
      responsibleForDataPhone: Yup.string()
        .matches(phoneRegExp, 'Не корректно заполненное поле')
        .required('Обязательно для заполнения'),
      responsibleForDataEmail: Yup.string().matches(
        emailRegExp,
        'Некорректно заполненное поле E-mail'
      ),
    }),
    onSubmit: async function () {
      try {
        const { data } = await api.post(
          endpoints.responsibles(currentProjectId),
          {
            responsible_executor: {
              fullName: formik.values.responsibleExecutorName,
              position: formik.values.responsibleExecutorPosition,
              phone: formik.values.responsibleExecutorPhone,
              email: formik.values.responsibleExecutorEmail,
            },
            responsible_for_data: {
              fullName: formik.values.responsibleForDataName,
              position: formik.values.responsibleForDataPosition,
              phone: formik.values.responsibleForDataPhone,
              email: formik.values.responsibleExecutorEmail,
            },
          }
        );

        toast.success('Данные успешно сохранены!');
        dispatch(setResponsibles(data.payload));
      } catch (e) {
        toast.error('Не удалось сохранить данные!');
        dispatch(showAboutProject(false));
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <FeedbackFormUi>
        <Info>Ответственный за данные</Info>
        <Input
          label={'ФИО'}
          name={'responsibleExecutorName'}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.responsibleExecutorName}
          error={
            formik.touched.responsibleExecutorName &&
            Boolean(formik.errors.responsibleExecutorName)
          }
          helperText={
            formik.touched.responsibleExecutorName &&
            formik.errors.responsibleExecutorName
          }
        />
        <Input
          label={'Должность'}
          name={'responsibleExecutorPosition'}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.responsibleExecutorPosition}
          error={
            formik.touched.responsibleExecutorPosition &&
            Boolean(formik.errors.responsibleExecutorPosition)
          }
          helperText={
            formik.touched.responsibleExecutorPosition &&
            formik.errors.responsibleExecutorPosition
          }
        />
        <InputWithError>
          <InputMask
            mask="+7 (999) 999-99-99"
            id={'phone'}
            name={'responsibleExecutorPhone'}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.responsibleExecutorPhone}
          >
            {(inputProps: JSX.IntrinsicAttributes & TextFieldProps) => (
              <TextFieldForPhone
                {...inputProps}
                label={'Телефон'}
                variant="outlined"
                type="tel"
              />
            )}
          </InputMask>
          {formik.touched.responsibleExecutorPhone &&
          formik.errors.responsibleExecutorPhone ? (
            <ErrorDiv>{formik.errors.responsibleExecutorPhone}</ErrorDiv>
          ) : null}
        </InputWithError>
        <Input
          label={'E-mail'}
          name={'responsibleExecutorEmail'}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.responsibleExecutorEmail}
          error={
            formik.touched.responsibleExecutorEmail &&
            Boolean(formik.errors.responsibleExecutorEmail)
          }
          helperText={
            formik.touched.responsibleExecutorEmail &&
            formik.errors.responsibleExecutorEmail
          }
        />
        <Info>Ответственный исполнитель</Info>
        <Input
          label={'ФИО'}
          name={'responsibleForDataName'}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.responsibleForDataName}
          error={
            formik.touched.responsibleForDataName &&
            Boolean(formik.errors.responsibleForDataName)
          }
          helperText={
            formik.touched.responsibleForDataName &&
            formik.errors.responsibleForDataName
          }
        />

        <Input
          label={'Должность'}
          name={'responsibleForDataPosition'}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.responsibleForDataPosition}
          error={
            formik.touched.responsibleForDataPosition &&
            Boolean(formik.errors.responsibleForDataPosition)
          }
          helperText={
            formik.touched.responsibleForDataPosition &&
            formik.errors.responsibleForDataPosition
          }
        />
        <InputWithError>
          <InputMask
            mask="+7 (999) 999-99-99"
            id={'phone'}
            name={'responsibleForDataPhone'}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.responsibleForDataPhone}
          >
            {(inputProps: JSX.IntrinsicAttributes & TextFieldProps) => (
              <TextFieldForPhone
                {...inputProps}
                label={'Телефон'}
                variant="outlined"
                type="tel"
              />
            )}
          </InputMask>
          {formik.touched.responsibleForDataPhone &&
          formik.errors.responsibleForDataPhone ? (
            <ErrorDiv>{formik.errors.responsibleForDataPhone}</ErrorDiv>
          ) : null}
        </InputWithError>
        <Input
          label={'E-mail'}
          name={'responsibleForDataEmail'}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.responsibleForDataEmail}
          error={
            formik.touched.responsibleForDataEmail &&
            Boolean(formik.errors.responsibleForDataEmail)
          }
          helperText={
            formik.touched.responsibleForDataEmail &&
            formik.errors.responsibleForDataEmail
          }
        />
        <BtnContainerUI>
          <Button variant="contained" color="primary" type="submit">
            Сохранить изменения
          </Button>
        </BtnContainerUI>
      </FeedbackFormUi>
    </form>
  );
};
