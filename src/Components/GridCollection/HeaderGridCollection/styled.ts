import styled from 'styled-components';

type HeaderStyleProps = {
  ['grid-column-start']?: number;
  ['grid-column-end']?: number;
  alignX?: 'left' | 'center' | 'right';
  alignY?: 'top' | 'center' | 'bottom';
};

const setHorizontalAlign = (setting: 'left' | 'center' | 'right' | undefined) => {
  switch (setting) {
    case 'center':
      return 'center';
    case 'right':
      return 'flex-end';
    default:
      return 'flex-start';
  }
};

const textAlign = (setting: 'left' | 'center' | 'right' | undefined) => {
  switch (setting) {
    case 'left':
      return 'left';
    case 'right':
      return 'right';
    default:
      return 'center';
  }
};

const setVerticalAlign = (setting: 'top' | 'center' | 'bottom' | undefined) => {
  switch (setting) {
    case 'top':
      return 'flex-start';
    case 'bottom':
      return 'flex-end';
    default:
      return 'center';
  }
};

export const HeaderGridCollectionUi = styled.div`
  top: 0;
  z-index: 10;
  position: sticky;
`;

export const HeaderNested = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: var(--template-columns);
  grid-template-rows: 50px;
  background-color: var(--header-background-color);
`;

export const HeaderGridNestedNode = styled.div`
  grid-column-start: ${(props: HeaderStyleProps) => {
    if (props['grid-column-start']) {
      return props['grid-column-start'];
    }
  }};
  grid-column-end: ${(props: HeaderStyleProps) => {
    if (props['grid-column-end']) {
      return props['grid-column-end'];
    }
  }};
  padding: 3px;
  border-bottom: 1px solid #b0b0b0;
  border-right: 1px solid #b0b0b0;
  background-color: #fafafa;
  display: flex;
  line-height: normal;
  justify-content: ${(props: HeaderStyleProps) => setHorizontalAlign(props.alignX)};
  align-items: ${(props: HeaderStyleProps) => setVerticalAlign(props.alignY)};
  position: sticky;
  text-align: ${(props: HeaderStyleProps) => textAlign(props.alignX)};

  & h5 {
    margin: 0;
    white-space: pre-line;
  }
`;

export const HeaderGridRow = styled.div`
  display: grid;
  grid-template-columns: var(--template-columns);
  width: var(--row-width);
  background-color: var(--header-background-color);
  font-weight: 700;
  grid-template-rows: ${(props: { height?: number }) => (props.height ? `${props.height}px` : '60px')};

  touch-action: none;
`;
