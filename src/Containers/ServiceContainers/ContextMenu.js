import React from 'react';
import { Menu, MenuItem } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { setContextMenu, setRowData } from '../../Redux/actions/data.action';

const initialState = {
  mouseX: null,
  mouseY: null,
};

export const ContextMenu = () => {
  const state = useSelector((state) => state.data.contextMenu);
  const gridApi = useSelector((state) => state.data.gridApi);
  const rowTemplate = useSelector((state) => state.data.template);
  const currentRow = useSelector((state) => state.data.currentRow);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(setContextMenu(initialState));
  };

  const onDeleteRow = () => {
    const putData = [];

    gridApi.forEachNode((node) => {
      putData.push(node.data);
    });

    putData.splice(currentRow, 1);
    dispatch(setRowData(putData));
    gridApi.setRowData(putData);
    handleClose();
  };

  const addNewRow = (position) => {
    const newRow = { ...rowTemplate };
    if (position === 'before') {
      gridApi.applyTransaction({
        add: [newRow],
        addIndex: currentRow,
      });
    } else {
      gridApi.applyTransaction({
        add: [newRow],
        addIndex: currentRow + 1,
      });
    }
    gridApi.redrawRows();
    handleClose();
  };

  return (
    <Menu
      keepMounted
      open={state.mouseY !== null}
      onClose={handleClose}
      anchorReference="anchorPosition"
      anchorPosition={
        state.mouseY !== null && state.mouseX !== null
          ? { top: state.mouseY, left: state.mouseX }
          : undefined
      }
    >
      <MenuItem onClick={onDeleteRow}>Удалить строку</MenuItem>
      <MenuItem onClick={() => addNewRow('before')}>
        Добавить строку до
      </MenuItem>
      <MenuItem onClick={() => addNewRow('after')}>
        Добавить строку после
      </MenuItem>
    </Menu>
  );
};
