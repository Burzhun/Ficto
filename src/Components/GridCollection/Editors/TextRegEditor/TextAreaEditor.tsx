import React, { FC } from 'react';
import { TextAreaEditorUi } from './styled';

export type TextAreaEditorPropsType = {
  onChange(value: string): void;
  value: string;
  onBlur(bool: boolean): void;
};

export const TextAreaEditor: FC<TextAreaEditorPropsType> = (props) => {
  const { onChange, value, onBlur } = props;

  const autoFocusAndSelect = (input: HTMLTextAreaElement | null) => {
    input?.focus();
  };

  const onChangeHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;

    return onChange(value);
  };

  return (
    <TextAreaEditorUi
      ref={autoFocusAndSelect}
      value={value ? value : ''}
      onChange={onChangeHandler}
      onBlur={() => onBlur(true)}
    />
  );
};
