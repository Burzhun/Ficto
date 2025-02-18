import React, { FC, useMemo, useState } from 'react';
import { Props, OnChangeValue, IndicatorsContainerProps, MenuPlacement } from 'react-select';
import AsyncSelect from 'react-select/async';
import { components } from 'react-select';
import { ClearButtonUI, IndicatorContainerUI, SelectEditorContainer } from './styled';
import { OptionType } from '../../types';
import axios from 'axios';
import { message } from 'antd';

type SelectPropsType = {
  onChangeValue: (option: OnChangeValue<OptionType, false>) => void;
  onClearCell?: () => void;
  menuPortalTargetUI: Element;
  urlAdditional?: string;
  rowHeight: number;
  loadOptions: string;
  placeholder: string | undefined;
  readonly: boolean;
  menuPlacement?: MenuPlacement;
};

export const AsyncSelectEditor: FC<Props & SelectPropsType> = (props) => {
  const {
    menuPortalTargetUI,
    loadOptions,
    onClearCell,
    placeholder,
    onChangeValue,
    inputValue,
    rowHeight,
    menuPlacement,
  } = props;
  const [value, setValue] = useState(inputValue);
  const [key, setKey] = useState(1);

  const setOptions = async (inputValue: string) => {
    try {
      let urlAdditional = props.urlAdditional || '';

      if (!loadOptions.includes('?')) urlAdditional = '?' + urlAdditional;

      if (inputValue) urlAdditional += '&search=' + inputValue;

      const response = await fetch(loadOptions + urlAdditional);
      const data = await response.json();

      return data.payload;
    } catch (e) {
      if (axios.isAxiosError(e)) {
        message.error(e?.response?.data?.message);
      }
    }
  };

  const setLoadMessage = () => {
    return 'Загрузка...';
  };

  const setNoOptions = () => 'Ничего не найдено';

  const onChangeHandler = (options: OnChangeValue<OptionType, false>) => {
    if (options?.label && options?.value) {
      onChangeValue({ label: options.label, value: options.value });
    }
  };

  const makeStyle = useMemo(
    () => ({
      control: () => ({
        height: rowHeight - 1,
        minHeight: 10,
        lineHeight: 'normal',
        display: 'flex',
      }),
      dropdownIndicator: () => ({
        height: rowHeight - 1,
        padding: '8px 5px',
      }),
    }),
    [rowHeight],
  );

  const clearValue = () => {
    if (onClearCell) onClearCell();

    setValue('');
    setKey(key + 1);
  };

  const IndicatorsContainer = (props: IndicatorsContainerProps<OptionType, false>) => {
    return (
      <IndicatorContainerUI>
        {onClearCell && (
          <ClearButtonUI
            onClick={() => {
              props.clearValue();
              clearValue();
            }}
          />
        )}
        <components.IndicatorsContainer {...props} />
      </IndicatorContainerUI>
    );
  };

  return (
    <SelectEditorContainer>
      <AsyncSelect
        placeholder={placeholder}
        autoFocus
        key={key}
        cacheOptions
        openMenuOnClick={false}
        loadingMessage={setLoadMessage}
        defaultOptions
        onInputChange={(newValue) => {
          if (value && !newValue) clearValue();
          else setValue(newValue);
        }}
        menuPlacement={menuPlacement || 'bottom'}
        noOptionsMessage={setNoOptions}
        inputValue={value}
        onChange={onChangeHandler}
        loadOptions={setOptions}
        menuPortalTarget={menuPortalTargetUI as HTMLElement}
        styles={makeStyle}
        components={{
          IndicatorsContainer,
          LoadingIndicator: undefined,
        }}
      />
    </SelectEditorContainer>
  );
};

type AsyncSelectEditorComponentProps = {
  value?: string;
  onChange: (e: string | undefined) => void;
  url: string;
  readonly: boolean;
};
export const AsyncSelectEditorComponent = (props: AsyncSelectEditorComponentProps) => {
  return (
    <AsyncSelectEditor
      inputValue={props.value}
      onChangeValue={(e) => props.onChange(e?.label)}
      rowHeight={35}
      menuPortalTargetUI={document.body}
      loadOptions={props.url}
      onClearCell={() => props.onChange(undefined)}
      placeholder={''}
      readonly={props.readonly}
    />
  );
};
