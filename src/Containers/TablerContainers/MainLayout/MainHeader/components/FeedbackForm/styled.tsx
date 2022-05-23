import { IconButton, TextField } from '@material-ui/core';
import styled from 'styled-components';

export const TextFieldForPhone = styled(TextField)`
  height: 70px;
  width: 100%;
`;

export const CounterWrap = styled.div`
  position: relative;
`;

export const Counter = styled.div`
  position: absolute;
  top: -25px;
  left: 15px;
  font-size: 10px;
`;

export const FeedbackFormUi = styled.div`
  min-width: 400px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
export const HeaderUi = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: baseline;
`;
export const IconBtnUI = styled(IconButton)`
  color: #0000008a;
`;
export const BtnContainerUI = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 10px;
`;
export const InputWithError = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;
export const ErrorDiv = styled.div`
  position: absolute;
  top: 60px;
  left: 10px;
  color: #ff5640;
  font-size: 12px;
`;
export const ErrorDivDown = styled.div`
  position: absolute;
  top: 40px;
  left: 10px;
  color: #ff5640;
  font-size: 12px;
`;

export const Info = styled.div`
  max-width: 410px;
  color: rgba(0, 0, 0, 0.54);
  padding: 0px 0;
`;

export const TelLink = styled.a`
  color: inherit;

  :hover {
    text-decoration: underline;
  }
`;
