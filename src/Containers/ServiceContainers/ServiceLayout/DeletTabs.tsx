import { Button, Drawer } from '@sas/ui-kit';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { api, endpoints } from '../../../api';
import { setCurrentTable } from '../../../Redux/actions/data.action';

type PropsType = {
  setOpenDeleteTabs: React.Dispatch<React.SetStateAction<null>>;
  id: number;
  setSubEl: React.Dispatch<React.SetStateAction<null>>;
  setUpdate: React.Dispatch<React.SetStateAction<number>>;
  currentTableId: number;
  tabsList: {
    id: number;
    name: string;
  }[];
};

const DeletTabs: FC<PropsType> = ({
  setOpenDeleteTabs,
  setSubEl,
  id,
  setUpdate,
  tabsList,
  currentTableId,
}) => {
  const dispatch = useDispatch();
  const submitHandler = async () => {
    try {
      await api.delete(endpoints.tabs(id));
      setUpdate((prev: number) => prev + 1);
      if (id === currentTableId) {
        tabsList.forEach((node, idx) => {
          if (node.id === currentTableId) {
            dispatch(setCurrentTable(tabsList[idx - 1].id));
          }
        });
      }
      setOpenDeleteTabs(null);
      setSubEl(null);
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      toast.error(e.response.data.error);
    }
  };
  return (
    <Drawer
      isOpenMenu={true}
      onCloseMenu={() => {
        setOpenDeleteTabs(null);
        setSubEl(null);
      }}
      title={'Вы действительно хотите удалить таблицу?'}
    >
      <Button
        onClick={submitHandler}
        color={'primary'}
        variant="contained"
        type={'submit'}
      >
        Удалить
      </Button>
      <Button
        onClick={() => {
          setOpenDeleteTabs(null);
          setSubEl(null);
        }}
        color={'primary'}
        variant="contained"
        type={'submit'}
      >
        Отменить
      </Button>
    </Drawer>
  );
};

export default DeletTabs;
