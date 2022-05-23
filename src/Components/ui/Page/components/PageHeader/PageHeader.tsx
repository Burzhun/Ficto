import styled from 'styled-components';
import { FC } from 'react';

export const PageHeaderUi = styled.title`
  display: flex;
  background-color: #fff;
  width: 100%;
`;

export const PageHeaderTitleUi = styled.p`
  font-size: 20px;
  line-height: 24px;
  display: flex;
  align-items: center;
  text-align: center;
  text-transform: uppercase;
  padding: 0 75px;
  height: 90px;
  flex: 1;
  margin: 0;
`;

type PageHeaderProps = {
  title: string;
};

export const PageHeader: FC<PageHeaderProps> = ({ title, children }) => {
  return (
    <PageHeaderUi>
      <PageHeaderTitleUi>{title}</PageHeaderTitleUi>
      {children}
    </PageHeaderUi>
  );
};
