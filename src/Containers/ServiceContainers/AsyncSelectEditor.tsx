import React, { FC, useMemo, useState } from 'react';
import {
  components,
  GroupTypeBase,
  IndicatorContainerProps,
  Props,
  ValueType,
} from 'react-select';
import AsyncSelect from 'react-select/async';
import { CSSObject } from 'styled-components';
import {
  ClearButtonUI,
  IndicatorContainerUI,
  SelectEditorContainer,
} from './styled';

export type OptionType =
  | {
      value: string;
      label: string;
    }
  | GroupTypeBase<OptionType>;

type SelectPropsType = {
  onChangeValue(option: ValueType<OptionType, false>): void;
  onClearCell?: () => void;
  menuPortalTargetUI: Element;
};

export const AsyncSelectEditor: FC<Props & SelectPropsType> = (props) => {
  const {
    inputValue,
    onChangeValue,
    rowHeight,
    menuPortalTargetUI,
    loadOptions,
    onClearCell,
    placeholder,
  } = props;
  const [value, setValue] = useState(inputValue);

  const setOptions = async (inputValue: string) => {
    try {
      const response = await fetch(loadOptions + inputValue);
      const data = await response.json();
      return data.payload;
    } catch (e) {}
  };

  const setLoadMessage = () => {
    return 'Загрузка...';
  };

  const setNoOptions = () => 'Ничего не найдено';

  const onChangeHandler = (options: ValueType<OptionType, false>) => {
    if (options?.label && options?.value) {
      onChangeValue({ label: options.label, value: options.value });
    }
  };

  const makeStyle = useMemo(
    () => ({
      control: (provided: CSSObject) => ({
        ...provided,
        height: rowHeight - 1,
        minHeight: 10,
        lineHeight: 'normal',
        width: 300,
      }),
      dropdownIndicator: (provided: CSSObject) => ({
        ...provided,
        height: rowHeight - 1,
      }),
    }),
    [rowHeight]
  );

  const IndicatorsContainer = (
    props: IndicatorContainerProps<OptionType, false>
  ) => {
    return (
      <IndicatorContainerUI>
        {onClearCell && (
          <ClearButtonUI
            onClick={() => {
              props.clearValue();
              onClearCell();
              setValue('');
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
        cacheOptions
        openMenuOnClick={false}
        loadingMessage={setLoadMessage}
        defaultOptions
        onInputChange={(newValue) => setValue(newValue)}
        noOptionsMessage={setNoOptions}
        inputValue={value}
        onChange={onChangeHandler}
        loadOptions={setOptions}
        menuPortalTarget={menuPortalTargetUI as HTMLElement}
        styles={makeStyle}
        components={{
          IndicatorsContainer,
          LoadingIndicator: null,
        }}
      />
    </SelectEditorContainer>
  );
};

export const AsyncSelectEditorComponent = (props) => {
  return (
    <AsyncSelectEditor
      inputValue={props.value}
      onChangeValue={(e) => props.onChange(e?.label)}
      rowHeight={35}
      menuPortalTargetUI={document.body}
      loadOptions={props.url}
      onClearCell={() => props.onChange(null)}
      placeholder={''}
    />
  );
};
