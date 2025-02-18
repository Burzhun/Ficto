import styled from 'styled-components';
import { DatePicker } from 'antd';

export const DatePickerUI = styled(DatePicker)`
  & .MuiInputBase-input {
    padding: 9px 0 7px 7px;
    font-size: 14px;
  }

  & .MuiInput-underline:after {
    display: none;
  }

  & .MuiInput-underline:before {
    display: none;
  }

  & .MuiFormHelperText-root.Mui-error {
    display: none;
  }

  & .MuiIconButton-root {
    padding: 5px;
    margin-right: 3px;
    margin-top: 3px;
  }
`;
