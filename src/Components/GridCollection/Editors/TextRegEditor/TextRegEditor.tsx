import React, { FC } from 'react';
import { TextRegEditorUi } from './styled';

export type TextRegEditorPropsType = {
  onChange(value: string): void;
  value: string;
  reg?: RegExp | undefined;
  onBlur(bool: boolean): void;
};

export const TextRegEditor: FC<TextRegEditorPropsType> = (props) => {
  const { onChange, value, reg, onBlur } = props;

  const autoFocusAndSelect = (input: HTMLInputElement | null) => {
    input?.focus();
  };

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (value === '') {
      return onChange(value);
    }

    if (reg) {
      if (reg?.test(value)) {
        return onChange(value);
      }
    } else {
      return onChange(value);
    }
  };

  return (
    <TextRegEditorUi
      ref={autoFocusAndSelect}
      value={value ? value : ''}
      onChange={onChangeHandler}
      onBlur={() => onBlur(true)}
    />
  );
};
