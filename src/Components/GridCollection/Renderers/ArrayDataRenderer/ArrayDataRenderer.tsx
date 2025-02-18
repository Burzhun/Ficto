import React, { FC } from 'react';
import { ArrayDataRendererUI, TagUI, TagContainerUI } from './styled';

type ArrayDataRendererProps = {
  value?: string[];
  readonly?: boolean;
};

export const ArrayDataRenderer: FC<ArrayDataRendererProps> = ({ value, readonly }) => {
  return (
    <ArrayDataRendererUI title={value ? value.join(', ') : undefined} readonly={readonly}>
      <TagContainerUI>{value && value.map((node) => <TagUI key={node}>{node}</TagUI>)}</TagContainerUI>
    </ArrayDataRendererUI>
  );
};
