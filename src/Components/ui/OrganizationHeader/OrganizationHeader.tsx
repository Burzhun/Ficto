import { FC } from 'react';
import { OrganizationHeaderUI } from './styled';

type HeaderType = {
  title: string;
};

/**
 * @deprecated use PageHeader
 */
export const OrganizationHeader: FC<HeaderType> = ({ title }) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return <OrganizationHeaderUI>{title}</OrganizationHeaderUI>;
};
