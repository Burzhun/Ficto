import React, { FC, useEffect, useRef } from 'react';
import { HeaderFormatterUi } from './styled';

type HeaderFormatterPropsType = {
  title?: string;
};

export const HeaderFormatter: FC<HeaderFormatterPropsType> = (props) => {
  const { title } = props;
  const innerRef = useRef(null);

  useEffect(() => {
    const node = innerRef.current;

    if (node) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      node.innerHTML = title;
    }
  });

  return (
    <HeaderFormatterUi>
      <h5 ref={innerRef}> </h5>
    </HeaderFormatterUi>
  );
};
