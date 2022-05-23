import { TextFieldProps } from '@material-ui/core';
import { FC } from 'react';
import { InputUI } from './styled';

export const Input: FC<TextFieldProps> = ({
  InputLabelProps,
  type,
  label,
  id,
  name,
  onChange,
    onBlur,
  InputProps,
  required,
  value,
    ref,
  rows,
}) => {

  return (
    <InputUI
      InputLabelProps={InputLabelProps}
      type={type}
      variant="outlined"
      rows={rows}
      value={value}
      required={required}
      fullWidth={true}
      label={label}
      id={id}
      name={name}
      onChange={onChange}
      onBlur={onBlur}
      InputProps={InputProps}
    />
  );
};
