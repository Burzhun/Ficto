import { TextField } from '@material-ui/core';
import styled from 'styled-components';

export const TextFieldForPhone = styled(TextField)`
  height: 70px;
  width: 100%;
`;
export const ErrorDiv = styled.div`
  position: absolute;
  top: 60px;
  left: 10px;
  color: #ff5640;
  font-size: 12px;
`;
export const InputLabel = styled.div`
  color: rgba(0, 0, 0, 0.54);
`;

export const HiddenLabel = styled.div`
  opacity: 0;
`;

export const InputWithError = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
`;
export const InputWithLabel = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
`;
export const InputLeftPosition = styled.div`
  width: 40%;
`;
export const InputContainer = styled.div`
  display: flex;
  gap: 33px;
`;
export const GroupInputContainer = styled.div`
  display: flex;
`;
export const LeftSideContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex-grow: 1;
`;
export const RightSideContainer = styled.div`
  display: flex;
  margin-left: auto;
  margin-right: 60px;
`;

export const FullTable = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  margin-bottom: 5px;
  margin-top: 15px;
  width: 100%;
  position: relative;
`;

export const BtnContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;
