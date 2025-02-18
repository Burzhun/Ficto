import React, { FC, useCallback, useMemo } from 'react';
import { DatePicker, DatePickerProps } from 'antd';
import moment from 'moment';
import 'moment/locale/ru';
import locale from 'antd/es/date-picker/locale/ru_RU';

type DataPickerProps = {
  value: string;
  maxDate?: string | undefined;
  minDate?: string | undefined;
  format?: string;
  views?: unknown[];
  onChange: (value: string) => void;
};

export const DatePickerComponent: FC<DataPickerProps> = ({
  value,
  onChange,
  maxDate,
  format = 'DD.MM.yyyy',
  minDate,
}) => {
  const inputValue = useMemo(() => {
    const result = moment(value);

    if (!result.isValid() || !isNaN(Number(value))) {
      return null;
    }

    return result;
  }, [value]);

  const onChangeHandler: DatePickerProps['onChange'] = (date) => {
    onChange(date ? date.format() : '');
  };

  const maxDateMemo = useMemo(() => {
    if (!maxDate) return undefined;

    const d = moment(maxDate);

    if (d.toString() === 'Invalid Date') return undefined;
    else return d;
  }, [maxDate]);

  const minDateMemo = useMemo(() => {
    if (!minDate) return undefined;

    const d = moment(minDate);

    if (d.toString() === 'Invalid Date') return undefined;
    else return d;
  }, [minDate]);

  const checkDisabled = useCallback(
    (d: moment.Moment) => {
      return Boolean(!d || (maxDateMemo && d.isAfter(maxDateMemo)) || (minDateMemo && d.isSameOrBefore(minDateMemo)));
    },
    [minDateMemo, maxDateMemo],
  );

  return (
    <DatePicker
      style={{ width: '100%', boxSizing: 'border-box' }}
      locale={locale}
      format={format}
      value={inputValue}
      disabledDate={checkDisabled}
      onChange={onChangeHandler}
    />
  );
};
