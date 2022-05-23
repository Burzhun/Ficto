import { ConfirmDrawer, HideColumnButton } from '@sas/ui-kit';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { endpoints, saveProject } from '../../api';
import { useHttp } from '../../hooks/http.hook';
import {
  ButtonTableBox,
  FiltersButton,
  LegendBox,
  LegendText,
  ServiceButton,
} from '../../Style/ServiceStyles/ServiceStyle';
import { RegionFilter } from './FilterComponents/RegionFilter';
import { MenuComponent } from './UI/MenuFromLast';
const RightSide = styled.div`
  display: flex;
  align-items: center;
`;

const title = 'Загрузка данных из предыдущего отчета';
const message =
  'При загрузке данных из предыдущего отчета имеющаяся информация будет полностью заменена. Продолжить загрузку данных?';

export const TableHead = (props) => {
  const { request } = useHttp();
  const token = useSelector((state) => state.auth.token);
  const { showSubjectFederation } = useSelector((state) => state.filters);
  const { currentTable, legend, type, currentProjectId, periodical, plugin } =
    useSelector((state) => state.data);
  const { refHOT } = useSelector((state) => state.handsontable);
  const [open, setOpen] = useState(false);
  const { tableData } = props;

  const preloadHandler = async () => {
    try {
      const data = await request(
        endpoints.projectDataPrevious(currentProjectId),
        'GET',
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      data.payload.tables.forEach((node) => {
        if (currentTable === node.id) {
          props.setPreloadData(node.data);
        }
      });
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
    handleClose();
  };

  const saveHandler = async () => {
    const uploadData = [
      {
        id: currentTable,
        data: tableData,
      },
    ];
    try {
      await saveProject(currentProjectId, { tables: [...uploadData] });

      toast.success('Данные сохранены', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
    } catch (e) {
      toast.error('Произошла ошибка', {
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

  const saveHandlerHOTPlugin = () => {
    refHOT.current.hotInstance.validateCells(async (valid) => {
      if (valid) {
        try {
          const HOTData = refHOT.current.hotInstance.getSourceData();
          const uploadData = [
            {
              id: currentTable,
              data: HOTData,
            },
          ];
          await request(
            endpoints.project(currentProjectId),
            'POST',
            {
              tables: [...uploadData],
            },
            {
              Authorization: `Bearer ${token}`,
            }
          );
          toast.success('Данные сохранены', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
          });
        } catch (e) {
          toast.error('Произошла ошибка', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
          });
        }
      } else {
        toast.error('Данные не валидны!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
        });
      }
    });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const showAllColumns = useCallback(() => {
    props.setColumn(null, -2, [], props.headers);
  }, [props.setColumn, props.headers]);

  useEffect(() => {
    const el = document.getElementById('legend');
    el.innerHTML = legend;
  }, [legend]);

  return (
    <>
      <LegendBox>
        <ButtonTableBox>
          {type === 'archive' ? (
            <p style={{ marginRight: '10px' }}>Архивные данные </p>
          ) : (
            !props.loading && (
              <ServiceButton
                variant="contained"
                bgcolor={'#81c784'}
                onClick={() => {
                  if (plugin === 'handsontable') {
                    saveHandlerHOTPlugin();
                  } else {
                    saveHandler();
                  }
                }}
              >
                Сохранить
              </ServiceButton>
            )
          )}
          {type === 'dinamic' ? (
            <ServiceButton
              variant="contained"
              onClick={() => {
                props.insertRow();
              }}
            >
              Добавить
            </ServiceButton>
          ) : null}
          {props.useFilters && (
            <React.Fragment>
              <FiltersButton
                bgcolor="#1b7bd9"
                width="180px"
                onClick={() => {
                  props.setShowFilter(!props.showFilter);
                }}
              >
                {props.showFilter ? 'Отключить фильтры' : 'Включить фильтры'}
              </FiltersButton>
              {Object.keys(props.filters || {}).length > 0 && props.showFilter && (
                <FiltersButton
                  bgcolor={'#c72a2a'}
                  width="170px"
                  onClick={() => {
                    props.setFilters({});
                  }}
                >
                  Очистить фильтры
                </FiltersButton>
              )}
            </React.Fragment>
          )}

          {props.showHideButton && (
            <HideColumnButton
              hiddenColumns={props.hiddenColumns}
              columnTree={props.headers.length ? props.columnTree : null}
              setColumn={(column, checked, columns) => {
                props.setColumn(column, checked, columns);
              }}
              headers={props.headers}
              showAllColumns={showAllColumns}
            />
          )}

          {showSubjectFederation && <RegionFilter />}
        </ButtonTableBox>
        <RightSide>
          {periodical && <MenuComponent openDialog={() => handleClickOpen()} />}
          <LegendText id="legend" />
        </RightSide>
      </LegendBox>
      <ConfirmDrawer
        isOpenMenu={open}
        onCloseMenu={handleClose}
        onConfirm={preloadHandler}
        title={title}
        message={message}
      />
    </>
  );
};
