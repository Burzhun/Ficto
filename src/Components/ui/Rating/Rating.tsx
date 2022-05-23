import { FormLabel } from '@material-ui/core';
import { Rating as RatingMUI } from '@material-ui/lab';
import { FC, useCallback, useState } from 'react';
import styled from 'styled-components';

type RatingValue = number | null;

type RatingProp = {
  label: string;
  onChange: (value: RatingValue) => void;
};

const RatingUI = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 10px;
`;

export const Rating: FC<RatingProp> = ({ label, onChange }) => {
  const [value, setValue] = useState<RatingValue>(null);
  const handleChange = useCallback(
    (event, value) => {
      setValue(value);
      onChange && onChange(value);
    },
    [onChange]
  );
  return (
    <RatingUI>
      <FormLabel>{label}</FormLabel>
      <RatingMUI
        name="simple-controlled"
        value={value}
        size={'large'}
        max={10}
        onChange={handleChange}
      />
    </RatingUI>
  );
};
