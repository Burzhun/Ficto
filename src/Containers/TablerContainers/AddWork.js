import React from 'react';
import {
  Button,
  FieldsBox,
  FlexCol,
  TextField,
} from '../../Style/TablesStyles/TablerStyle';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { addNewWork } from '../../Redux/actions/workPlace.action';

const validationSchema = yup.object({
  name: yup
    .string('Введите название организации')
    .required('Обязательное поле'),
  phone: yup.string('Введите телефон').required('Обязательное поле'),
  inn: yup.number('Введите корректный ИНН').required('Обязательное поле'),
  email: yup
    .string('Введите Email организации')
    .email('Введите корректный Email')
    .required('Обязательное поле'),
  person: yup.string('Введите корректно').required('Обязательное поле'),
});

export const AddWork = () => {
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      name: '',
      phone: '',
      inn: '',
      email: '',
      person: '',
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
      dispatch(addNewWork(values.name));
    },
  });

  return (
    <FlexCol>
      <form onSubmit={formik.handleSubmit}>
        <FieldsBox>
          <TextField
            label="Название Организации"
            id={'name'}
            name={'name'}
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
          <TextField
            label="Телефон Организации"
            id={'phone'}
            name={'phone'}
            type={'phone'}
            value={formik.values.phone}
            onChange={formik.handleChange}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
          />
          <TextField
            label="ИНН Организации"
            id={'inn'}
            name={'inn'}
            value={formik.values.inn}
            onChange={(e) => {
              e.preventDefault();
              if (e.target.value.match(/^\d+$/)) {
                formik.setFieldValue('inn', e.target.value);
              }
            }}
            error={formik.touched.inn && Boolean(formik.errors.inn)}
            helperText={formik.touched.inn && formik.errors.inn}
          />
          <TextField
            label="Email Организации"
            id={'email'}
            name={'email'}
            type={'email'}
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            label="Руководитель Организации"
            id={'person'}
            name={'person'}
            value={formik.values.person}
            onChange={formik.handleChange}
            error={formik.touched.person && Boolean(formik.errors.person)}
            helperText={formik.touched.person && formik.errors.person}
          />
        </FieldsBox>

        <Button color={'primary'} variant="contained" type={'submit'}>
          Добавить место работы
        </Button>
      </form>
    </FlexCol>
  );
};
