import React from 'react';
import LoaderComp from 'react-loader-spinner';
import { LoaderBox } from '../../Style/TablerStyle';

export const Loader = () => {
  return (
    <LoaderBox>
      <LoaderComp type={'Rings'} color={'#ffca28'} />
    </LoaderBox>
  );
};
