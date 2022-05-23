// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import { GridCollection } from '@sas/ui-kit';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import {
  api,
  endpoints,
  getCurrentTable,
  getProject,
  getUser,
} from '../../api';
import { showFilterRegionSubject } from '../../Components/ServiceComponents/FilterComponents/redux/filters.action';
import { TableHead } from '../../Components/ServiceComponents/TableHead';
import { Loader } from '../../Components/ui/Loader';
import { useHttp } from '../../hooks/http.hook';
import { logout } from '../../Redux/actions/auth.actions';
import {
  setCurrentTable,
  setDescriptionProject,
  setInitState,
  setOrganization,
  setPeriodical,
  setPlugin,
  setResponsibles,
  setTableLegend,
  setTableType,
  setTitleProject,
} from '../../Redux/actions/data.action';
import {
  setHOTRowData,
  setHOTSettings,
  setHOTWatchers,
} from '../../Redux/actions/handontable.action';
import { setAboutProjectInfo } from '../../Redux/actions/service.action';
import {
  setSurveyData,
  setSurveyOptions,
} from '../../Redux/actions/survey.action';
import { TableContentBox } from '../../Style/ServiceStyles/ServiceStyle';
import { HandOnTablePlugin } from './HandsOnTablePlugin';
import { JsonSchemeForm } from './JsonSchemeForm';
import { SurveyPlugin } from './SurveyPlugin';
const formatDate = (date) => {
  return `${date.getDate()}.${
    +date.getMonth() + 1 <= 9
      ? '0' + (date.getMonth() + 1).toString()
      : date.getMonth() + 1
  }.${date.getFullYear()} ${date.getHours()}:${
    date.getMinutes() < 10
      ? '0' + date.getMinutes().toString()
      : date.getMinutes()
  }`;
};

const DataGridUi = styled.div`
  flex-grow: 1;
  height: ${window.innerHeight - 210}px;
  margin-top: ${(props) => (props.loading ? '120px' : '0')};
`;
let setColumn;

