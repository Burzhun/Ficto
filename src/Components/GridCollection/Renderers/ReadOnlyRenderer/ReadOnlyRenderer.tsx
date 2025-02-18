import React, { FC } from 'react';
import styled from 'styled-components';

const ReadOnlyRendererUi = styled.div`
  padding: 0 8px;
  top: 0;
  left: -8px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  text-overflow: ellipsis;
  word-break: break-word !important;
`;

type ReadOnlyRendererPropsType = {
  value: string;
};

export const ReadOnlyRenderer: FC<ReadOnlyRendererPropsType> = (props) => {
  const { value } = props;

  return <ReadOnlyRendererUi title={value || undefined}>{value || ''}</ReadOnlyRendererUi>;
};
