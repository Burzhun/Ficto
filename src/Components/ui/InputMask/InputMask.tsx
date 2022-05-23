import { FC } from 'react';
import MaskedInput from 'react-text-mask';

const TEL_MASK = [
  /\+/,
  /[7]/,
  ' ',
  '(',
  /[1-9]/,
  /\d/,
  /\d/,
  ')',
  ' ',
  /\d/,
  /\d/,
  /\d/,
  '-',
  /\d/,
  /\d/,
  '-',
  /\d/,
  /\d/,
];

interface Props {
  inputRef: (ref: HTMLInputElement | null) => void;
}

export const InputMask: FC<Props> = (props) => {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={(ref: any) => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={TEL_MASK}
      placeholderChar={'\u2000'}
      showMask
    />
  );
};
