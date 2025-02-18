import React, { FC, useMemo } from 'react';
import { MultiSelectUI } from './styled';
import type { CSSObjectWithLabel, MenuPlacement } from 'react-select';
import { OptionType } from '../../types';

type MultiSelectEditorProps = {
  menuPortalTarget: Element;
  rowHeight: number;
  value?: string[];
  options: string[];
  placeholder?: string;
  onChange: (value: string[]) => void;
  menuPlacement?: MenuPlacement;
};

export const MultiSelectEditor: FC<MultiSelectEditorProps> = ({
  rowHeight,
  menuPortalTarget,
  value,
  options,
  onChange,
  menuPlacement,
  placeholder = 'Выберите значение...',
}) => {
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
      container: (provided: CSSObjectWithLabel) => ({
        ...provided,
        paddingTop: '0',
        height: rowHeight - 1,
      }),
    }),
    [rowHeight],
  );

  const selectValue = useMemo(() => {
    return value?.map((node) => ({ value: node, label: node }));
  }, [value]);

  const selectOptions = useMemo(() => {
    return options.map((node) => ({ value: node, label: node }));
  }, [options]);

  const onChangeHandler = (option1: unknown) => {
    const t: readonly OptionType[] = option1 as readonly OptionType[];
    onChange(t.map((node) => node.label));
  };

  return (
    <MultiSelectUI
      styles={makeStyle}
      classNamePrefix="react-select"
      onChange={onChangeHandler}
      defaultValue={selectValue}
      menuPlacement={menuPlacement || 'bottom'}
      isMulti
      noOptionsMessage={() => 'Ничего не найдено...'}
      autoFocus
      options={selectOptions}
      defaultMenuIsOpen
      placeholder={placeholder}
      menuPortalTarget={menuPortalTarget as HTMLElement}
    />
  );
};
