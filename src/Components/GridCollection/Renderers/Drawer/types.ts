import { ReactNode } from 'react';

export type DrawerProps = {
  isOpenMenu: boolean;
  onCloseMenu: () => void;
  title: string;
  width?: string;
  children: ReactNode;
};
