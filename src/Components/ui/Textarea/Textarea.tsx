import { TextFieldProps } from '@material-ui/core';
import { FC } from 'react';
import { TextareaUI } from './styled';

export const Textarea: FC<TextFieldProps> = ({
  label,
  id,
  name,
  onChange,
  required,
  onBlur,
  value,
}) => {
  return (
    <TextareaUI
      required={required}
      variant="outlined"
      id={id}
      onBlur={onBlur}
      value={value}
      name={name}
      onChange={onChange}
      label={label}
      multiline
      rows={4}
    />
  );
};
