import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { DataGridProps, FillEvent, Row as GridRow, RowRendererProps, Filters } from '@sas/data-grid';
import { HeaderGridCollection, HeadersType } from './HeaderGridCollection/HeaderGridCollection';
import { optionsForDataGrid } from './helpers/prepareOptions';
import { Table } from '../Table';
import { InputOptionType, Row, HiddenColumn, ColumnsTree, PositionCell } from '../../types';
import { ContextMenu, ContextMenuItem } from './ServiceStyle';
import { ProjectPageTableProps } from './types';

type DataGridCustomProps = {
  insertRow(rowIdx: number): void;
  duplicateRow(rowIdx: number): void;
  deleteRow(rowIdx: number): void;
  withContextMenu?: boolean;
  maxHeight?: number;
  setHeight?: boolean;
  showFilter?: boolean;
  hiddenColumnKeys?: number[];
  hiddenColumns?: HiddenColumn[];
  setHiddenColumns?(columns: HiddenColumn[]): void;
  setHiddenColumnKeys?(columns: number[]): void;
  filters?: Filters;
  setFilters?(f: Filters): void;
  setTree(f: ColumnsTree, id: number): void;
  withHeader: HeadersType;
  updatedHeader: HeadersType;
  columns: InputOptionType[];
  hideColumn?: (column: HiddenColumn, hiddenColumns2: HiddenColumn[], headers: HeadersType) => void;
  showAllColumns: () => void;
  setColumnFunction?(
    f: (c: HiddenColumn | null, type: number, hiddenColumns2: HiddenColumn[], h: HeadersType) => void,
  ): void;
  showHideButton?: boolean;
  columnTree?: ColumnsTree;
  tableId?: number;
  setUpdatedHeader?(h: HeadersType): void;
} & ProjectPageTableProps;

type CellErrorsType = { [key: string]: boolean };
const no_table_id = -1;
const initContextMenuProps = {
  mouseX: 0,
  mouseY: 0,
};
const random_h = 16;
const random_s = 1000;
const ObjectId = (m = Math, d = Date, h = random_h, s = (s: number) => m.floor(s).toString(h)) =>
  s(d.now() / random_s) + ' '.repeat(h).replace(/./g, () => s(m.random() * h));

