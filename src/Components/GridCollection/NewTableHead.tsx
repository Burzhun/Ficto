import React, { useCallback, useContext, useMemo, useState } from 'react';
import { ColumnGraph } from '../../types';
import { api } from '../../api';
import { toast } from 'react-toastify';
import { Button, ButtonTableBox, LegendBox, RightSide, TableButton } from './ServiceStyle';
import { setTablesData, tableContext } from '../../store/Table';
import { MenuComponent } from '../ui/MenuFromLast';
import 'react-toastify/dist/ReactToastify.css';
import { PrefilingMenuComponent } from '../ui/PrefilingMenu';
import { getData } from '../../store/Table/TableContext';
import { MainNavButtons } from '../../pages/ServicePage/styled';
import { ReactComponent as Add } from '../../assets/img/Plus.svg';
import { ReactComponent as Filters } from '../../assets/img/Funnel.svg';
import { ReactComponent as Close } from '../../assets/img/Close.svg';
import { Modal, Tooltip } from '@ficto/sas-ui-kit';
import { UploadFileModal } from '../UploadFileModal';
import { FileEditorData } from '../FileInput/FileInput';

const { confirm } = Modal;

type PreviousProjectData = {
  loading?: boolean;
  useFilters?: boolean;
  addRowToEnd: () => void;
  handleImportedChanges: (excelData: string | ArrayBuffer | null, tableId: number, projectId: number) => void;
  showFilter?: boolean;
  canClear?: boolean;
  setShowFilter: (show: boolean) => void;
  graphs?: ColumnGraph[] | undefined;
  signable?: boolean;
  reloadProject?: () => void;
  clearFilters: () => void;
  showAddButton?: boolean;
};

const title = 'Загрузка данных из предыдущего отчета';
const message =
  'При загрузке данных из предыдущего отчета имеющаяся информация будет полностью заменена. Продолжить загрузку данных?';

export const NewTableHead = (props: PreviousProjectData) => {
  const [file, setFile] = useState<FileEditorData>();
  const [fileModalOpen, setFileModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(1);

  const tc = useContext(tableContext);
  const dispatch = tc.dispatch;
  const { periodical } = tc.state.data || {};
  const { type, prefiling } = tc.state.options || {};
  const status = tc.state.projectData?.status;

  const loadMethod = useCallback(
    async (url: string) => {
      const response = await api.post(url, {});

      if (response.data.payload) {
        const data = response.data.payload;

        if (data.data) {
          dispatch(setTablesData({ tablesData: getData(data.data) }));
        }
      }
    },
    [dispatch],
  );

  const handleOk = () => {
    setLoading(true);

    try {
      props.handleImportedChanges(file?.data || '', tc.state.selectedTable || 0, +(tc.state.projectId || ''));

      // dispatch(setTablesData({ tablesData: response.data.data }));

      setLoading(false);
      setLoading(false);
      setProgress(0);
      setFile({});
      setFileModalOpen(false);
    } catch (err) {
      setLoading(false);
      const error = (err as { response: { data: { message: string } } }).response.data.message;
      toast.error(error || 'Не удалось сохранить файл!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const onWork = useMemo(() => {
    return status?.current.slug === 'onWork';
  }, [status]);

  return (
    <>
      <LegendBox>
        <RightSide>
          {onWork && type === 'dinamic' && (
            <Tooltip content="Добавить строку" position="topLeft" zIndex={3}>
              <span>
                <TableButton
                  onClick={() => {
                    props.addRowToEnd();
                  }}
                  suffixIcon={<Add />}
                />
              </span>
            </Tooltip>
          )}
          {props.useFilters && (
            <TableButton
              active={props.showFilter}
              onClick={() => props.setShowFilter(!props.showFilter)}
              prefixIcon={<Filters />}
            >
              Фильтр
            </TableButton>
          )}
          {props.canClear && (
            <Button prefixIcon={<Close />} type="menu" onClick={props.clearFilters}>
              Сбросить
            </Button>
          )}
          {onWork &&
            prefiling &&
            prefiling.map((pref) => (
              <PrefilingMenuComponent key={'prefilingComponent' + pref.title} pref={pref} loadMethod={loadMethod} />
            ))}
        </RightSide>
        <ButtonTableBox>
          <MainNavButtons>
            {onWork && tc.state.projectData?.importable && type === 'dinamic' && (
              <Button onClick={() => setFileModalOpen(true)}>Импорт данных</Button>
            )}
            {periodical && (
              <MenuComponent
                openDialog={() =>
                  confirm({
                    title: title,
                    confirmText: message,
                    okText: 'Да',
                    cancelText: 'Нет',
                    getPopupContainer: () => document.getElementById('service-wrapper') as HTMLElement,
                  })
                }
              />
            )}
          </MainNavButtons>
        </ButtonTableBox>
      </LegendBox>
      <UploadFileModal
        open={fileModalOpen}
        onCancel={() => setFileModalOpen(false)}
        container={document.getElementById('service-wrapper') as HTMLElement}
        loading={loading}
        setFile={setFile}
        setLoading={setLoading}
        setProgress={setProgress}
        file={file}
        progress={progress}
        handleOk={handleOk}
      />
    </>
  );
};
