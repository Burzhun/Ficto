import React, { FC, useMemo, useState } from 'react';
import { Props, IndicatorsContainerProps, MenuProps } from 'react-select';
import AsyncSelect from 'react-select/async';
import { components } from 'react-select';
import { IndicatorContainerUI, SelectEditorContainer } from './styled';
import { OptionType } from '../../types';
import { CloseSquareOutlined } from '@ant-design/icons';
import axios from 'axios';
import { message } from 'antd';

type SelectPropsType = {
  onChangeValue: (option: string[]) => void;
  onClearCell?: () => void;
  menuPortalTargetUI: Element;
  urlAdditional?: string;
  rowHeight: number;
  loadOptions: string;
  placeholder: string | undefined;
  readonly: boolean;
  inputValue: string[];
  menuPlacement?: string;
};

export const MultiAsyncSelectEditor: FC<Props & SelectPropsType> = (props) => {
  const { menuPortalTargetUI, loadOptions, placeholder, onChangeValue, inputValue, rowHeight, menuPlacement } = props;
  const [value, setValue] = useState<string[]>(inputValue);

  const setOptions = async (input: string) => {
    try {
      let urlAdditional = props.urlAdditional || '';

      if (!loadOptions.includes('?')) urlAdditional = '?' + urlAdditional;

      if (input) urlAdditional += '&search=' + input;

      const response = await fetch(loadOptions + urlAdditional);
      const data = await response.json();
      const payload: OptionType[] = data.payload;

      return payload || [];
    } catch (e) {
      if (axios.isAxiosError(e)) {
        message.error(e?.response?.data?.message);
      }

      return [];
    }
  };

  const setLoadMessage = () => {
    return 'Загрузка...';
  };

  const setNoOptions = () => 'Ничего не найдено';

  const onChangeHandlerMulti = (option1: unknown) => {
    const t: readonly OptionType[] = option1 as readonly OptionType[];
    const options: string[] = [];
    t.forEach((element) => {
      if (!options.includes(element.label)) {
        options.push(element.label);
      }
    });
    setValue(options);
    onChangeValue(options);
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

  const IndicatorsContainer = (props: IndicatorsContainerProps<OptionType, true>) => {
    return (
      <IndicatorContainerUI>
        <components.IndicatorsContainer {...props} />
      </IndicatorContainerUI>
    );
  };

  const removeOption = (option: string) => {
    setValue(inputValue.filter((t) => t !== option));
    onChangeValue(inputValue.filter((t) => t !== option));
  };

  const Menu = (props: MenuProps<{ label: string; value: string }>) => {
    const menuHeaderStyle = {
      backgroundColor: 'white',
      border: '1px solid black',
      width: '400px',
    };

    return (
      <React.Fragment>
        {inputValue && (
          <div style={menuHeaderStyle}>
            {inputValue.map((t, i) => (
              <div style={{ borderBottom: '1px solid grey', margin: '5px 5px 0 5px' }} key={'async_select' + t + i}>
                <CloseSquareOutlined
                  onMouseDown={(e) => {
                    e.preventDefault();
                    removeOption(t);
                  }}
                  style={{ cursor: 'pointer' }}
                />{' '}
                {t}
              </div>
            ))}
          </div>
        )}

        <components.Menu {...props}>
          <div style={{ backgroundColor: 'white', width: '400px' }}>{props.children}</div>
        </components.Menu>
      </React.Fragment>
    );
  };

  return (
    <SelectEditorContainer>
      <AsyncSelect
        isMulti
        placeholder={placeholder}
        autoFocus
        //{...(t ? { isMulti } : {})}
        closeMenuOnSelect={false}
        cacheOptions
        openMenuOnClick={true}
        loadingMessage={setLoadMessage}
        menuPlacement={menuPlacement || 'bottom'}
        defaultOptions
        value={value?.map((t) => ({ label: t, value: t }))}
        noOptionsMessage={setNoOptions}
        onChange={onChangeHandlerMulti}
        loadOptions={setOptions}
        menuPortalTarget={menuPortalTargetUI as HTMLElement}
        styles={makeStyle}
        components={{
          IndicatorsContainer,
          LoadingIndicator: undefined,
          Menu,
        }}
      />
    </SelectEditorContainer>
  );
};
