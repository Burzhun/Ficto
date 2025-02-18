import React, { ChangeEvent, FC, KeyboardEvent, useMemo } from 'react';
import { OnlyNumberInputUI } from './styled';

type InnEditorProps = {
  value: string;
  onBlur: (bool: boolean) => void;
  onChange: (value: string, error: boolean) => void;
  onlyPositive?: boolean;
  rounding?: number;
  length?: number | number[];
};

const inn_org = 10;
const inn_fiz = 12;
const defaultLength = [inn_fiz, inn_org];

export const InnEditor: FC<InnEditorProps> = ({ onBlur, onChange, length = defaultLength, value }) => {
  const autoFocusAndSelect = (input: HTMLInputElement | null) => {
    input?.focus();
  };

  const [maxLength, lengthValues] = useMemo(() => {
    if (Array.isArray(length)) {
      return [Math.max(...length), length];
    } else {
      return [length, [length]];
    }
  }, [length]);

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const data = event.target.value;

    if (data.toString().length <= maxLength)
      return onChange(data, !lengthValues.includes(data ? data.toString().length : 0));
  };

  const onKeyPressHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    const { code } = event;

    if (['Minus', 'Period', 'Comma'].includes(code)) {
      event.preventDefault();
    }
  };

  return (
    <OnlyNumberInputUI
      ref={autoFocusAndSelect}
      type={'number'}
      value={value || ''}
      onBlur={() => onBlur(true)}
      onKeyDown={onKeyPressHandler}
      onChange={onChangeHandler}
    />
  );
};
