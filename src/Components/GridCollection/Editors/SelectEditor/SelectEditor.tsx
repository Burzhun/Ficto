import Select from 'react-select';
import React, { useMemo } from 'react';
import type { CSSObjectWithLabel, MenuPlacement } from 'react-select';
import { OptionType } from '../../types';

interface SelectEditorProps {
  value: string;
  onChange: (value: string) => void;
  options: OptionType[];
  rowHeight: number;
  placeholder: string;
  menuPortalTarget: Element;
  menuPlacement?: MenuPlacement;
}
export function SelectEditor({
  value,
  onChange,
  options,
  rowHeight,
  menuPortalTarget,
  placeholder,
  menuPlacement,
}: SelectEditorProps) {
  const makeStyle = useMemo(
    () => ({
      control: (provided: CSSObjectWithLabel) => ({
        ...provided,
        height: rowHeight - 1,
        minHeight: 10,
        lineHeight: 'normal',
      }),
      dropdownIndicator: (provided: CSSObjectWithLabel) => ({
        ...provided,
        height: rowHeight - 1,
      }),
    }),
    [rowHeight],
  );

  const onChangeHandler = (options: OptionType | null | string) => {
    if (typeof options === 'string') {
      onChange(options);
    } else onChange(options?.value || '');
  };

  return (
    <Select
      autoFocus
      defaultMenuIsOpen
      placeholder={placeholder}
      menuPlacement={menuPlacement || 'bottom'}
      value={options.find((o) => o.value === value)}
      onChange={onChangeHandler}
      options={options}
      menuPortalTarget={menuPortalTarget as HTMLElement}
      styles={makeStyle}
    />
  );
}
