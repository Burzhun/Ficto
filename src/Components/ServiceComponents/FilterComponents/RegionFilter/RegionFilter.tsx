import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { endpoints } from '../../../../api';
import { useHttp } from '../../../../hooks/http.hook';
import { Select } from '../../../ui/Select/Select';
import {
  setFilterRegionSubject,
  showFilterRegionSubject,
} from '../redux/filters.action';

type SelectTypeValue = { label: string; value: string } | null;

export const RegionFilter: FC = () => {
  const dispatch = useDispatch();
  const [options, setOptions] = useState();
  const { request } = useHttp();
  const [value, setValue] = useState<SelectTypeValue>({ label: '', value: '' });

  useEffect(() => {
    (async function () {
      try {
        const data = await request(
          endpoints.dictionary('/subjects-federation')
        );
        setOptions(data.payload);
        setValue(data.payload[0]);
        dispatch(setFilterRegionSubject(data.payload[0].value));
      } catch (e) {}
    })();

    return () => {
      dispatch(showFilterRegionSubject(false));
    };
  }, [request, dispatch]);

  const onChangeHandler = (value: SelectTypeValue) => {
    if (value) {
      dispatch(setFilterRegionSubject(value.value));
      setValue(value);
    }
  };

  return (
    <div style={{ width: '300px' }}>
      <Select
        value={value}
        isSearchable={true}
        onChange={(e: SelectTypeValue) => onChangeHandler(e)}
        name="region"
        options={options}
      />
    </div>
  );
};
