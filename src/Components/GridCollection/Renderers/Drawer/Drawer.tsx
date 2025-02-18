import { Typography } from 'antd';
import React, { FC } from 'react';
import { ContainerUI, DrawerUI, HeaderUi } from './styeld';
import { DrawerProps } from './types';

export const Drawer: FC<DrawerProps> = ({ children, isOpenMenu, onCloseMenu, title, width }) => {
  return (
    <DrawerUI placement={'right'} open={isOpenMenu} onClose={onCloseMenu}>
      <ContainerUI width={width}>
        <HeaderUi>
          <Typography.Title level={5}>{title}</Typography.Title>
        </HeaderUi>
        {children}
      </ContainerUI>
    </DrawerUI>
  );
};
