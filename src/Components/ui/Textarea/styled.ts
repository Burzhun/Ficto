import { TextField } from '@material-ui/core';
import styled from 'styled-components';

export const TextareaUI = styled(TextField)`
  width: 100%;
  height: 95px;

  & > div {
    padding-bottom: 25px;
  }
`;
