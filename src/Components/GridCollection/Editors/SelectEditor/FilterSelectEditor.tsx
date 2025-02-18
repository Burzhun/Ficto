import Select from 'react-select';
import React, { useMemo } from 'react';
import { CSSObject } from 'styled-components';
import { OptionType } from '../../types';
import type { MultiValue, CSSObjectWithLabel } from 'react-select';

interface FilterSelectEditorProps {
  value: string;
  onChange: (value: string) => void;
  options: MultiValue<OptionType | string>;
  rowHeight: number;
  placeholder: string;
  menuPortalTarget: Element;
}
export function FilterSelectEditor({
  value,
  onChange,
  options,
  rowHeight,
  menuPortalTarget,
  placeholder,
}: FilterSelectEditorProps) {
  const makeStyle = useMemo(
    () => ({
      control: (provided: CSSObjectWithLabel) => ({
        ...provided,
        height: rowHeight,
        minHeight: 10,
        lineHeight: 'normal',
        marginTop: '8px',
      }),
      dropdownIndicator: (provided: CSSObjectWithLabel) =>
        ({
          ...provided,
          height: rowHeight - 1,
          marginTop: '-5px',
          position: 'relative',
        } as CSSObject),
      clearIndicator: (provided: CSSObjectWithLabel) =>
        ({
          ...provided,
          paddingTop: '0px',
          top: '5px',
          position: 'relative',
        } as CSSObject),
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
      autoFocus={false}
      defaultMenuIsOpen={false}
      placeholder={placeholder}
      value={value ? options.find((o) => (typeof o === 'string' ? o : o?.value) === value) : ''}
      onChange={onChangeHandler}
      options={options}
      isClearable={true}
      menuPortalTarget={menuPortalTarget as HTMLElement}
      styles={makeStyle}
    />
  );
}
