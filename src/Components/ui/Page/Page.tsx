import { FC } from 'react';
import { PageUI } from './styled';

export const Page: FC = ({ children }) => {
  return <PageUI>{children}</PageUI>;
};
