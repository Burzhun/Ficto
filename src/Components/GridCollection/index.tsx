import React, { useState, useCallback, useContext, useEffect, useMemo, useRef, FC } from 'react';
import { GridCollection } from './GridCollection';
import { Filters } from '@sas/data-grid';
import { SetCanSave, setTablesDataChanged, tableContext } from '../../store/Table';
import {
  ColumnsTrees,
  TableOptionsType,
  TableUpdateDataType,
  UpdateHeader,
  Row,
  HeadersType,
  HiddenColumn,
  ColumnGraph,
  ColumnsTree,
  Cell,
  TableFilter,
  TablesData,
} from '../../types';
import { TableHead } from './TableHead';
import {
  setOrganization,
  setTablesData,
  setReload,
  setOptions,
  setHiddenColumns,
  setHiddenColumnKeys,
} from '../../store/Table';
import { userContext } from '../../store/User';
import styled from 'styled-components';
import { TableContentBox } from './ServiceStyle';
import { JsonSchemeForm } from '../JsonForm/JsonSchemeForm';
import { Loader } from '../ui/Loader';
import { HideColumn, ShowColumn } from './helpers/prepareOptions';
import { ProjectPageTableProps } from './types';

const random_h = 16;
const random_s = 1000;
const ObjectId = (m = Math, d = Date, h = random_h, s = (s: number) => m.floor(s).toString(h)) =>
  s(d.now() / random_s) + ' '.repeat(h).replace(/./g, () => s(m.random() * h));

const compareCellList = (c1: Cell[], c2: Cell[]) => {
  return JSON.stringify(c1) === JSON.stringify(c2);
};

const DataGridUi = styled.div`
  flex-grow: 1;
  height: ${window.innerHeight - 206}px;
  overflow-y: auto;
  overflow-x: hidden;
  & ::-webkit-scrollbar {
    width: 10px;
    height: 8px;
  }
  & ::-webkit-scrollbar-track {
    background-color: white;
  }

  & ::-webkit-scrollbar-thumb {
    background: darkgrey;
    -webkit-border-radius: 5px;
  }
`;

const compare = (condition: string, value: string | string[], checkValue: string) => {
  if (value === undefined) value = '';

  const isArray = Array.isArray(value);

  switch (condition) {
    case 'equal':
      return isArray ? value.includes(checkValue) : value === checkValue;
    case 'not_equal':
      return isArray ? !value.includes(checkValue) : value !== checkValue;
    case 'empty':
      return isArray ? value.length === 0 : value === '';
    case 'not_empty':
      return isArray ? value.length > 0 : value !== '';
    case 'includes':
      return isArray
        ? !(value as string[]).find((el) => !checkValue.includes(el)) && value.length > 0
        : Array.isArray(checkValue) && checkValue.includes(value);
    case 'not_includes':
      return isArray
        ? !(value as string[]).find((el) => checkValue.includes(el)) || value.length === 0
        : Array.isArray(checkValue) && !checkValue.includes(value);
  }

  return false;
};

