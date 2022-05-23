import { Button, Drawer, Input } from '@sas/ui-kit';
import React, { FC, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { api, endpoints } from '../../../api';
import { setCurrentTable, setTabs } from '../../../Redux/actions/data.action';
import { rootReducer } from '../../../Redux/rootReducer';
import { TabsType } from './ServiceHeader';

type PropsType = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  action: string;
  targetTab: TabsType;
};
type RootState = ReturnType<typeof rootReducer>;
export const AddTabsServiceHeader: FC<PropsType> = ({
  setOpen,
  action,
  targetTab,
}) => {
  const currentProjectID = Number(localStorage.getItem('currentProjectId'));
  const { currentProjectId } = useSelector(
    (state: { data: { currentProjectId: number } }) => state.data
  );
  const tabs = useSelector((state: RootState) => state.data.tabs).map(
    (el: {
      id: number;
      title: string;
      canCopy: boolean;
      canCreate: boolean;
    }) => ({
      value: el.id,
      label: el.title,
      canCopy: el.canCopy,
      canCreate: el.canCreate,
    })
  );
  const [inputValue, setInputValue] = useState('');
  const [copyTableName, setCopyTableName] = useState('');
  const [pickSampleValue, setPickSampleValue] = useState<TabsType | null>(
    targetTab
  );
  const [copyTableSample, setCopyTableSample] = useState<TabsType | null>(
    targetTab
  );
  const sortedTabsForCopy = useMemo(
    () => tabs.filter((tab: TabsType) => tab.canCopy),
    [tabs]
  );
  const sortedTabsForCreate = useMemo(
    () => tabs.filter((tab: TabsType) => tab.canCreate),
    [tabs]
  );

  const dispatch = useDispatch();

  const submitHandler = async () => {
    if (pickSampleValue && inputValue !== '') {
      try {
        const obj = {
          name: inputValue,
        };
        const { data } = await api.post(
          endpoints.createTabs(currentProjectID, pickSampleValue.value),
          obj
        );
        dispatch(setCurrentTable(data.payload.id));
        const { data: tabs } = await api(endpoints.getTabs(currentProjectId));
        dispatch(setTabs(tabs.payload));
        setOpen((prev) => !prev);
      } catch (e) {
        toast.error('Произошла ошибка');
      }
    } else {
      !pickSampleValue && toast.error('Выберите шаблон');
      inputValue === '' && toast.error('Укажите название');
    }
  };
  const submitHandlerCopyTable = async () => {
    if (copyTableSample && copyTableName !== '') {
      try {
        const obj = {
          name: copyTableName,
        };
        const response = await api.post(
          endpoints.copyTable(currentProjectID, copyTableSample.value),
          obj
        );
        const { data } = await api(endpoints.getTabs(currentProjectId));
        dispatch(setTabs(data.payload));
        dispatch(setCurrentTable(response.data.payload.id));
        setOpen((prev) => !prev);
      } catch (e) {
        toast.error('Произошла ошибка');
      }
    } else {
      !copyTableSample && toast.error('Выберите таблицу');
      copyTableName === '' && toast.error('Укажите название');
    }
  };

  return (
    <Drawer
      isOpenMenu={true}
      onCloseMenu={() => setOpen((prev: boolean) => !prev)}
      title={''}
    >
      {action === 'sample' && (
        <>
          <h2>Создать по шаблону</h2>
          <Input
            placeholder={'Введите название'}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Select
            placeholder={'Выберите шаблон'}
            options={sortedTabsForCreate}
            onChange={(option) => setPickSampleValue(option)}
            value={pickSampleValue}
          />
          <Button
            onClick={submitHandler}
            color={'primary'}
            variant="contained"
            type={'submit'}
          >
            Создать
          </Button>
        </>
      )}
      {action === 'copy' && (
        <>
          <h2>Копировать таблицу</h2>
          <Input
            placeholder={'Введите название'}
            value={copyTableName}
            onChange={(e) => setCopyTableName(e.target.value)}
          />
          <Select
            placeholder={'Выберите таблицу'}
            options={sortedTabsForCopy}
            value={copyTableSample}
            onChange={(option) => setCopyTableSample(option)}
          />
          <Button
            onClick={submitHandlerCopyTable}
            color={'primary'}
            variant="contained"
            type={'submit'}
          >
            Копировать таблицу
          </Button>
        </>
      )}
    </Drawer>
  );
};
