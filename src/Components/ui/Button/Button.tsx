import {
  Button as ButtonMUI,
  ButtonProps as ButtonMUIProps,
} from '@material-ui/core';
import { FC, useCallback, useMemo, useState } from 'react';

import styled from 'styled-components';
const ButtonUi = styled.div``;

type ButtonProps = ButtonMUIProps & {
  async?: boolean;
  onClick: () => void;
};

enum States {
  pending = 'pending',
  fulfilled = 'fulfilled',
  rejected = 'rejected',
}

type AsyncStates = States | null;

const asyncHandle = async (
  setAsyncState: (s: AsyncStates) => void,
  onClick: () => void
) => {
  try {
    setAsyncState(States.pending);
    await onClick();
    setAsyncState(States.fulfilled);
  } catch (e) {
    setAsyncState(States.rejected);
    return e;
  }
};

export const Button: FC<ButtonProps> = ({
  children,
  type = 'button',
  async = false,
  onClick,
}) => {
  const [asyncState, setAsyncState] = useState<AsyncStates>(null);

  const handleClick = useCallback(() => {
    if (async) {
      asyncHandle(setAsyncState, onClick).catch((e) => e);
    } else {
      onClick();
    }
  }, [async, onClick]);
  const isDisabled = useMemo(() => asyncState === States.pending, [asyncState]);
  return (
    <ButtonUi>
      <ButtonMUI
        variant="contained"
        color="primary"
        type={type}
        onClick={handleClick}
        disabled={isDisabled}
      >
        {children}
      </ButtonMUI>
    </ButtonUi>
  );
};