export const TableAggContainer = () => {
  const [dataGrid, setDataGrid] = useState([]);
  const [saveId, setSaveId] = useState('');
  const [tablePlugin, setTablePlugin] = useState('');
  const [currentChangeRow, setCurrentChangeRow] = useState(null);
  const { request } = useHttp();
  const history = useHistory();
  const token = useSelector((state) => state.auth.token);
  const { currentProjectId, plugin, currentTable, type } = useSelector(
    (state) => state.data
  );
  const dispatch = useDispatch();
  const [cellList, setCellList] = useState([]);
  const [hiddenColumns, setHiddenColumns] = useState({});
  const [columnTree, setColumnsTree] = useState({});
  const [graphs, setGraph] = useState(undefined);
  const [updatedHeader, setUpdatedHeader] = useState({});
  const [jsonFormData, setJsonFormData] = useState({});
  const [loading, setLoading] = useState(true);

  const [tableOptions, setTableOptions] = useState({
    options: [],
    filters: {},
    useFilters: false,
    showFilter: {},
    nestedHeaders: [],
    showHideColumnButton: false,
    observability: null,
    currentTableId: -1,
  });

  const updateData = useCallback(
    (data, row) => {
      setCurrentChangeRow({
        key: row.column.key,
        rowIdxList: row.indexes,
      });
      setDataGrid(data);
    },
    [setDataGrid]
  );
  useEffect(() => {
    if (currentChangeRow && tableOptions.observability) {
      tableOptions.observability.forEach((observabilityNode) => {
        switch (observabilityNode.action.type) {
          case 'formula': {
            if (observabilityNode.target.includes(currentChangeRow.key)) {
              currentChangeRow.rowIdxList.forEach(async (rowIdx) => {
                const rowData = dataGrid[rowIdx];
                let formula = observabilityNode.action.formula;
                const operations = /[+\-\*\/\(\)]/g;
                const parameters = {};
                const keys = formula
                  .split(operations)
                  .filter((key) => isNaN(key));
                keys.forEach((key) => {
                  if (!rowData[key]) {
                    parameters[key] = 0;
                  }
                  if (rowData[key] && +rowData[key]) {
                    parameters[key] = +rowData[key];
                  }
                  if (rowData[key] && !+rowData[key]) {
                    parameters[key] = +rowData[key].replace(/\,/g, '.');
                  }
                });
                try {
                  const response = await api.post(endpoints.perelman(), {
                    expression: formula,
                    parameters,
                  });
                  const resultValue = response.data.payload.result;
                  setDataGrid((prevState) =>
                    prevState.map((nodeState, idx) => {
                      if (idx === rowIdx) {
                        nodeState[observabilityNode.slave] =
                          resultValue.toString();
                      }
                      return nodeState;
                    })
                  );
                } catch (e) {}
              });
            }
            break;
          }
          case 'formulaV2': {
            if (
              observabilityNode.target.filter(
                (x) =>
                  currentChangeRow.key.includes(x.key) &&
                  currentChangeRow.rowIdxList.includes(x.row)
              ).length !== 0
            ) {
              const { params, formula } = observabilityNode.action;
              const formulaKeys = Object.keys(observabilityNode.action.params);
              const resultParams = {};
              formulaKeys.forEach((formulaKey) => {
                const currentRowIdx = params[formulaKey].row;
                const currentKey = params[formulaKey].key;
                resultParams[formulaKey] =
                  +dataGrid[currentRowIdx][currentKey] || 0;
              });
              (async () => {
                try {
                  const response = await api.post(endpoints.perelman(), {
                    expression: formula,
                    parameters: resultParams,
                  });
                  const {
                    data: {
                      payload: { result },
                    },
                  } = response;
                  setDataGrid((prevState) =>
                    prevState.map((nodeState, idx) => {
                      if (idx === observabilityNode.rowSlave) {
                        nodeState[observabilityNode.slave] = result.toString();
                      }
                      return nodeState;
                    })
                  );
                  setCurrentChangeRow({
                    key: observabilityNode.slave,
                    rowIdxList: [observabilityNode.rowSlave],
                  });
                } catch (e) {}
              })();
            }
            break;
          }
        }
      });
    }
  }, [currentChangeRow]);

  useEffect(() => {
    let graphs = [];
    const tree = columnTree[currentTable];
    const nestedHeaders = tableOptions.nestedHeaders;
    if (tree && nestedHeaders.length) {
      nestedHeaders[0].headerRow.forEach((cell, i) => {
        let j = 1;
        let cg = { level: 0, i, label: cell.label, nested: [] };
        let current_cells = [cg];
        while (tree[j]) {
          let child_cells = [];
          // columnTree[j].filter(t=>current_cells.includes(i)).
          current_cells.forEach((cell2) => {
            for (let k = 0; k < tree[j].length; k++) {
              if (!nestedHeaders[j]) continue;
              if (cell2.i === tree[j][k]) {
                if (!nestedHeaders[j].headerRow[k]) {
                } else {
                  let cg1 = {
                    level: j,
                    i: k,
                    label:
                      nestedHeaders[j].headerRow[k].label !== undefined
                        ? nestedHeaders[j].headerRow[k].label
                        : nestedHeaders[j].headerRow[k].key ||
                          nestedHeaders[j].headerRow[k],
                    nested: [],
                  };
                  cell2.nested?.push(cg1);
                  child_cells.push(cg1);
                }
              }
            }
          });
          current_cells = child_cells;
          j++;
        }
        graphs.push(cg);
      });
      setGraph(graphs);
    }
    if (tableOptions.currentTableId !== currentTable)
      setTableOptions({ ...tableOptions, currentTableId: currentTable });
    else {
      if (loading && columnTree && tableOptions) setLoading(false);
    }
  }, [columnTree, tableOptions]);

  const compare = (condition, value, checkValue) => {
    if (value === undefined) value = '';
    switch (condition) {
      case 'equal':
        return value === checkValue;
      case 'not_equal':
        return value !== checkValue;
      case 'empty':
        return value === '';
      case 'not_empty':
        return value !== '';
      case 'includes':
        return Array.isArray(checkValue) && checkValue.includes(value);
      case 'not_includes':
        return Array.isArray(checkValue) && !checkValue.includes(value);
    }
  };

  const setCellListVoid = (cellList) => {
    let newCellList = [...cellList];
    tableOptions.observability.forEach((observabilityNode) => {
      let colIdxArray = [];
      tableOptions.options.forEach((node, idx) => {
        const key = node.key;
        if (observabilityNode.target.includes(key)) {
          colIdxArray.push(idx);
        }
      });
      dataGrid.forEach((dataNode, rowIdx) => {
        if (observabilityNode.action.condition) {
          let match = compare(
            observabilityNode.action.condition,
            dataNode[observabilityNode.slave],
            observabilityNode.action.value
          );
          if (observabilityNode.action.type) {
            if (observabilityNode.action.type === 'unblock') match = !match;
            colIdxArray.forEach((colIdx) => {
              const i = newCellList.findIndex((cellNode) => {
                return cellNode.col === colIdx && cellNode.row === rowIdx;
              });
              if (i < 0) {
                if (match)
                  newCellList.push({
                    col: colIdx,
                    row: rowIdx,
                    readOnly: match,
                  });
              } else {
                if (newCellList[i].readOnly !== match)
                  newCellList[i].readOnly = match;
              }
            });
          }
        }
      });
    });
    setCellList(newCellList);
  };

  useEffect(() => {
    if (tableOptions.observability) {
      setCellListVoid([]);
    }
  }, [tableOptions.observability]);

  useEffect(() => {
    if (tableOptions.observability) {
      setCellListVoid(cellList);
    }
  }, [dataGrid]);

  const deleteRow = (rowIdx) => {
    setDataGrid([...dataGrid.slice(0, rowIdx), ...dataGrid.slice(rowIdx + 1)]);
  };

  const insertRow = (rowIdx = dataGrid.length) => {
    setDataGrid([...dataGrid.slice(0, rowIdx), {}, ...dataGrid.slice(rowIdx)]);
  };

  const duplicateRow = (rowIdx) => {
    if (rowIdx >= dataGrid.length - 1) {
      const new_rows = dataGrid.slice(0);
      new_rows.push(dataGrid[dataGrid.length - 1]);
      setDataGrid(new_rows);
    } else
      setDataGrid([
        ...dataGrid.slice(0, rowIdx + 1),
        dataGrid[rowIdx],
        ...dataGrid.slice(rowIdx + 1),
      ]);
  };

  useEffect(() => {
    localStorage.setItem('currentProjectId', currentProjectId);
  }, [currentProjectId]);

  useEffect(() => {
    return () => {
      dispatch(setInitState());
    };
  }, [dispatch]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await getUser();
        const user = response.data;

        dispatch(setOrganization(user.payload.organization.toString()));
        try {
          const isObserver = localStorage.getItem('observer') === 'true';
          if (currentProjectId === null) {
            history.push('/');
          }

          const response = isObserver
            ? await api.get(endpoints.observerProject(currentProjectId))
            : await getProject(currentProjectId);
          const { data } = response;
          let initCurrentTable = data.payload.currentTable;
          if (initCurrentTable === 0) {
            initCurrentTable = data.payload.tables[0].id;
          }
          dispatch(setResponsibles(data.payload.responsibles));
          dispatch(setCurrentTable(initCurrentTable));
          setTablePlugin(data.payload.plugin);

          dispatch(setPlugin(data.payload.plugin));
          dispatch(setTitleProject(data.payload.name));

          dispatch(setPeriodical(data.payload.periodical));
          // dispatch(setTableLegend(data.payload.tables[0].legend));
          dispatch(setDescriptionProject(data.payload.descriptions));
          dispatch(
            setAboutProjectInfo({
              status: data.payload.archive,
              number: data.payload.id,
              changeDate: formatDate(new Date(data.payload.changesDate)),
              expirationDate: formatDate(new Date(data.payload.expirationDate)),
            })
          );
          switch (data.payload.plugin) {
            case 'handsontable': {
              dispatch(setHOTRowData(data.payload.tables[0].data));
              dispatch(setHOTSettings(data.payload.tables[0].options));
              if (data.payload.tables[0].options.watchers) {
                dispatch(
                  setHOTWatchers(data.payload.tables[0].options.watchers)
                );
              }
              if (data.payload.tables[0].options.select) {
                dispatch(showFilterRegionSubject(true));
              } else {
                dispatch(showFilterRegionSubject(false));
              }
              break;
            }
            case 'form': {
              setJsonFormData(data.payload.tables[0].options);
              break;
            }
            case 'surveyjs': {
              dispatch(setSurveyData(data.payload.tables[0].data[0]));
              dispatch(setSurveyOptions(data.payload.tables[0].options));
              break;
            }
            default: {
              setTableOptions({
                ...tableOptions,
                useFilters: true,
                options: data.payload.tables[0].options.columnDefs,
                observability: data.payload.tables[0].options.observability,
              });
              break;
            }
          }
        } catch (e) {}
      } catch (e) {
        localStorage.removeItem('userToken');
        dispatch(logout());
      }
    })();
  }, [dispatch, request, token, currentProjectId, history]);

  const onMessageHandler = (message) => {
    toast.error(message);
  };

  const isDynamicType = useMemo(() => {
    return type === 'dinamic';
  }, [type]);

  const setPluginComponent = useMemo(() => {
    switch (tablePlugin) {
      case 'handsontable': {
        return <HandOnTablePlugin />;
      }
      case 'surveyjs': {
        return <SurveyPlugin saveId={saveId} />;
      }
      case 'form': {
        if (jsonFormData.scheme)
          return (
            <JsonSchemeForm
              schemaConfig={jsonFormData.scheme}
              rules={jsonFormData.rules}
            />
          );
      }
      case 'table': {
        return (
          <DataGridUi loading={loading}>
            <GridCollection
              onMessage={onMessageHandler}
              withHeader={tableOptions.nestedHeaders}
              updatedHeader={updatedHeader[currentTable]}
              rows={!loading ? dataGrid : []}
              filters={tableOptions.filters[currentTable]}
              setFilters={(f) =>
                setTableOptions({
                  ...tableOptions,
                  filters: { ...tableOptions.filters, [currentTable]: f },
                })
              }
              showFilter={tableOptions.showFilter[currentTable]}
              columns={tableOptions.options}
              onRowsChange={updateData}
              insertRow={insertRow}
              duplicateRow={duplicateRow}
              deleteRow={deleteRow}
              withContextMenu={isDynamicType}
              cellList={cellList}
              hiddenColumns={hiddenColumns[currentTable] || []}
              showHideButton={tableOptions.showHideColumnButton}
              setHiddenColumns={(c) => {
                setHiddenColumns({ ...hiddenColumns, [currentTable]: c });
              }}
              setColumn={(f) => {
                setColumn = f;
              }}
              columnTree={columnTree[currentTable]}
              setUpdatedHeader={(header) => {
                setUpdatedHeader({
                  ...updatedHeader,
                  [currentTable]: header,
                });
              }}
              tableId={tableOptions.currentTableId}
              setTree={(t, id) => {
                if (currentTable === id)
                  setColumnsTree({ ...columnTree, [currentTable]: t });
              }}
            />
          </DataGridUi>
        );
      }
      default: {
        return <Loader />;
      }
    }
  }, [
    loading,
    tablePlugin,
    dataGrid,
    cellList,
    hiddenColumns,
    tableOptions,
    updatedHeader,
    currentTable,
    columnTree,
    jsonFormData,
  ]);

  useEffect(() => {
    if (currentTable) {
      (async () => {
        try {
          setLoading(true);
          const isObserver = localStorage.getItem('observer') === 'true';
          const response = isObserver
            ? await api.get(
                endpoints.observerProjectTable(currentProjectId, currentTable)
              )
            : await getCurrentTable(currentProjectId, currentTable);
          const data = response.data.payload.tables[0];
          dispatch(setTableType(data.type));
          dispatch(setTableLegend(data.legend));
          setCellList(data.options.cellList || []);
          let newTableOptions = {
            filters: tableOptions.filters,
            showFilter: tableOptions.showFilter,
          };
          setDataGrid(data.data);
          newTableOptions.options = data.options.columnDefs;
          if (data.options.features) {
            newTableOptions.useFilters =
              data.options.features.filters && tablePlugin === 'table';
            // if (!Object.keys(tableOptions.showFilter).length)
            //   newTableOptions.showFilter = data.options.features.filters;
          }
          newTableOptions.showHideColumnButton = data.options.hideColumns;
          newTableOptions.nestedHeaders = data.options.nestedHeaders;
          newTableOptions.observability = data.options.observability;
          setTableOptions(newTableOptions);
          if (data.options.nestedHeaders.length === 1) {
            setColumnsTree({ ...columnTree, [currentTable]: {} });
          }
        } catch (e) {}
      })();
    }
  }, [currentTable, currentProjectId, tablePlugin]);

  return (
    <TableContentBox>
      {plugin === 'surveyjs' || loading ? null : (
        <TableHead
          tableData={dataGrid}
          insertRow={insertRow}
          loading={loading}
          setPreloadData={setDataGrid}
          useFilters={tableOptions.useFilters}
          showFilter={tableOptions.showFilter[currentTable]}
          setShowFilter={(f) => {
            setTableOptions({
              ...tableOptions,
              showFilter: {
                ...tableOptions.showFilter,
                [currentTable]: f,
              },
              filters: { ...tableOptions.filters, [currentTable]: {} },
            });
          }}
          filters={tableOptions.filters[currentTable]}
          setFilters={(f) =>
            setTableOptions({
              ...tableOptions,
              filters: { ...tableOptions.filters, [currentTable]: f },
            })
          }
          setColumn={(column, checked, columns) => {
            setColumn(
              column,
              checked,
              columns,
              updatedHeader[currentTable] || tableOptions.nestedHeaders
            );
          }}
          headers={tableOptions.nestedHeaders}
          showHideButton={tableOptions.showHideColumnButton}
          hiddenColumns={hiddenColumns[currentTable] || []}
          columnTree={columnTree[currentTable]}
          graphs={graphs}
        />
      )}
      {setPluginComponent}
    </TableContentBox>
  );
};
