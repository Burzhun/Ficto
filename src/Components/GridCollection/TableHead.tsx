import React, { useCallback, useState, useContext, useMemo } from 'react';
import { HideColumnButton } from './Renderers/HideColumnButton/HideColumnButton';
import { ColumnGraph } from '../../types';
import { toast } from 'react-toastify';
import { api, endpoints } from '../../api';
import { Button, ButtonTableBox, LegendBox, RightSide, TableButton } from './ServiceStyle';
import { setTablesData, setTablesDataChanged, tableContext } from '../../store/Table';
import { ReactComponent as Close } from '../../assets/img/Close.svg';
import { MenuComponent } from '../ui/MenuFromLast';
import { TablesData, LoadTablesResponse, HiddenColumn, HeadersType, TableFilter, ColumnsTree } from '../../types';
import 'react-toastify/dist/ReactToastify.css';
import { AxiosError } from 'axios';
import { PrefilingMenuComponent } from '../ui/PrefilingMenu';
import { getData } from '../../store/Table/TableContext';
import { ReactComponent as Filters } from '../../assets/img/Funnel.svg';
import { ReactComponent as Add } from '../../assets/img/Plus.svg';
import { MainNavButtons } from '../../pages/ServicePage/styled';
import { Modal, Tooltip } from '@ficto/sas-ui-kit';
import { UploadFileModal } from '../UploadFileModal';
import { FileEditorData } from '../FileInput/FileInput';
import { RegionFilter } from '../RegionFilter';

const { confirm } = Modal;

type PreviousProjectData = {
  setPreloadData: (data: TablesData[]) => void;
  setColumn: (c: HiddenColumn | null, type: number, hiddenColumns2: HiddenColumn[], h: HeadersType | undefined) => void;
  headers: HeadersType;
  loading?: boolean;
  useFilters?: boolean;
  insertRow: (rowIdx?: number) => void;
  showFilter?: boolean;
  showHideButton?: boolean;
  filters: TableFilter;
  setFilters: (f: TableFilter) => void;
  hiddenColumns: HiddenColumn[];
  columnTree: ColumnsTree;
  setShowFilter: (show: boolean) => void;
  graphs?: ColumnGraph[] | undefined;
  signable?: boolean;
  reloadProject?: () => void;
  showAddButton?: boolean;
  projectPageTable: boolean;
};

const title = 'Загрузка данных из предыдущего отчета';
const message =
  'При загрузке данных из предыдущего отчета имеющаяся информация будет полностью заменена. Продолжить загрузку данных?';

