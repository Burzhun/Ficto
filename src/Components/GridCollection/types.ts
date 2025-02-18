import { ReactElement } from 'react';
import { EditorProps, FormatterProps, FilterRendererProps, SummaryFormatterProps } from '@sas/data-grid';
import { CustomCells, IOptionsData, NewTrigger } from '@ficto/fictable';
import { IHeaderData, IFooter, ITableCellOption } from '@ficto/fictable/dist/common/types';

export interface Row {
  [key: string]: string;
}

export interface GroupRow<TRow> {
  childRows: readonly TRow[];
  id: string;
  parentId: unknown;
  groupKey: unknown;
  isExpanded: boolean;
  level: number;
  posInSet: number;
  setSize: number;
  startRowIndex: number;
}

type column = {
  key: string;
  error: any; // eslint-disable-line
};
type RowType = {
  numberResult: (columnKey: string, summaryType: string) => string;
  result: (columnKey: string, summaryType: string) => string;
};
type RowKeyType = any; // eslint-disable-line
type FilterRendererType = FilterRendererProps<Row, string | undefined, unknown>;

type SummaryFormatterType = SummaryFormatterProps<RowKeyType, RowType>;

export type InputOptionType = {
  key: string;
  name: string;
  width?: number;
  frozen?: boolean;
  header?: string;
  headerRenderer?(): ReactElement;
  cellClass?: (r: column, i: number) => string;
  editor?(p: EditorProps<RowKeyType>): ReactElement;
  formatter?(p: FormatterProps<RowKeyType>): ReactElement;
  summaryFormatter?: (p: SummaryFormatterType) => JSX.Element;
  filterRenderer?: (p: FilterRendererType) => JSX.Element;
  component: {
    type: string;
    placeholder?: string;
    onlyPositive?: boolean;
    length?: number;
    rounding?: number;
    format?: string;
    formats?: string[];
    formula?: string;
    datePickerView?: unknown[];
    maxSize?: number;
    maxDate?: string;
    minDate?: string;
    source?: {
      url: string;
      query?: string;
      filterKey?: string;
      slave?: string[];
      limit?: number;
    };
    options?: string[];
    action?: {
      type: string;
      value?: string;
      target?: string[];
      //TODO fix any добавить джинерик
      dependent?: any; // eslint-disable-line
    };
    reg?: string;
    useSeparator?: boolean;
    summary?:
      | 'SUM'
      | 'MIN'
      | 'MAX'
      | 'AVG'
      | 'empty'
      | 'filled'
      | 'unique'
      | 'emptyPercent'
      | 'filledPercent'
      | 'uniquePercent';
    label?: string;
  };
};

declare global {
  interface Window {
    table_filter_options: InputOptionType[];
    cadesplugin: any;
    cpcsp_chrome_nmcades: any;
    tableId?: number;
    isSaving?: boolean;
    tableSwitching?: boolean;
  }
}

export type SocketTableUpdatedData = {
  newData: IData;
  newCustomCells?: CustomCells;
};

export type HiddenColumn = {
  level: number;
  i: number;
  label: string;
};
export type PositionCell = { start: number; end: number };
export type ColumnsTree = {
  [i: number]: Array<PositionCell>;
};
export type ColumnGraph = {
  i: number;
  level: number;
  label: string;
  nested?: ColumnGraph[];
};

export type HeaderRowType = {
  colspan?: number;
  label: string;
  frozen?: boolean;
  key?: string;
  alignX?: 'left' | 'center' | 'right';
  alignY?: 'top' | 'center' | 'bottom';
};
type HeaderRow = {
  headerRow: HeaderRowType[];
  height?: number;
};
export type HeadersType = HeaderRow[];

export type OptionType = {
  value: string;
  label: string;
};

export type DataRow = {
  [key: string]: ICell;
};

export type ReloadTableData = {
  data: IData;
  header: IHeaderData;
  options: IOptionsData;
  summaryValues: IFooter;
  message?: string;
  triggers?: NewTrigger[];
  rowList: string[];
};

export interface IBodyData {
  [key: string]: {
    [key: string]: ICell;
  } & { rowIndex?: number };
}
export type TCellSelected = {
  value: string;
  label: string;
}[];
export interface IChanges {
  [key: string]: {
    [key: string]: {
      value: string;
      inValidMessage?: string;
      warningMessage?: string;
      rowId: string;
      id?: string;
      selected?: TCellSelected;
      editable?: boolean;
    };
  };
}
export interface IBlocks {
  [key: string]: string[];
}
export interface ICellEditFnInput {
  [key: string]: {
    [key: string]: {
      value?: string;
      rowIndex: string;
    };
  };
}

export type SocketTableUpdateData = {
  blocks: IBlocks;
  changes: IChanges;
  data: ICellEditFnInput;
  tableId: number;
  summaryValues?: IFooter;
  newCustomCells: CustomCells;
};

export type CustomBlocks = {
  [ket: string]: {
    [key: string]: ITableCellOption;
  };
};

export type TemplateChange = {
  type: 'updateCell' | 'add' | 'addBefore' | 'delete' | 'duplicate' | 'protectRow';
  rowId?: string;
  value?: string;
  colId?: string;
  newRowId?: string;
};

export type IData = {
  [rowId: string]: {
    [colId: string]: ICell;
  } & { protected?: boolean };
};

export interface ICell {
  value?: string;
  selected?: TCellSelected;
  editable?: boolean;
  id?: string;
  inValidMessage?: string;
  warningMessage?: string;
}
export interface ITableData {
  bodyData: IData;
  rowList: string[];
  headerData: IHeaderData;
  footerData: IFooter;
  options: IOptionsData & {useFilter?: boolean};
  triggers: NewTrigger[];
}
export type ProjectPageTableProps = {
  projectPageTable?: boolean;
};

export type TableUpdatedRowsData = {
  rowChange: TemplateChange;
  changes: IChanges;
};
export interface SocketExportControls {
  exportFromSocket: (currentProjectId: string, fileType: string) => void;
}
