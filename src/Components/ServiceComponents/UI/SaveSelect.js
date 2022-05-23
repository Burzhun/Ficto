import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { StatusSelectBox } from '../../../Style/ServiceStyles/ServiceStyle';
import { setSendStatus } from '../../../Redux/actions/service.action';

export const colourOptions = [
  { value: 'draft', label: 'Черновик', color: '#666666' },
  { value: 'ready', label: 'Подготовлен', color: '#FFC400' },
  { value: 'send', label: 'Отправлен', color: '#36B37E' },
];

const dot = (color = '#ccc') => ({
  alignItems: 'center',
  display: 'flex',

  ':before': {
    backgroundColor: color,
    borderRadius: 10,
    content: '" "',
    display: 'block',
    marginRight: 8,
    height: 10,
    width: 10,
  },
});

const colourStyles = {
  input: (styles) => ({ ...styles, ...dot() }),
  singleValue: (styles, { data }) => ({ ...styles, ...dot(data.color) }),
};

export const SaveSelect = () => {
  const dispatch = useDispatch();
  const value = useSelector((state) => state.serviceState.sendStatus);

  return (
    <StatusSelectBox>
      <Select
        options={colourOptions}
        value={value}
        styles={colourStyles}
        onChange={(e) => dispatch(setSendStatus(e))}
      />
    </StatusSelectBox>
  );
};
