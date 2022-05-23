//пример шаблонного компонента с тестами и т.д
import { FC, useEffect, useState, ChangeEvent } from 'react';
import UIButton from '@material-ui/core/Button';
import { ButtonProps } from './types';

export const ExampleComponent: FC<ButtonProps> = ({ customProp }) => {
  const [text, setText] = useState('');
  const [value, setValue] = useState('');
  useEffect(() => {
    setText('ButtonText');
  }, []);
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const inputtedValue = event.currentTarget.value;
    setValue(inputtedValue.trim());
  };
  return (
    <>
      <p>{customProp}</p>
      <input
        type="text"
        aria-label="example-input"
        onChange={handleChange}
        value={value}
      />
      <UIButton className={customProp}>{text}</UIButton>
    </>
  );
};
