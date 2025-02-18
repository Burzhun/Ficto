import React, { FC } from 'react';
import { ButtonBoxUI, ConfirmDrawerUI, ContentUI } from './styled';
import { ConfirmDrawerProps } from './types';
import { Button } from '../../../Button';
import { Typography } from 'antd';

export const ConfirmDrawer: FC<ConfirmDrawerProps> = ({
  title = 'Подтвердить операцию',
  isOpenMenu,
  onCloseMenu,
  message,
  onConfirm,
  onDenied,
  confirmButtonLabel = 'Да',
  deniedButtonLabel = 'Нет',
}) => {
  return (
    <ConfirmDrawerUI title={title} isOpenMenu={isOpenMenu} onCloseMenu={onCloseMenu}>
      <ContentUI>
        {message && <Typography.Title level={5}>{message}</Typography.Title>}
        <ButtonBoxUI>
          <Button onClick={onConfirm}>{confirmButtonLabel}</Button>
          <Button onClick={onDenied || onCloseMenu}>{deniedButtonLabel}</Button>
        </ButtonBoxUI>
      </ContentUI>
    </ConfirmDrawerUI>
  );
};
