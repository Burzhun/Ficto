import {
  IBlocks,
  IDynamicTableMessage,
  IOptionsData,
  IReqData,
  SocketTableLoadData,
  reMeasureChangedRows,
  reMeasureRows,
} from '@ficto/fictable';
import { useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { TypeOptions, toast } from 'react-toastify';
import { Socket } from 'socket.io-client';
import {
  IData,
  ITableData,
  ReloadTableData,
  SocketExportControls,
  SocketTableUpdateData,
  TableUpdatedRowsData,
  TemplateChange,
} from '../../components/GridCollection/types';
import { downloadFileBase64 } from '../../helpers/downloads';
import { message } from 'antd';
import { IHeaderData } from '@ficto/fictable/dist/common/types';

const updateRowsData = (rowChanges: TemplateChange[], tableData: IData, rowList: string[]): string[] => {
  rowChanges.forEach((tableChange) => {
    switch (tableChange.type) {
      case 'add':
        const i = rowList.findIndex((r) => r === tableChange.rowId);

        if (i >= 0 && tableChange.newRowId) {
          rowList.splice(i + 1, 0, tableChange.newRowId);
          tableData[tableChange.newRowId] = {};
        }

        break;
      case 'addBefore':
        {
          const i = rowList.findIndex((r) => r === tableChange.rowId);

          if (i >= 1 && tableChange.newRowId) {
            rowList.splice(i, 0, tableChange.newRowId);
            tableData[tableChange.newRowId] = {};
          }
        }

        break;
      case 'delete':
        {
          const i = rowList.findIndex((r) => r === tableChange.rowId);

          if (i >= 0 && tableChange.rowId) {
            rowList.splice(i, 1);
            delete tableData[tableChange.rowId];
          }
        }

        break;
      case 'updateCell':
        if (tableChange.rowId && tableChange.colId && tableData[tableChange.rowId]) {
          if (!tableData[tableChange.rowId][tableChange.colId]) tableData[tableChange.rowId][tableChange.colId] = {};

          tableData[tableChange.rowId][tableChange.colId].value = tableChange.value;
        }

        break;
      case 'protectRow':
        if (tableChange.rowId && tableData[tableChange.rowId]) {
          tableData[tableChange.rowId].protected = !tableData[tableChange.rowId].protected;
        }

        break;
      case 'duplicate':
        {
          const i = rowList.findIndex((r) => r === tableChange.rowId);

          if (i >= 0 && tableChange.newRowId && tableChange.rowId) {
            rowList.splice(i, 0, tableChange.newRowId);
            tableData[tableChange.newRowId] = tableData[tableChange.rowId];
          }
        }

        break;
    }
  });

  return rowList;
};

const useTable = ({
  socketConnected,
  selectedTable,
  token,
  projectId,
  showError,
  projectName,
  setLoading,
  userLogin,
  socket,
  ref,
}: {
  socketConnected: boolean;
  selectedTable?: number;
  showError: () => void;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  token: string;
  projectId?: string;
  projectName: string;
  userLogin: string;
  socket?: Socket;
  ref: React.ForwardedRef<SocketExportControls>;
}) => {
  const [socketId, setSocketId] = useState<string | null>(null);
  const [staticData, setStaticData] = useState<ITableData>();
  const [reMeasuredRows, setReMeasuredRows] = useState<string[]>([]);
  const [blocks, setBlocks] = useState<IBlocks>({});

  const addRowToEnd = useCallback(() => {
    staticData?.rowList &&
      socket?.emit('addRow', {
        tableId: selectedTable,
        currentRowId: staticData.rowList.at(-1),
        before: false,
      });
  }, [staticData?.rowList, socket, selectedTable]);

  const updateOptions = useCallback((data: { options?: IOptionsData }) => {
    setStaticData((prev) => {
      const newPrev = { ...prev, ...data } as ITableData;
      newPrev.options = reMeasureRows(newPrev.options, newPrev.bodyData, newPrev.headerData, newPrev.rowList);

      return newPrev;
    });
  }, []);

  const reloadTable = useCallback((data: ReloadTableData) => {
    setStaticData({
      options: reMeasureRows(data.options, data.data, data.header, data.rowList),
      bodyData: data.data,
      headerData: data.header,
      footerData: data.summaryValues,
      triggers: data.triggers || [],
      rowList: data.rowList,
    });
    if (data.message)
      toast.info(data.message, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
  }, []);

  const updateFromSocket = useCallback(
    (messageData: SocketTableUpdateData) => {
      if (!staticData?.options) return;

      const isRowPresents = new Set(staticData.rowList);
      const isColPresents = new Set(staticData.options.columnsList);

      const newBodyData = { ...staticData.bodyData };
      const updatedRows: string[] = [];

      if (messageData.blocks) {
        const blocks: IBlocks = {};
        Object.entries(messageData.blocks).forEach(([rowId, cols]) => {
          blocks[rowId] = cols;
        });
        setBlocks(blocks);
      }

      if ('changes' in messageData && Object.keys(messageData.changes).length) {
        Object.entries(messageData.changes).forEach(([rowId, row]) => {
          if (!newBodyData[rowId]) newBodyData[rowId] = {};

          if (isRowPresents.has(rowId)) {
            updatedRows.push(rowId.toString());
            Object.entries(row).forEach(([keyC, col]) => {
              if (isColPresents.has(keyC)) {
                if (!newBodyData[rowId][keyC]) {
                  newBodyData[rowId][keyC] = {};
                }

                if (col.inValidMessage === undefined) {
                  delete newBodyData[rowId][keyC].inValidMessage;
                }

                if (col.warningMessage === undefined) {
                  delete newBodyData[rowId][keyC].warningMessage;
                }

                newBodyData[rowId][keyC] = { ...newBodyData[rowId][keyC], ...col };
              }
            });
          }
        });

        updatedRows.length && setReMeasuredRows(updatedRows);

        staticData &&
          setStaticData(() => {
            const newData = { ...staticData };

            if (messageData.summaryValues) {
              newData.footerData = { ...newData.footerData, ...messageData.summaryValues };
            }

            if (messageData.changes) {
              newData.options = reMeasureChangedRows(staticData.options, newBodyData, updatedRows);
            }

            newData.bodyData = newBodyData;

            return newData;
          });
      }
    },
    [staticData],
  );

  const loadTableData = useCallback(
    (data: SocketTableLoadData & { rowList?: string[]; blocks: IBlocks }) => {
      const newData: any = { ...data, headerData: data.header2 };

      if (data.summaryValues) {
        newData['footerData'] = data.summaryValues;
      }

      newData.options = reMeasureRows(data.options, newData.bodyData as IData, data.header2, newData.rowList);

      setStaticData(newData);
      setBlocks(data.blocks);
      setLoading(false);
    },
    [setLoading],
  );

  const loadTableUpdatedData = useCallback((data: TableUpdatedRowsData) => {
    setStaticData((prev) => {
      const newData: ITableData = { ...prev } as ITableData;
      let rowList = prev?.rowList || [];
      rowList = updateRowsData([data.rowChange], newData.bodyData, rowList);
      newData.rowList = rowList.slice(0);
      for (const rowId in data.changes) {
        newData.bodyData[rowId] = { ...newData.bodyData[rowId], ...data.changes[rowId] };
      }

      newData.options = reMeasureRows(newData.options, newData.bodyData, newData.headerData, newData.rowList);

      return newData;
    });
  }, []);

  const handleDynamicTable = ({ messageType, ...rest }: IDynamicTableMessage) => {
    token && socket?.emit(messageType, { tableId: selectedTable, token, ...rest });
  };

  const showMessage = useCallback((data: { message: string; type: TypeOptions | undefined }) => {
    if (data.message)
      toast(data.message, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
        type: data.type,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
  }, []);

  const updateData = useCallback(
    ({ newData, type }: IReqData) => {
      switch (type) {
        case 'update':
          socket?.emit('updateMessage', { data: newData, tableId: selectedTable, token });
          break;
        case 'block':
          socket?.emit('blockMessage', { data: newData, tableId: selectedTable });
          break;
        case 'unblock':
          socket?.emit('unblock', { data: newData, tableId: selectedTable });
          break;
      }
    },
    [socket, selectedTable, token],
  );

  const loadTable = useCallback(() => {
    if (socketConnected && selectedTable && token) {
      showError();
      setStaticData(undefined);
      socket?.emit('loadTableV2', {
        tableId: selectedTable,
        projectId,
        token,
      });
    }
  }, [projectId, selectedTable, showError, socket, socketConnected, token]);

  useEffect(() => {
    loadTable();
  }, [loadTable]);

  useEffect(() => {
    if (socket?.id && socket?.id !== socketId) setSocketId(socket?.id);
  }, [socketId, socket]);

  useImperativeHandle(
    ref,
    () => ({
      exportFromSocket: (currentProjectId: string, fileType: string) => {
        const token = localStorage.getItem('userToken') || '';
        socket?.emit('exportProject', {
          projectId: parseInt(currentProjectId),
          fileType,
          token,
        });
      },
    }),
    [socket],
  );

  const handleImportedChanges = useCallback(
    (excelData: string | ArrayBuffer | null, tableId: number, projectId: number) => {
      socket?.emit('upload', { excelData, tableId, projectId: +(projectId || ''), token });
      setLoading(true);
    },
    [setLoading, socket, token],
  );

  const fileResponse = useCallback(
    ({ data, fileType }: { data: string; fileType: string }) => {
      setLoading(false);
      if (data === 'error') {
        message.error('Не удалось экспортировать проект');

        return;
      }

      downloadFileBase64({
        data,
        name: userLogin + '_' + projectName + '_' + new Date().toLocaleDateString() + '.' + fileType,
      });
    },
    [projectName, setLoading, userLogin],
  );

  useEffect(() => {
    const handlers = [
      { event: 'fileResponse', handler: fileResponse },
      { event: 'msgToClient', handler: updateFromSocket },
      { event: 'generateGridData', handler: loadTableData },
      { event: 'reloadTable', handler: reloadTable },
      { event: 'needMessage', handler: showMessage },
      { event: 'updateOptions', handler: updateOptions },
      { event: 'updatedTable', handler: loadTableUpdatedData },
    ];

    handlers.forEach(({ event, handler }) => {
      socket?.on(event, handler);
    });

    return () => {
      handlers.forEach(({ event, handler }) => {
        socket?.off(event, handler);
      });
    };
  }, [
    fileResponse,
    updateFromSocket,
    loadTableData,
    reloadTable,
    showMessage,
    updateOptions,
    loadTableUpdatedData,
    socket,
  ]);

  const loadUpdatedStaticData = useCallback(
    (data: { changes: TemplateChange[]; headerData: IHeaderData; options: IOptionsData, rowList?: string[] }) => {
      message.info('Таблица обновлена');
      setStaticData((prev) => {
        const newData: ITableData = { ...prev } as ITableData;
        newData.headerData = data.headerData;
        newData.options = data.options;
        const rowList = data.rowList || prev?.rowList || [];
        data.changes.forEach((tableChange) => {
          switch (tableChange.type) {
            case 'add':
              const i = rowList.findIndex((r) => r === tableChange.rowId);

              if (i >= 0 && tableChange.newRowId) {
                rowList.splice(i + 1, 0, tableChange.newRowId);
                newData.bodyData[tableChange.newRowId] = {};
              }

              break;
            case 'addBefore':
              {
                const i = rowList.findIndex((r) => r === tableChange.rowId);

                if (i >= 1 && tableChange.newRowId) {
                  rowList.splice(i, 0, tableChange.newRowId);
                  newData.bodyData[tableChange.newRowId] = {};
                }
              }

              break;
            case 'delete':
              {
                const i = rowList.findIndex((r) => r === tableChange.rowId);

                if (i >= 0 && tableChange.rowId) {
                  rowList.splice(i, 1);
                  delete newData.bodyData[tableChange.rowId];
                }
              }

              break;
            case 'updateCell':
              if (tableChange.rowId && tableChange.colId && newData.bodyData[tableChange.rowId]) {
                if (!newData.bodyData[tableChange.rowId][tableChange.colId])
                  newData.bodyData[tableChange.rowId][tableChange.colId] = {};

                newData.bodyData[tableChange.rowId][tableChange.colId].value = tableChange.value;
              }

              break;
            case 'protectRow':
              if (tableChange.rowId && newData.bodyData[tableChange.rowId]) {
                newData.bodyData[tableChange.rowId].protected = !newData.bodyData[tableChange.rowId].protected;
              }

              break;
            case 'duplicate':
              {
                const i = rowList.findIndex((r) => r === tableChange.rowId);

                if (i >= 0 && tableChange.newRowId && tableChange.rowId) {
                  rowList.splice(i, 0, tableChange.newRowId);
                  newData.bodyData[tableChange.newRowId] = newData.bodyData[tableChange.rowId];
                }
              }

              break;
          }
        });
        newData.rowList = rowList.slice(0);

        newData.options = reMeasureRows(newData.options, newData.bodyData, newData.headerData, newData.rowList);

        return newData;
      });
    },
    [],
  );

  useEffect(() => {
    socket?.on('loadUpdatedStaticData', loadUpdatedStaticData);

    return () => {
      socket?.off('loadUpdatedStaticData', loadUpdatedStaticData);
    };
  }, [loadUpdatedStaticData, socket]);

  const excelUpload = useCallback(
    (payload: { changes: IData; rowList: string[] }) => {
      setStaticData((prev) => {
        const newPrev = JSON.parse(JSON.stringify(prev)) as ITableData;

        newPrev.rowList = payload.rowList;
        newPrev.bodyData = payload.changes;

        return newPrev;
      });
      setLoading(false);
      toast.success('Файл успешно загружен', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
    },
    [setLoading],
  );

  useEffect(() => {
    socket?.on('excelUpload', excelUpload);

    return () => {
      socket?.off('excelUpload', excelUpload);
    };
  }, [excelUpload, socket]);

  return {
    handleDynamicTable,
    staticData,
    reMeasuredRows,
    blocks,
    handleImportedChanges,
    updateData,
    addRowToEnd,
    loadTable,
  };
};

export default useTable;