export const TableHead = (props: PreviousProjectData) => {
  const [file, setFile] = useState<FileEditorData>();
  const [progress, setProgress] = useState(1);
  const tc = useContext(tableContext);
  const dispatch = tc.dispatch;
  const { canSave } = tc.state;
  const { periodical } = tc.state.data || {};
  const { type, validations, prefiling } = tc.state.options || {};
  const { projectId, selectedTable, tablesData, projectData } = tc.state || {};
  const status = tc.state.projectData?.status;
  const [saving, setSaving] = useState<boolean>(false);
  const [fileModalOpen, setFileModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOk = async () => {
    setLoading(true);

    try {
      const response = await api.post(
        endpoints.importFromFile(projectId as unknown as number),
        { tableId: selectedTable, excelData: file?.data },
        {
          headers: {
            Accept: '/',
          },
          onUploadProgress(progressEvent: { loaded: number; total: number }) {
            setProgress(Math.round((progressEvent.loaded / progressEvent.total) * 100));
          },
        },
      );
      dispatch(setTablesData({ tablesData: response.data.data }));

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

  const preloadHandler = async () => {
    try {
      if (projectId) {
        const data = await api.get<LoadTablesResponse>(endpoints.projectDataPrevious(parseInt(projectId)), {});
        data.data.payload.tables.forEach((node) => {
          if (selectedTable === node.id) {
            props.setPreloadData(node.data);
          }
        });
      }
    } catch (e) {
      toast.error('Произошла ошибка при загрузке данных!', {
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

  const saveHandler = async (hideToast = false) => {
    if (!tablesData) return;

    if (validations) {
      let error = false;
      const requiredKeys = validations.required.keys;
      const isCritical = validations.required.critical;
      const messageError = validations.required.message;

      for (const dataNode of tablesData) {
        const keyList = Object.keys(dataNode);
        const intersection = requiredKeys.filter((x) => keyList.includes(x));

        if (intersection.length !== requiredKeys.length) {
          error = true;
          break;
        }

        let intersectionIsEmpty = false;

        for (const keyNode of intersection) {
          if (!dataNode[keyNode]) {
            intersectionIsEmpty = true;
            break;
          }
        }

        if (intersectionIsEmpty) {
          error = true;
          break;
        }
      }

      if (error) {
        if (isCritical) {
          return toast.error(messageError);
        }

        toast.error(messageError);
      }
    }

    setSaving(true);
    window.isSaving = true;
    try {
      if (selectedTable) {
        await api.post(endpoints.createNewTableVersion(selectedTable), { data: [...tablesData] });
        window.isSaving = false;
        setSaving(false);
        dispatch(setTablesDataChanged({ tablesDataChanged: false }));
        if (!hideToast)
          toast.success('Данные сохранены', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
          });
      }
    } catch (e) {
      window.isSaving = false;
      setSaving(false);
      const err = e as AxiosError;
      const errorMessage = err.response?.status === 400 ? err.response?.data?.error : 'Произошла ошибка';
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const showAllColumns = useCallback(() => {
    const sc = props.setColumn;
    sc(null, -2, [], props.headers);
  }, [props.setColumn, props.headers]);

  const loadMethod = useCallback(
    async (url: string) => {
      try {
        const response = await api.post(url, {});

        if (response.data.payload) {
          const data = response.data.payload;

          if (data.data) {
            dispatch(setTablesData({ tablesData: getData(data.data) }));
          }
        }
      } catch (e) {
        const err = e as AxiosError;
        const errorMessage = err.response?.status === 400 ? err.response?.data?.error : 'Произошла ошибка';
        toast.error(errorMessage, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
        });
      }
    },
    [dispatch],
  );

  const onWork = useMemo(() => {
    return status?.current.slug === 'onWork';
  }, [status]);

  return (
    <>
      {!props.projectPageTable ? (
        <LegendBox>
          <RightSide>
            {onWork && (
              <>
                {type === 'dinamic' && onWork ? (
                  <Tooltip content="Добавить строку" position="topLeft" zIndex={3}>
                    <span>
                      <TableButton
                        onClick={() => {
                          props.insertRow();
                        }}
                        suffixIcon={<Add />}
                        disabled={saving}
                      />
                    </span>
                  </Tooltip>
                ) : null}
              </>
            )}
            {props.useFilters && (
              <>
                <TableButton
                  disabled={saving}
                  onClick={() => {
                    props.setShowFilter(!props.showFilter);
                  }}
                  prefixIcon={<Filters />}
                >
                  Фильтр
                </TableButton>
                {Object.keys(props.filters || {}).length > 0 && props.showFilter && (
                  <Button
                    prefixIcon={<Close />}
                    type="menu"
                    disabled={saving}
                    onClick={() => {
                      props.setFilters({});
                    }}
                  >
                    Сбросить
                  </Button>
                )}
              </>
            )}
            {onWork &&
              prefiling &&
              prefiling.map((pref) => (
                <PrefilingMenuComponent key={'prefilingComponent' + pref.title} pref={pref} loadMethod={loadMethod} />
              ))}
            {props.showHideButton && (
              <HideColumnButton
                disabled={saving}
                hiddenColumns={props.hiddenColumns}
                columnTree={props.headers.length ? props.columnTree : undefined}
                setColumn={(column, checked, columns) => {
                  props.setColumn(column, checked, columns, undefined);
                }}
                headers={props.headers}
                showAllColumns={showAllColumns}
              />
            )}
            {tc.state.subjects_federation && <RegionFilter />}
          </RightSide>
          <ButtonTableBox>
            <MainNavButtons>
              {periodical && (
                <MenuComponent
                  openDialog={() =>
                    confirm({
                      title: title,
                      confirmText: message,
                      okText: 'Да',
                      cancelText: 'Нет',
                      onOk: preloadHandler,
                      getPopupContainer: () => document.getElementById('service-wrapper') as HTMLElement,
                    })
                  }
                />
              )}
              {onWork && projectData?.importable && (
                <Button onClick={() => setFileModalOpen(true)}>Импорт данных</Button>
              )}
              {onWork && !props.loading && (
                <Button disabled={saving || !canSave} onClick={() => saveHandler()} type="primary" color="success">
                  Сохранить
                </Button>
              )}
            </MainNavButtons>
          </ButtonTableBox>
        </LegendBox>
      ) : null}
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
