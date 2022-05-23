import { FC } from 'react';
import { SelectUI } from './styled';
import { SelectProps } from './types';

export const MuiSelect: FC<SelectProps> = ({
  required,
  multiple,
  value,
  label,
  children,
  name,
  onChange,
}) => {
  return (
    <SelectUI
      name={name}
      required={required}
      multiple={multiple}
      label={label}
      variant="outlined"
      value={value}
      onChange={onChange}
    >
      {children}
    </SelectUI>
  );
};
