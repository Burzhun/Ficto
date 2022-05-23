import { FC } from 'react';
import { PageContentUI } from './styled';

export const PageContent: FC = ({ children }) => {
  return <PageContentUI>{children}</PageContentUI>;
};
