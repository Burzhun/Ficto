import React, { FC } from 'react';
import SelectComponent, { Props } from 'react-select';
import styled from 'styled-components';

const SelectStyles = styled(SelectComponent)`
  width: 100%;
  & .sasSelect__menu {
    z-index: 250;
  }
`;
export const Select: FC<Props> = (props) => {
  const { value, isSearchable, onChange, name, options, menuIsOpen, gridSelect } = props;

  return (
    <SelectStyles
      gridSelect={gridSelect}
      classNamePrefix="sasSelect"
      value={value}
      isSearchable={isSearchable}
      onChange={onChange}
      name={name}
      options={options}
      menuIsOpen={menuIsOpen}
    />
  );
};