const TableComponent: FC<ProjectPageTableProps> = ({ projectPageTable }) => {
  const tc = useContext(tableContext);
  const uc = useContext(userContext);
  const [columnTree, setColumnsTree] = useState<ColumnsTrees>({});
  const [updatedHeader, setUpdatedHeader] = useState<UpdateHeader>({});
  const [graphs, setGraph] = useState<ColumnGraph[] | undefined>(undefined);
  const [projectId, setProjectId] = useState<string>('');
  const [tableId, setTableId] = useState<number>(0);
  const [cellList, setCellList] = useState<Cell[] | null>(null);
  const reduxState = tc.state;
  const tableData = reduxState?.tablesData || [];
  const dispatch = tc.dispatch;
  const cellListGlobal = useRef<Cell[]>([]);

  const currentTable = reduxState?.selectedTable ? reduxState.selectedTable : 0;

  const tableOptions: TableOptionsType = useMemo(() => {
    return (
      reduxState.options || {
        filters: {},
        showFilter: {},
        nestedHeaders: [],
        cellList: [],
        plugin: 'form',
        type: 'dinamic',
      }
    );
  }, [reduxState.options]);

  useEffect(() => {
    if (tableOptions.cellList?.length) setCellList(tableOptions.cellList);
  }, [tableOptions.cellList]);

  const updateData = useCallback(
    (rows: Row[], data: TableUpdateDataType) => {
      dispatch(
        setTablesData({
          tablesData: rows,
          currentChangeRow: {
            key: data.column.key,
            rowIdxList: data.indexes,
          },
        }),
      );
      !reduxState.tablesDataChanged && dispatch(setTablesDataChanged({ tablesDataChanged: true }));
    },
    [dispatch, reduxState.tablesDataChanged],
  );

  const hiddenColumns = useMemo(() => {
    return reduxState?.hiddenColumns ? reduxState.hiddenColumns : {};
  }, [reduxState.hiddenColumns]);

  const hiddenColumnKeys = useMemo(() => {
    return reduxState?.hiddenColumnKeys ? reduxState.hiddenColumnKeys : [];
  }, [reduxState.hiddenColumnKeys]);

  const setCellListVoid = useCallback(
    (tableUpdated = false) => {
      if (!tableOptions || tableOptions.currentTableId !== currentTable) return;

      let listUpdated = tableUpdated;
      const newCellList = tableOptions.cellList ? [...tableOptions.cellList] : [];
      const last_row = tableOptions.nestedHeaders.length - 1;
      const hidden = hiddenColumns[currentTable] ? hiddenColumns[currentTable].filter((c) => c.level === last_row) : [];
      const options =
        hidden.length && tableOptions.options
          ? tableOptions.options.filter((op) => !hidden.find((h) => h.label === op.header))
          : tableOptions.options;
      tableOptions.observability?.forEach((observabilityNode) => {
        const colIdxArray: number[] = [];
        options?.forEach((node, idx) => {
          const key = node.key;

          if ((observabilityNode.target as string[]).includes(key)) {
            colIdxArray.push(idx);
          }
        });
        tc.state.tablesData?.forEach((dataNode, row_id: number) => {
          if (observabilityNode.actionArray) {
            const matchArray: boolean[] = [];
            observabilityNode.actionArray.forEach((actionNode) => {
              if (actionNode.slave) {
                const match = compare(actionNode.condition, dataNode[actionNode.slave], actionNode.value);
                matchArray.push(match);
              }
            });

            const match = matchArray.includes(true);
            colIdxArray.forEach((colIdx) => {
              const i = newCellList.findIndex((cellNode) => {
                return cellNode.col === colIdx && cellNode.row_id === dataNode['_id'];
              });

              if (i < 0) {
                if (match) {
                  listUpdated = true;
                  newCellList.push({
                    row: row_id,
                    col: colIdx,
                    row_id: dataNode['_id'],
                    readOnly: match,
                  });
                }
              } else {
                if (newCellList[i].readOnly !== match) {
                  newCellList[i].readOnly = match;
                  listUpdated = true;
                }
              }
            });
          } else {
            if (observabilityNode.action.condition) {
              let match = compare(
                observabilityNode.action.condition,
                dataNode[observabilityNode.slave],
                observabilityNode.action.value,
              );

              if (observabilityNode.action.type) {
                if (observabilityNode.action.type === 'unblock') match = !match;

                colIdxArray.forEach((colIdx) => {
                  const i = newCellList.findIndex((cellNode) => {
                    return cellNode.col === colIdx && cellNode.row_id === dataNode['_id'];
                  });

                  if (i < 0) {
                    if (match) {
                      newCellList.push({
                        row: row_id,
                        col: colIdx,
                        row_id: dataNode['_id'],
                        readOnly: match,
                      });
                      listUpdated = true;
                    }
                  } else {
                    if (newCellList[i].readOnly !== match) {
                      newCellList[i] = { ...newCellList[i], readOnly: match };
                      listUpdated = true;
                    }
                  }
                });
              }
            }
          }
        });
      });

      if (listUpdated || !compareCellList(newCellList, cellListGlobal.current)) {
        cellListGlobal.current = newCellList;
        setCellList(newCellList);
      }
    },
    [currentTable, hiddenColumns, tableOptions, tc.state.tablesData, setCellList],
  );

  const deleteRow = (rowIdx: number) => {
    dispatch(setTablesData({ tablesData: [...tableData.slice(0, rowIdx), ...tableData.slice(rowIdx + 1)] }));
  };

  const insertRow = (rowIdx = tableData.length) => {
    dispatch(
      setTablesData({ tablesData: [...tableData.slice(0, rowIdx), { _id: ObjectId() }, ...tableData.slice(rowIdx)] }),
    );
    setTimeout(() => {
      const el = document.getElementById('datagridContainer');

      if (el) {
        const table = el.firstChild as HTMLElement;

        if (table) {
          table.scrollTop = table.scrollHeight;
        }
      }
    }, 300);
  };

  const duplicateRow = (rowIdx: number) => {
    if (rowIdx >= tableData.length - 1) {
      const new_rows = tableData.slice(0);
      new_rows.push({ ...tableData[tableData.length - 1], _id: ObjectId() });
      dispatch(setTablesData({ tablesData: new_rows }));
    } else
      dispatch(
        setTablesData({
          tablesData: [
            ...tableData.slice(0, rowIdx + 1),
            { ...tableData[rowIdx], _id: ObjectId() },
            ...tableData.slice(rowIdx + 1),
          ],
        }),
      );
  };

  const currentProjectId = reduxState?.projectId ? reduxState.projectId : '';

  useEffect(() => {
    if (!tableOptions.currentTableId) return;

    const graphs: ColumnGraph[] = [];
    const tree = columnTree[currentTable];
    const nestedHeaders = tableOptions.nestedHeaders;

    if (tree && nestedHeaders && nestedHeaders.length) {
      (nestedHeaders[0].headerRow || []).forEach((cell, i) => {
        let j = 1;
        const cg: ColumnGraph = { level: 0, i, label: cell.label, nested: [] };
        let current_cells: ColumnGraph[] = [cg];

        while (tree[j]) {
          const child_cells: ColumnGraph[] = [];
          // eslint-disable-next-line no-loop-func
          current_cells.forEach((cell2) => {
            for (let k = 0; k < tree[j].length; k++) {
              if (!nestedHeaders[j]) continue;

              if (cell2.i === tree[j][k].start) {
                if (!nestedHeaders[j].headerRow[k]) {
                } else {
                  const cg1: ColumnGraph = {
                    level: j,
                    i: k,
                    label: (nestedHeaders[j].headerRow[k].label !== undefined
                      ? nestedHeaders[j].headerRow[k].label
                      : nestedHeaders[j].headerRow[k].key || nestedHeaders[j].headerRow[k]
                    ).toString(),
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

    const t = currentTable;

    if (tableOptions.currentTableId !== t) dispatch(setOptions({ options: { ...tableOptions, currentTableId: t } }));
  }, [columnTree, tableOptions, currentTable, dispatch]);

  useEffect(() => {
    dispatch(setOrganization({ organization: uc.state.organization.toString() + Math.random().toString() }));
  }, [uc.state, dispatch]);

  useEffect(() => {
    if (currentProjectId !== projectId) {
      setProjectId(currentProjectId);
    }
  }, [currentProjectId, projectId]);

  useEffect(() => {
    if (currentTable && tableId !== currentTable) {
      cellListGlobal.current = [];
      setTableId(currentTable);
    }

    if (!hiddenColumns[currentTable])
      dispatch(setHiddenColumns({ hiddenColumns: { ...hiddenColumns, [currentTable]: [] } }));
  }, [currentTable, tableId, hiddenColumns, dispatch, setCellListVoid]);

  useEffect(() => {
    if (tableOptions.observability) {
      setCellListVoid();
    }
  }, [tableOptions.observability, hiddenColumns, setCellListVoid, tc.state.tablesData, tableOptions.cellList]);

  const onSelect = useCallback(
    (p: { mode: 'EDIT' | 'SELECT'; idx: number; rowIdx: number }) => {
      if (p.mode === 'SELECT' && !reduxState.canSave) {
        return dispatch(SetCanSave({ canSave: true }));
      }

      const colId =
        (reduxState.options?.options &&
          p.idx in reduxState.options?.options &&
          'key' in reduxState.options?.options[p.idx] &&
          reduxState.options?.options[p.idx].key) ||
        '';

      let InputType = false;

      switch (reduxState.options?.options?.find((cell) => cell.key === colId)?.component.type) {
        case 'number':
        case 'textWithRegEx':
        case 'textArea':
          InputType = true;
      }

      if (!InputType || !colId) return;

      const curTrigger = reduxState.options?.observability?.find((trigger) => {
        return (
          (trigger.target as [])?.find(
            (
              target:
                | string
                | {
                    key: string;
                    row: number;
                  },
            ) => {
              if (typeof target === 'string') {
                return colId === target;
              } else {
                return target.key && target.row && (colId === target.key || p.rowIdx === target.row);
              }
            },
          ) && trigger?.action?.type?.includes('formula')
        );
      });

      if (curTrigger && InputType && p.mode === 'EDIT' && reduxState.canSave) {
        dispatch(SetCanSave({ canSave: false }));
      }
    },
    [dispatch, reduxState],
  );

  const hideColumn = useCallback(
    (column: HiddenColumn, hiddenColumns2: HiddenColumn[], headers: HeadersType) => {
      if (setHiddenColumns && columnTree)
        HideColumn(
          column,
          tableOptions.nestedHeaders,
          headers,
          columnTree[currentTable],
          hiddenColumns2,
          (columns: HiddenColumn[]) =>
            dispatch(setHiddenColumns({ hiddenColumns: { ...hiddenColumns, [currentTable.toString()]: columns } })),
          (h: HeadersType) => setUpdatedHeader({ ...updatedHeader, [currentTable]: h }),
          (columns: number[]) =>
            dispatch(setHiddenColumnKeys({ hiddenColumnKeys: { ...hiddenColumnKeys, [currentTable]: columns } })),
        );
    },
    [columnTree, currentTable, dispatch, hiddenColumnKeys, hiddenColumns, tableOptions.nestedHeaders, updatedHeader],
  );

  const showColumn = useCallback(
    (column: HiddenColumn, hiddenColumns2: HiddenColumn[], headers: HeadersType) => {
      if (setHiddenColumns && columnTree)
        ShowColumn(
          column,
          tableOptions.nestedHeaders,
          headers,
          columnTree[currentTable],
          hiddenColumns2,
          (columns: HiddenColumn[]) =>
            dispatch(setHiddenColumns({ hiddenColumns: { ...hiddenColumns, [currentTable.toString()]: columns } })),
          (h: HeadersType) => setUpdatedHeader({ ...updatedHeader, [currentTable]: h }),
          (columns: number[]) =>
            dispatch(setHiddenColumnKeys({ hiddenColumnKeys: { ...hiddenColumnKeys, [currentTable]: columns } })),
        );
    },
    [columnTree, currentTable, dispatch, hiddenColumnKeys, hiddenColumns, tableOptions.nestedHeaders, updatedHeader],
  );

  const showAllColumns = useCallback(() => {
    setHiddenColumnKeys &&
      dispatch(setHiddenColumnKeys({ hiddenColumnKeys: { ...hiddenColumnKeys, [currentTable]: [] } }));
    if (setHiddenColumns) dispatch(setHiddenColumns({ hiddenColumns: { ...hiddenColumns, [currentTable]: [] } }));

    const h = JSON.parse(JSON.stringify(tableOptions.nestedHeaders.slice(0)));
    dispatch(setOptions({ options: { ...tableOptions, nestedHeaders: h } }));

    if (setUpdatedHeader) setUpdatedHeader({ ...updatedHeader, [currentTable]: h });
  }, [setUpdatedHeader, currentTable, dispatch, tableOptions, updatedHeader, hiddenColumnKeys, hiddenColumns]);

  const updateColumn = useCallback(
    (c: HiddenColumn | null, type: number, hiddenColumns2: HiddenColumn[], h: HeadersType) => {
      if (c === null) {
        showAllColumns();

        return;
      }

      h = JSON.parse(JSON.stringify(h || tableOptions.nestedHeaders));
      if (type > 0) showColumn(c, hiddenColumns2, h);
      else hideColumn(c, hiddenColumns2, h);
    },
    [showColumn, hideColumn, tableOptions.nestedHeaders, showAllColumns],
  );

  if (reduxState.loading === true) {
    return (
      <TableContentBox className={projectPageTable ? 'projectPageTable' : ''}>
        <Loader />
      </TableContentBox>
    );
  }

  if (tableOptions.plugin === 'form') {
    if (reduxState.scheme) {
      return (
        <TableContentBox className={projectPageTable ? 'projectPageTable' : ''}>
          <JsonSchemeForm
            formId={currentTable}
            currentProjectId={currentProjectId}
            formData={reduxState.formData || []}
            schemaConfig={reduxState.scheme}
          />
        </TableContentBox>
      );
    } else {
      return null;
    }
  }

  return (
    <TableContentBox className={projectPageTable ? 'projectPageTable' : ''}>
      <TableHead
        projectPageTable={!!projectPageTable}
        insertRow={insertRow}
        loading={false}
        setPreloadData={(data: TablesData[]) => {
          dispatch(setTablesData({ tablesData: data }));
        }}
        signable={reduxState.projectData?.signable}
        useFilters={tableOptions.useFilters}
        showFilter={tableOptions.showFilter[currentTable]}
        reloadProject={() => {
          dispatch(setReload({ reload: true }));
        }}
        setShowFilter={(f: boolean) => {
          dispatch(
            setOptions({
              options: {
                ...tableOptions,
                showFilter: {
                  ...tableOptions.showFilter,
                  [currentTable]: f,
                },
                filters: { ...tableOptions.filters, [currentTable]: {} },
              },
            }),
          );
        }}
        filters={tableOptions.filters[currentTable]}
        setFilters={(f: TableFilter) =>
          dispatch(
            setOptions({
              options: {
                ...tableOptions,
                filters: { ...tableOptions.filters, [currentTable]: f },
              },
            }),
          )
        }
        setColumn={(column: HiddenColumn | null, checked: number, columns: HiddenColumn[]) => {
          updateColumn(column, checked, columns, updatedHeader[currentTable] || tableOptions.nestedHeaders);
        }}
        headers={tableOptions.nestedHeaders}
        showHideButton={tableOptions.showHideColumnButton}
        hiddenColumns={hiddenColumns[currentTable]}
        columnTree={columnTree[currentTable]}
        graphs={graphs}
      />
      <DataGridUi>
        <GridCollection
          onSelect={onSelect}
          withHeader={tableOptions.nestedHeaders || []}
          updatedHeader={updatedHeader[currentTable] || tableOptions.nestedHeaders || []}
          rows={reduxState.tablesData || []}
          filters={tableOptions.filters[currentTable]}
          setFilters={(f: Filters) =>
            dispatch(
              setOptions({
                options: {
                  ...tableOptions,
                  filters: { ...tableOptions.filters, [currentTable]: f },
                },
              }),
            )
          }
          showFilter={tableOptions.showFilter[currentTable]}
          columns={tableOptions.options || []}
          onRowsChange={updateData}
          insertRow={insertRow}
          duplicateRow={duplicateRow}
          hideColumn={hideColumn}
          showAllColumns={showAllColumns}
          deleteRow={deleteRow}
          withContextMenu={tableOptions.type === 'dinamic'}
          cellList={cellList || []}
          hiddenColumnKeys={hiddenColumnKeys[currentTable]}
          hiddenColumns={hiddenColumns[currentTable] || []}
          showHideButton={tableOptions.showHideColumnButton}
          setHiddenColumns={(c: HiddenColumn[]) => {
            dispatch(setHiddenColumns({ hiddenColumns: { ...hiddenColumns, [currentTable.toString()]: c } }));
          }}
          setHiddenColumnKeys={(c: number[]) => {
            dispatch(setHiddenColumnKeys({ hiddenColumnKeys: { ...hiddenColumnKeys, [currentTable]: c } }));
          }}
          columnTree={columnTree[currentTable]}
          setUpdatedHeader={(header: HeadersType) => {
            setUpdatedHeader({
              ...updatedHeader,
              [currentTable]: header,
            });
          }}
          tableId={tableOptions.currentTableId || 0}
          setTree={(t: ColumnsTree, id: number) => {
            if (currentTable === id) setColumnsTree({ ...columnTree, [currentTable]: t });
          }}
          projectPageTable={projectPageTable}
        />
      </DataGridUi>
    </TableContentBox>
  );
};

export default TableComponent;
