import React, { ChangeEvent, FC, KeyboardEvent, useMemo } from 'react';
import { OnlyNumberInputUI } from './styled';

type OnlyNumberEditorProps = {
  value: string;
  onBlur: (bool: boolean) => void;
  onChange: (value: string) => void;
  onlyPositive?: boolean;
  rounding?: number;
  length?: number;
};

const defaultRounding = 2;
const defaultLength = 10;

export const OnlyNumberEditor: FC<OnlyNumberEditorProps> = ({
  onBlur,
  onChange,
  onlyPositive = false,
  rounding = defaultRounding,
  length = defaultLength,
  value,
}) => {
  const autoFocusAndSelect = (input: HTMLInputElement | null) => {
    input?.focus();
  };

  const inputValue = useMemo(() => {
    return (value && value.toString().replace(',', '.')) || '';
  }, [value]);

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    let data = event.target.value.replace('.', ',').replace(/^0([^\,\.])/g, '$1'); // eslint-disable-line

    if (onlyPositive) data = data.replace('-', '');

    const wholePart = data.split(',')[0];
    const fractionalPart = data.split(',')[1];

    if (wholePart && wholePart.length > (data && data.includes('-') ? length + 1 : length)) {
      return onChange(value.replace('.', ','));
    }

    if (fractionalPart && fractionalPart.length > rounding) {
      return onChange(value.replace('.', ','));
    }

    return onChange(data);
  };

  const onKeyPressHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    const { code } = event;

    if (code === 'Minus' && value) {
      event.preventDefault();
    }

    if (onlyPositive && code === 'Minus' && !value) {
      event.preventDefault();
    }
  };

  return (
    <OnlyNumberInputUI
      ref={autoFocusAndSelect}
      type={'number'}
      value={inputValue}
      onBlur={() => onBlur(true)}
      onKeyDown={onKeyPressHandler}
      onChange={onChangeHandler}
    />
  );
};
