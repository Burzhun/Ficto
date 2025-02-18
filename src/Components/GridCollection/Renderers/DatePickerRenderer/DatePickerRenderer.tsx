import React, { FC, useMemo } from 'react';
import { DatePickerRendererUI } from './styled';
import formatFNS from 'date-fns/format';
import parseISO from 'date-fns/parseISO';

type DatePickerRendererProps = {
  value: string;
  format?: string;
  readonly?: boolean;
};

export const DatePickerRenderer: FC<DatePickerRendererProps> = ({ value, readonly, format = 'dd.MM.yyyy' }) => {
  const viewValue = useMemo(() => {
    const result = parseISO(value);

    if (result.toString() === 'Invalid Date') {
      return '';
    }

    return formatFNS(result, format);
  }, [value, format]);

  return <DatePickerRendererUI readonly={readonly}>{viewValue}</DatePickerRendererUI>;
};
