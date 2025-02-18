import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Table, filterRowGenerator, IFiltersData } from '@ficto/fictable';
import { Button } from '@ficto/sas-ui-kit';

import '@ficto/fictable/dist/styles.css';
import { tableContext } from '../../store/Table';

import { message } from 'antd';
import { NewTableHead } from './NewTableHead';
import { io, Socket } from 'socket.io-client';
import useTable from './useTable';
import { ErrorProjectWrapper } from './ServiceStyle';
import { userContext } from '../../store/User';
import { Loader } from '../ui/Loader';
import { SocketExportControls } from './types';
import { useLocation } from 'react-router-dom';

export const NewTable = React.forwardRef(function NewTable(_props, ref: React.ForwardedRef<SocketExportControls>) {
  const { state } = useContext(tableContext);
  const { state: userState } = useContext(userContext);
  const { projectId, selectedTable } = state;
  const [socket, setSocket] = useState<Socket>();
  const [loading, setLoading] = useState<boolean>(true);
  const [socketConnected, setSocketConnected] = useState(false);
  const [filters, setFilters] = useState<IFiltersData>();
  const [filterChanged, setFilterChanged] = useState(false);
  const [token, setToken] = useState('');
  const [messageApi] = message.useMessage();
  const { pathname } = useLocation();

  const [isErrorInTable, setIsErrorInTable] = useState(false);
  const showError = useCallback(() => setIsErrorInTable(false), []);

  useEffect(() => {
    if (!socketConnected && token) {
      setSocket(
        import.meta.env.VITE_APP_SOCKET_HOST
          ? io(import.meta.env.VITE_APP_SOCKET_HOST, {
              query: { token: token },
              transports: ['websocket'],
            })
          : io({
              path: '/api/sockets/',
              query: { token: token },
              transports: ['websocket'],
            }),
      );
    }
  }, [socketConnected, token]);

  useEffect(() => {
    setToken(localStorage.getItem('userToken') as string);
  }, []);

  useEffect(() => {
    setFilters(undefined);
  }, [selectedTable]);

  const filtersChangeHandler = useCallback(() => {
    setFilterChanged(true);
  }, []);

  const {
    loadTable,
    handleDynamicTable,
    staticData,
    handleImportedChanges,
    reMeasuredRows,
    blocks,
    updateData,
    addRowToEnd,
  } = useTable({
    selectedTable,
    setLoading,
    token,
    showError,
    socketConnected,
    projectId,
    socket,
    ref,
    userLogin: userState.login,
    projectName: state.projectData?.name || '',
  });

  const errorFromSocket = useCallback(
    ({ errorMessage, warningMessage }: { errorMessage: string; warningMessage?: string }) => {
      if (errorMessage) {
        setIsErrorInTable(true);
      }

      if (warningMessage) {
        messageApi.open({
          type: 'warning',
          content: warningMessage,
        });
      }
    },
    [messageApi],
  );

  const messageOpen = useCallback(({ type, text }: { type?: 'success' | 'error'; text: string }) => {
    message.open({ type, content: text });
  }, []);

  useEffect(() => {
    socket?.on('connect', () => {
      setSocketConnected(true);
    });

    socket?.on('disconnect', () => {
      setSocketConnected(false);
    });
    if (!window.tableSwitching) socket?.connect();
    else setSocketConnected(true);

    window.tableSwitching = false;

    return () => {
      if (!window.tableSwitching) {
        socket?.disconnect();
        window.tableSwitching = false;
      }
    };
  }, [socket]);

  useEffect(() => {
    socket?.on('error', errorFromSocket);

    return () => {
      socket?.off('error', errorFromSocket);
    };
  }, [errorFromSocket, socket]);

  if (isErrorInTable)
    return (
      <ErrorProjectWrapper>
        <h1>Не удалось загрузить проект</h1>
        <Button onClick={() => loadTable()}>Попробовать снова</Button>
      </ErrorProjectWrapper>
    );

  return (
    <>
      {(staticData?.options && staticData?.headerData && staticData?.bodyData && !loading && (
        <>
          {!pathname.includes('control') && (
            <NewTableHead
              handleImportedChanges={handleImportedChanges}
              addRowToEnd={addRowToEnd}
              clearFilters={() => {
                setFilterChanged(false);
                staticData && setFilters(filterRowGenerator(staticData));
              }}
              useFilters={staticData?.options.useFilter!==false}
              showFilter={!!filters}
              canClear={filterChanged}
              setShowFilter={(val) => setFilters(val ? filterRowGenerator(staticData) : undefined)}
            />
          )}
          <Table
            //убираем кнопку добавления строки в таблицу если она на странице управление проектами
            dynamicType={
              state.options?.type === 'dinamic' &&
              state.projectData?.status?.current.slug === 'onWork' &&
              !pathname.includes('control')
            }
            filters={filters}
            setFilters={setFilters}
            filterChanged={filtersChangeHandler}
            reMeasuredRows={reMeasuredRows}
            bodyData={staticData?.bodyData}
            blocks={blocks}
            headsData={staticData?.headerData}
            footerData={staticData?.footerData}
            options={staticData?.options}
            handleDynamicTable={handleDynamicTable}
            cellEditEndFn={updateData}
            cellEditStartFn={updateData}
            connected={socketConnected}
            onMessage={messageOpen}
            //если страница управление проектами то таблица ридонли
            readOnly={!(state.projectData?.status?.current.slug === 'onWork') || !!pathname.includes('control')}
            rowList={staticData?.rowList}
          />
        </>
      )) || <Loader />}
    </>
  );
});
