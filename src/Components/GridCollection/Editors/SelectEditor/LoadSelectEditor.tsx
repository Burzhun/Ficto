import Select from 'react-select';
import type OptionTypeBase from 'react-select';
import React, { useEffect, useMemo, useState } from 'react';
import type { CSSObjectWithLabel } from 'react-select';
import { OptionType } from '../../types';

interface SelectEditorProps {
  value: string;
  onChange: (value: string) => void;
  rowHeight: number | ((rows: readonly OptionTypeBase[], i: number) => number) | undefined;
  placeholder: string;
  menuPortalTarget: Element;
  loadOptions: string;
}
const defaultRowHeight = 35;
export function LoadSelectEditor({
  value,
  onChange,
  rowHeight,
  menuPortalTarget,
  placeholder,
  loadOptions,
}: SelectEditorProps) {
  const [options, setOptions] = useState<OptionType[]>([]);

  useEffect(() => {
    try {
      fetch(loadOptions)
        .then((response) => response.json())
        .then((data) => {
          setOptions(data.payload);
        });
    } catch (e) {}
  }, [loadOptions]);

  const makeStyle = useMemo(() => {
    const height = typeof rowHeight === 'number' ? rowHeight : defaultRowHeight;

    return {
      control: (provided: CSSObjectWithLabel) => ({
        ...provided,
        height: height - 1,
        minHeight: 10,
        lineHeight: 'normal',
      }),
      dropdownIndicator: (provided: CSSObjectWithLabel) => ({
        ...provided,
        height: height - 1,
      }),
    };
  }, [rowHeight]);

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
      value={options.find((o) => o.value === value)}
      onChange={onChangeHandler}
      options={options}
      menuPortalTarget={menuPortalTarget as HTMLElement}
      styles={makeStyle}
    />
  );
}
