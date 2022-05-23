import {
  FormControl,
  InputLabel,
  MenuItem,
  TextFieldProps,
  Typography,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { Button } from 'Components/ui/Button';
import { Input } from 'Components/ui/Input';
import { MuiSelect } from 'Components/ui/MuiSelect';
import { Rating } from 'Components/ui/Rating';
import { Textarea } from 'Components/ui/Textarea';
import { useFormik } from 'formik';
import { FC, useCallback, useEffect, useState } from 'react';
import InputMask from 'react-input-mask';
import * as Yup from 'yup';
import {
  emailRegExp,
  nameRegExp,
  phoneRegExp,
} from '../../../../../../helpers/regExp';
import { getProjectTypes, saveForm } from './api';
import {
  BtnContainerUI,
  Counter,
  CounterWrap,
  ErrorDiv,
  ErrorDivDown,
  FeedbackFormUi,
  HeaderUi,
  IconBtnUI,
  Info,
  InputWithError,
  TelLink,
  TextFieldForPhone,
} from './styled';
import { FormProps } from './types';

const initValues = {
  name: '',
  phone: '',
  email: '',
  evaluation: 0,
  project: '',
  subject: '',
};

type FeedBackFormProps = {
  handleClose: () => void;
};
const isApkPro = window.location.host === 'sas.apkpro.ru';

export const FeedbackForm: FC<FeedBackFormProps> = ({ handleClose }) => {
  useEffect(() => {
    const phoneInputRef: any = document.getElementById('phone');

    function cursorSwitch(e: FocusEvent | MouseEvent) {
      e.preventDefault();
      const cursorPosition = e.type === 'dblclick' ? 18 : 4;
      phoneInputRef.setSelectionRange(cursorPosition, cursorPosition);
    }

    phoneInputRef.addEventListener('focus', cursorSwitch);

    return () => {
      phoneInputRef.removeEventListener('focus', cursorSwitch);
    };
  }, []);

  const [projectTypes, setProjectTypes] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await getProjectTypes();
        setProjectTypes(
          response.data.payload.result.map((obj: any) => obj.name)
        );
      } catch (err) {}
    })();
  }, []);

  const formik = useFormik<FormProps>({
    initialValues: initValues,
    validationSchema: Yup.object().shape(
      {
        name: Yup.string()
          .max(150, 'Максимум 150 символов')
          .matches(nameRegExp, 'Не корректно заполненное поле ФИО')
          .required('Поле ФИО обязательно для заполнения'),
        phone: Yup.string()
          .test(
            'Проверка полей на undefined',
            'Обязательно для заполнения E-mail или телефон',
            function (phone) {
              const { email } = this.parent;
              return !(phone === undefined && email === undefined);
            }
          )
          .matches(phoneRegExp, 'Некорректно заполненное поле Телефон'),
        email: Yup.string().matches(
          emailRegExp,
          'Некорректно заполненное поле E-mail'
        ),
        evaluation: Yup.string()
          .test(
            'Проверка рейтинга и отзыва на заполненность',
            'Поставьте оценку или заполните поле',
            function (evaluation) {
              const { subject } = this.parent;
              return !(subject === undefined && evaluation === '0');
            }
          )
          .nullable(),
        subject: Yup.string().when('project', {
          is: (value) => value === undefined,
          then: Yup.string().max(500, 'Максимум 500 символов'),
          otherwise: Yup.string()
            .max(500, 'Максимум 500 символов')
            .required(
              'Если выбран проект,то данное поле обязательно для заполнения'
            ),
        }),
      },
      [['phone', 'email']]
    ),
    onSubmit: (values) => {
      return new Promise((resolve, reject) => {
        saveForm(values)
          .then(() => {
            handleClose();
            resolve(null);
          })
          .catch((e) => {
            handleClose();
            reject(e);
          });
      });
    },
  });

  const handleCloseClick = useCallback(() => {
    handleClose();
  }, [handleClose]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <FeedbackFormUi>
        <HeaderUi>
          <Typography variant="h6" gutterBottom>
            Здесь Вы можете оставить свое обращение
          </Typography>
          <IconBtnUI onClick={handleCloseClick}>
            <Close />
          </IconBtnUI>
        </HeaderUi>
        <InputWithError>
          {formik.touched.name && formik.errors.name ? (
            <ErrorDiv>* {formik.errors.name}</ErrorDiv>
          ) : null}
          <Input
            label={'ФИО'}
            id={'name'}
            name={'name'}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
          />
        </InputWithError>
        <InputWithError>
          {formik.touched.phone && formik.errors.phone ? (
            <ErrorDiv>* {formik.errors.phone}</ErrorDiv>
          ) : null}
          <InputMask
            mask="+7 (999) 999-99-99"
            id={'phone'}
            name={'phone'}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.phone}
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
        </InputWithError>
        <InputWithError>
          {formik.touched.email && formik.errors.email ? (
            <ErrorDiv>* {formik.errors.email}</ErrorDiv>
          ) : null}
          <Input
            label={'E-mail'}
            id={'email'}
            name={'email'}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
        </InputWithError>
        <Rating
          label={'Оцените общие впечатления от продукта'}
          onChange={(value) => formik.setFieldValue('evaluation', value)}
        />
        <FormControl variant="outlined">
          <InputLabel>Проект</InputLabel>
          <MuiSelect
            name="project"
            value={formik.values.project}
            onChange={formik.handleChange}
            label="Проект"
          >
            {projectTypes.map((name: string) => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </MuiSelect>
        </FormControl>
        <InputWithError>
          {formik.touched.subject && formik.errors.subject ? (
            <ErrorDivDown>* {formik.errors.subject}</ErrorDivDown>
          ) : null}
          {formik.errors.evaluation ? (
            <ErrorDiv>* {formik.errors.evaluation}</ErrorDiv>
          ) : null}
          <Textarea
            label={'Текст обращения'}
            id={'subject'}
            name={'subject'}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.subject}
          />
        </InputWithError>
        <CounterWrap>
          <Counter
            style={formik.values.subject.length > 499 ? { color: 'red' } : {}}
          >
            {formik.values.subject.length}/500
          </Counter>
        </CounterWrap>
        {isApkPro && <Info>
          <p>
            <i>
              &nbsp;Внимание! Горячая линия отвечает только на технические
              вопросы. По вопросам связанным с расшифровкой показателей
              отправьте письменное обращение заполнив форму
            </i>
          </p>
          <span>Телефон горячей линии: </span>
          <TelLink href="tel:88002009185">8-800-200-91-85</TelLink>
        </Info>}
        <BtnContainerUI>
          <Button async={true} onClick={() => console.log('')} type="submit">
            Отправить
          </Button>
        </BtnContainerUI>
      </FeedbackFormUi>
    </form>
  );
};
