import styled from 'styled-components';

export const DatePickerRendererUI = styled.div<{ readonly?: boolean }>`
  background-color: ${(props) => (props.readonly ? '#f9f9f9' : null)};
`;