export const GridCollection: FC<DataGridProps<Row> & DataGridCustomProps> = (props) => {
  const {
    cellList,
    columns,
    withHeader,
    onRowsChange,
    setHeight,
    maxHeight,
    insertRow,
    duplicateRow,
    onMessage,
    deleteRow,
    showFilter = false,
    withContextMenu = true,
    filters = {},
    rowHeight,
    setFilters,
    setTree,
    hiddenColumnKeys,
    hiddenColumns = [],
    setHiddenColumns,
    setHiddenColumnKeys,
    showHideButton = false,
    columnTree,
    tableId = 0,
    updatedHeader,
    showAllColumns,
    hideColumn,
    onSelectedCellChange,
    onSelect,
    projectPageTable,
  } = props;
  const [errors, setErrors] = useState<CellErrorsType>({});
  const [rows, setRows] = useState<Row[]>(
    props.rows && Array.isArray(props.rows) ? props.rows.map((r) => ({ ...r, _id: r['_id'] || ObjectId() })) : [],
  );
  const [currentRowIdx, setCurrentRowIdx] = useState(0);
  const [selectedRows, setSelectedRows] = useState(() => new Set<React.Key>());
  const [contextMenu, setContextMenu] = useState(initContextMenuProps);
  const [currentTableId, setCurrentTableId] = useState<number>(no_table_id);

  const setHiddenColumnsUpdate = useCallback(
    function (l: number) {
      if (hiddenColumns.length) {
        const newHiddenColumnKeys: number[] = hiddenColumns.filter((c) => c.level === l - 1).map((c) => c.i);
        setHiddenColumnKeys && setHiddenColumnKeys(newHiddenColumnKeys);
      } else {
        setHiddenColumnKeys && setHiddenColumnKeys([]);
      }
    },
    [hiddenColumns, setHiddenColumnKeys],
  );

  const handleCloseContextMenu = useCallback(() => {
    setContextMenu(initContextMenuProps);
  }, [setContextMenu]);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (event.target) {
        const t: HTMLElement = event.target as HTMLElement;

        if (
          t.className !== 'ant-dropdown-menu-title-content' ||
          !t.parentElement?.className.includes('table_row_context')
        ) {
          handleCloseContextMenu();
        }
      }
    },
    [handleCloseContextMenu],
  );

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);

    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [handleClickOutside]);

  const updateColumnsTree = useCallback(
    (headers: HeadersType, tableId: number) => {
      const columns_tree: ColumnsTree = {};
      const positions: number[][] = [];
      const positions2: Array<PositionCell[]> = [];
      headers.forEach((headers_list, i) => {
        let p = 0;
        positions[i] = [];
        positions2[i] = [];
        (headers_list.headerRow || []).forEach((header, j) => {
          positions[i][j] = p;
          const t = p;

          if (header.colspan) p += header.colspan;
          else p++;

          positions2[i][j] = { start: t, end: p - 1 };
        });
      });
      positions2.forEach((p, i) => {
        if (i === 0) return;

        columns_tree[i] = [];
        p.forEach((position, j) => {
          let i2 = 0;

          while (i2 < positions2[i - 1].length && positions2[i - 1][i2].start <= position.start) {
            i2++;
          }

          const end = positions2[i - 1].findIndex((p) => p.end >= position.end);
          columns_tree[i][j] = { start: i2 - 1, end };
        });
      });
      if (Object.keys(columns_tree).length) setTree(columns_tree, tableId);
    },
    [setTree],
  );

  const showSummary = useMemo(() => {
    return columns.filter((column) => column?.component?.summary).length > 0;
  }, [columns]);

  const tableSwitch = useCallback(
    function (h: HeadersType) {
      setHiddenColumnsUpdate(h.length);
      if (!columnTree) updateColumnsTree(h, tableId);
    },
    [setHiddenColumnsUpdate, updateColumnsTree, columnTree, tableId],
  );

  useEffect(() => {
    if (currentTableId !== tableId) {
      tableSwitch(withHeader);
      setCurrentTableId(tableId);
    } else {
      if (!columnTree) updateColumnsTree(updatedHeader, tableId);
    }
  }, [withHeader, tableSwitch, updatedHeader, tableId, currentTableId, updateColumnsTree, columnTree]);

  useEffect(() => {
    setRows(
      props.rows && Array.isArray(props.rows) ? props.rows.map((r) => ({ ...r, _id: r['_id'] || ObjectId() })) : [],
    );
  }, [props.rows]);

  function handleFill({ columnKey, sourceRow, targetRows }: FillEvent<Row>) {
    const newRows = rows.map((row: Row) => {
      const newRow = targetRows.find((r) => r['_id'] === row['_id']);

      if (newRow) {
        return {
          ...newRow,
          [columnKey as keyof Row]: sourceRow[columnKey as keyof Row],
        };
      } else return row;
    });

    return newRows;
  }

  const contextMenuHandler = (event: React.MouseEvent, rowIdx: number) => {
    if (withContextMenu && !window.isSaving) {
      event.preventDefault();
      setCurrentRowIdx(rowIdx);
      setContextMenu({
        mouseX: event.clientX,
        mouseY: event.clientY,
      });
    }
  };

  const options = useMemo(() => {
    const cols: InputOptionType[] = columns;

    return optionsForDataGrid(
      cols.filter((c, i) => {
        return !hiddenColumnKeys?.includes(i);
      }),
      errors,
      setErrors,
      showFilter,
    );
  }, [columns, errors, showFilter, hiddenColumnKeys]);

  const rowRenderer = (props: RowRendererProps<Row>) => {
    return (
      <div role={'form'} onContextMenu={(event) => contextMenuHandler(event, props.rowIdx)}>
        <GridRow {...props} />
      </div>
    );
  };

  const insertRowContext = (rowIdx: number) => {
    if (useFilter) {
      const i = rows.findIndex((r) => r['_id'] === filteredRows[rowIdx]['_id']);

      if (i >= 0) rowIdx = i;
    }

    insertRow(rowIdx);
    handleCloseContextMenu();
  };

  const duplicateRowContext = (rowIdx: number) => {
    if (useFilter) {
      const i = rows.findIndex((r) => r['_id'] === filteredRows[rowIdx]['_id']);

      if (i >= 0) rowIdx = i;
    }

    duplicateRow(rowIdx);
    handleCloseContextMenu();
  };

  const deleteRowContext = (rowIdx: number) => {
    if (useFilter) {
      const i = rows.findIndex((r) => r['_id'] === filteredRows[rowIdx]['_id']);

      if (i >= 0) rowIdx = i;
    }

    deleteRow(rowIdx);
    handleCloseContextMenu();
  };

  const sumHeaderRowHeight = useMemo(() => {
    let height = 0;
    const defaultHeight = 60;

    if (updatedHeader)
      updatedHeader.forEach((node: { height?: number }) => {
        height += node.height || defaultHeight;
      });

    return height;
  }, [updatedHeader]);

  const customHeaderRender = useCallback(() => {
    return (
      <HeaderGridCollection
        hideColumn={(column: HiddenColumn, hiddenColumns2: HiddenColumn[]) => {
          hideColumn && hideColumn(column, hiddenColumns2, JSON.parse(JSON.stringify(updatedHeader)));
        }}
        hiddenColumns={hiddenColumns}
        nestedHeaders={updatedHeader}
        hiddenKeys={hiddenColumnKeys}
        showAllColumns={showAllColumns}
        setHiddenColumns={setHiddenColumns}
        showHideButton={showHideButton}
      />
    );
  }, [hiddenColumns, hiddenColumnKeys, setHiddenColumns, showHideButton, updatedHeader, hideColumn, showAllColumns]);

  const useFilter = useMemo(() => {
    return Object.values(filters).some((f) => f);
  }, [filters]);

  const filteredRows = useMemo(() => {
    if (!useFilter) return rows;

    const keys = Object.keys(filters).filter((k) => k !== '_id');

    return rows.filter((r) => {
      return !keys.find((key) => filters[key] && (!r[key] || !r[key].toString().includes(filters[key])));
    });
  }, [rows, filters, useFilter]);

  const menu = !projectPageTable ? (
    <ContextMenu>
      <ContextMenuItem
        onClick={() => {
          deleteRowContext(currentRowIdx);
        }}
        style={{ color: 'black' }}
        className="table_row_context"
      >
        Удалить строку
      </ContextMenuItem>
      <ContextMenuItem
        onClick={() => {
          insertRowContext(currentRowIdx);
        }}
        style={{ color: 'black' }}
        className="table_row_context"
      >
        Добавить строку до
      </ContextMenuItem>
      <ContextMenuItem
        onClick={() => {
          insertRowContext(currentRowIdx + 1);
        }}
        style={{ color: 'black' }}
        className="table_row_context"
      >
        Добавить строку после
      </ContextMenuItem>
      <ContextMenuItem
        onClick={() => {
          duplicateRowContext(currentRowIdx);
        }}
        style={{ color: 'black' }}
        className="table_row_context"
      >
        Дублировать строку
      </ContextMenuItem>
    </ContextMenu>
  ) : null;

  return (
    <>
      <Table
        onSelectedCellChange={onSelectedCellChange}
        onSelect={onSelect}
        columns={options}
        useFilter={useFilter}
        rows={filteredRows}
        allRows={rows}
        rowRenderer={rowRenderer}
        onFill={handleFill}
        selectedRows={selectedRows}
        onSelectedRowsChange={setSelectedRows}
        onRowsChange={onRowsChange}
        headerRowHeight={sumHeaderRowHeight}
        autoWidth={true}
        maxHeight={maxHeight}
        setHeight={setHeight || false}
        onMessage={onMessage}
        autoHeight={true}
        cellList={cellList}
        rowHeight={rowHeight}
        filters={filters}
        enableFilterRow={showFilter}
        onFiltersChange={setFilters}
        headerRenderer={customHeaderRender}
        showSummary={showSummary}
      />
      {createPortal(
        <div
          style={{
            visibility: contextMenu.mouseY !== 0 ? 'visible' : 'hidden',
            position: 'absolute',
            top: contextMenu.mouseY + 'px',
            left: contextMenu.mouseX + 'px',
            width: '200px',
            opacity: '0.9',
            color: 'white',
          }}
        >
          {menu}
        </div>,
        document.body,
      )}
    </>
  );
};
