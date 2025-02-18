import styled from 'styled-components';

export const ArrayDataRendererUI = styled.div<{ readonly?: boolean }>`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  background-color: ${(props) => (props.readonly ? '#f9f9f9' : null)};
  text-overflow: ellipsis;
`;

export const TagUI = styled.p`
  background-color: #e6e6e6;
  border-radius: 3px;
  margin: 0;
  padding-left: 6px;
  padding-right: 6px;
  line-height: 20px;
`;

export const TagContainerUI = styled.div`
  display: flex;
  gap: 5px;
`;
