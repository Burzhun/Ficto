import { Button, Drawer, Input } from '@sas/ui-kit';
import React, { FC, useState } from 'react';
import { toast } from 'react-toastify';
import { api, endpoints } from '../../../api';

type PropsType = {
  setOpenEditTabs: React.Dispatch<React.SetStateAction<null>>;
  node: {
    id: number;
    title: string;
  };
  setUpdate: React.Dispatch<React.SetStateAction<number>>;
  setSubEl: React.Dispatch<React.SetStateAction<null>>;
};
const EditTabs: FC<PropsType> = ({
  node,
  setOpenEditTabs,
  setSubEl,
  setUpdate,
}) => {
  const [inputValue, setInputValue] = useState<string>(node.title);
  const submitHandler = async () => {
    const obj = { name: inputValue };
    try {
      await api.put(endpoints.tabs(node.id), obj);
      setUpdate((prev: number) => prev + 1);
      setSubEl(null);
      setOpenEditTabs(null);
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
        setOpenEditTabs(null);
        setSubEl(null);
      }}
      title={'Переименовать'}
    >
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <Button
        onClick={submitHandler}
        color={'primary'}
        variant="contained"
        type={'submit'}
      >
        Переименовать
      </Button>
      <Button
        onClick={() => {
          setOpenEditTabs(null);
          setSubEl(null);
        }}
        color={'primary'}
        variant="contained"
        type={'submit'}
      >
        Отменить.
      </Button>
    </Drawer>
  );
};

export default EditTabs;
