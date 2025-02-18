import styled from 'styled-components';

export const FileRendererUI = styled.div<{ readOnly?: boolean }>`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: ${(props) => (props.readOnly ? null : '40px')};
  background: ${(props) => (props.readOnly ? '#f9f9f9' : null)};
  ${(props) =>
    props.readOnly
      ? `
    position: absolute;
    padding: 0 8px;
    top: 0;
    left: 0;
    width: 94%;
    height: 100%;
  `
      : null};
`;
