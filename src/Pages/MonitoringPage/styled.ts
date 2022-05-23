import { Button } from '@material-ui/core';
import Select from 'react-select';
import styled from 'styled-components';

export const MonitoringPageUI = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const Btn = styled(Button)`
  width: 120px;
  font-size: 12px;
  height: 38px;
  color: white;
  background: #2196f3;
  &:hover {
    background-color: #2196f3 !important;
  }
`;
export const BlockTitle = styled.title`
  margin: 0 0 20px 30px;

  font-size: 16px;
  line-height: 19px;
  display: flex;
  align-items: center;
  text-align: center;
`;
export const BtnContainer = styled.div``;

export const PaginationSelector = styled(Select)`
  flex: 0.9;
  margin-left: 20px;
`;
