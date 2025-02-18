import React from 'react';
import {
  AsyncSelectEditor,
  MultiSelectEditor,
  SelectEditor,
  LoadSelectEditor,
  FilterSelectEditor,
  MultiAsyncSelectEditor,
} from '../Editors/SelectEditor';
import { HeaderFormatter } from '../HeaderFormatter';
import { ReadOnlyRenderer } from '../Renderers/ReadOnlyRenderer';
import { TextRegEditor, TextAreaEditor } from '../Editors/TextRegEditor';
import { EditorProps, FormatterProps, FilterRendererProps } from '@sas/data-grid';
import { FileEditor } from '../Editors/FileEditor';
import { FileRenderer } from '../Renderers/FileRenderer';

import { DatePicker } from '../Editors/DataPicker';
import { DatePickerRenderer } from '../Renderers/DatePickerRenderer';
import { ArrayDataRenderer } from '../Renderers/ArrayDataRenderer';
import { OnlyNumberEditor, InnEditor } from '../Editors/OnlyNumberEditor';
import { FileEditorData } from '../Editors/FileEditor/types';
import { InputOptionType, ColumnsTree, HiddenColumn } from '../../../types';
import { HeadersType } from '../HeaderGridCollection/HeaderGridCollection';

type Row = { [key: string]: string };
type FilterRendererType = FilterRendererProps<Row, string | undefined, unknown>;

type OptionType = {
  value: string;
  label: string;
};

const optionsMapper = (source: string[]): OptionType[] => {
  return source.map((node) => ({ value: node, label: node }));
};

//TODO fix any создать эталонную строку для стори
type RowKeyType = any; // eslint-disable-line

type column = {
  key: string;
  error: any; // eslint-disable-line
};

type CellErrorsType = { [key: string]: boolean };

const HeaderDiv = () => <div />;

const defaultRowHeight = 35;

const initOption = {
  key: '',
  name: '',
  headerRenderer: HeaderDiv,
};

const defaultOptions = {
  width: 200,
};

const setError = (
  rowIdx: number,
  column: string,
  value: boolean,
  errors: CellErrorsType,
  setErrorsFunction: React.Dispatch<React.SetStateAction<CellErrorsType>>,
) => {
  const key = column + '_' + rowIdx.toString();

  if (errors[key] && !value) {
    delete errors[key];
    setErrorsFunction(errors);
  } else {
    if (!errors[key] && value) {
      errors[key] = true;
      setErrorsFunction(errors);
    }
  }
};

const filterRenderer = (p: FilterRendererType) => {
  if (p && p.column?.component?.type === 'select') {
    const options = optionsMapper(p.column?.component.options ?? []);

    return (
      <FilterSelectEditor
        menuPortalTarget={document?.body}
        rowHeight={30}
        placeholder={''}
        value={p.value || ''}
        onChange={(value: string) => {
          p.onChange(value);
        }}
        options={options}
      />
    );
  }

  return (
    <div className={''}>
      <input
        className={''}
        style={{ height: '25px', marginTop: '7px', width: '96%' }}
        value={p.value || ''}
        onChange={(e) => p.onChange(e.target.value)}
      />
    </div>
  );
};

const unfiltered_columns: string[] = ['attachment', 'serialNumber'];
export const optionsForDataGrid = (
  inputOptions: InputOptionType[],
  errors: CellErrorsType,
  setErrors: React.Dispatch<React.SetStateAction<CellErrorsType>>,
  showFilter: boolean,
): InputOptionType[] => {
  const onRowUpdate = (
    props: EditorProps<RowKeyType> | FormatterProps<RowKeyType>,
    value: string | string[] | FileEditorData,
    commit = false,
    error: boolean | undefined = undefined,
  ) => {
    if (commit) props.onRowChange({ ...props.row, [props.column.key]: value }, true);
    else props.onRowChange({ ...props.row, [props.column.key]: value });

    if (error !== undefined) setError(props.rowIdx, props.column.key, error, errors, setErrors);
  };

  return inputOptions.map((option: InputOptionType) => {
    const resultOption: InputOptionType = {
      ...defaultOptions,
      ...initOption,
      component: option.component,
    };

    resultOption.key = option.key;

    resultOption.component = option.component;

    if (showFilter && !unfiltered_columns.includes(option.component.type) && !resultOption.filterRenderer)
      resultOption.filterRenderer = filterRenderer;

    resultOption.name = option.name;
    if (option.width) {
      resultOption.width = option.width;
    }

    resultOption.summaryFormatter = (props) => {
      return (
        <div
          style={{
            height: '25px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {props.row.result(props.column.key, props.column.component?.summary, props.column.component?.label)}
        </div>
      );
    };

    resultOption.cellClass = (row: column, i: number) => {
      const key = option.key + '_' + i.toString();
      const err = errors[key];

      if (err) return 'rdg-cell-error';

      return '';
    };

    if (option.frozen) {
      resultOption.frozen = option.frozen;
    }

    resultOption.headerRenderer = function setHeader() {
      return <HeaderFormatter title={option.header} />;
    };

    switch (option.component.type) {
      case 'asyncSelect': {
        resultOption.editor = function setEditor(p) {
          const height =
            typeof p.rowHeight === 'number'
              ? p.rowHeight
              : p.rowHeight
              ? p.rowHeight([p?.row], p.row.rowIdx)
              : defaultRowHeight;
          let urlAdditional = '';
          const baseUrl = `/api/dictionary/${option.component.source?.url}`;

          if (option.component.source?.query) {
            urlAdditional += option.component.source?.query;
          }

          if (option.component.source?.slave) {
            option.component.source?.slave.forEach((key) => {
              if (p.row[key]) {
                urlAdditional += `&${key}=${encodeURIComponent(p.row[key])}`;
              }
            });
          }

          if (option.component.source?.limit) {
            urlAdditional += `&limit=${encodeURIComponent(option.component.source?.limit)}`;
          }

          // if (option.component.source?.url.includes('?')) {
          //   baseUrl = `/api/dictionary/${option.component.source?.url}&search=`;
          // }

          const isMilti = option.component.multi;
          const EditorComponent = isMilti ? MultiAsyncSelectEditor : AsyncSelectEditor;
          const menuPlacement = window.innerHeight - p.top < 300 ? 'top' : 'bottom';

          return (
            <EditorComponent
              placeholder={option.component.placeholder}
              inputValue={p.row[p.column.key]}
              rowHeight={height}
              readonly={false}
              isMulti={isMilti}
              menuPlacement={menuPlacement}
              urlAdditional={urlAdditional}
              menuPortalTargetUI={p.editorPortalTarget}
              // todo выпилить api/dictionary так как не факт что всегда будут присутствовать
              loadOptions={baseUrl}
              onClearCell={() => {
                if (option.component.action) {
                  switch (option.component.action.type) {
                    case 'asyncFetch': {
                      let resultObj = {};

                      for (const key in option.component.action.dependent) {
                        resultObj = {
                          ...resultObj,
                          [option.component.action.dependent[key]]: '',
                        };
                      }

                      return p.onRowChange({
                        ...p.row,
                        [p.column.key]: '',
                        ...resultObj,
                      });
                    }
                  }
                }

                onRowUpdate(p, '');
              }}
              onChangeValue={async (o) => {
                if (o) {
                  const value = isMilti ? (o as string[]) : (o as OptionType).label;

                  if (option.component.action) {
                    switch (option.component.action.type) {
                      case 'asyncFetch': {
                        const optionKey = option.component.action.value === 'data' ? 'value' : 'label';
                        try {
                          let resultObj = {};
                          const key = isMilti ? (o as string[])[0] : (o as OptionType)[optionKey];
                          const response = await fetch(`/api/dictionary/${option.component.source?.url}/${key}`);
                          const { payload } = await response.json();

                          for (const key in option.component.action.dependent) {
                            resultObj = {
                              ...resultObj,
                              [option.component.action.dependent[key]]: payload[key],
                            };
                          }

                          return p.onRowChange({ ...p.row, [p.column.key]: isMilti ? o : value, ...resultObj }, true);
                        } catch (e) {}
                      }
                    }
                  }

                  onRowUpdate(p, value, false);
                }
              }}
            />
          );
        };

        break;
      }

      case 'keyList': {
        resultOption.editor = function setEditor(p) {
          const height =
            typeof p.rowHeight === 'number'
              ? p.rowHeight
              : p.rowHeight
              ? p.rowHeight([p?.row], p.row.rowIdx)
              : defaultRowHeight;

          return (
            <LoadSelectEditor
              value={p.row[p.column.key]}
              loadOptions={`${option.component.source?.url}`}
              rowHeight={height}
              menuPortalTarget={p.editorPortalTarget}
              placeholder={option.component.placeholder || ''}
              onChange={(value) => onRowUpdate(p, value, true)}
            />
          );
        };

        break;
      }

      case 'attachment': {
        resultOption.editor = function setEditor(props) {
          return (
            <FileEditor
              onMessage={props.onMessage}
              maxSize={option.component.maxSize}
              value={props.row[props.column.key]}
              formats={option.component.formats}
              onChange={(value) => {
                onRowUpdate(props, value);
              }}
            />
          );
        };

        resultOption.formatter = function setFormatter(props) {
          return (
            <FileRenderer
              value={props.row[props.column.key]}
              onChange={(value) => {
                onRowUpdate(props, value);
              }}
            />
          );
        };

        break;
      }

      case 'datePicker': {
        resultOption.formatter = function setFormatter(props) {
          return <DatePickerRenderer value={props.row[props.column.key]} format={option.component.format} />;
        };

        resultOption.editor = function setEditor(props) {
          return (
            <DatePicker
              format={option.component.format}
              views={option.component.datePickerView}
              maxDate={option.component.maxDate}
              minDate={option.component.minDate}
              value={props.row[props.column.key]}
              onChange={(value) => onRowUpdate(props, value)}
            />
          );
        };

        break;
      }

      case 'multiSelect': {
        resultOption.formatter = function setFormatter(props) {
          return <ArrayDataRenderer value={props.row[props.column.key]} />;
        };

        resultOption.editor = function setEditor(props) {
          const height =
            typeof props.rowHeight === 'number'
              ? props.rowHeight
              : props.rowHeight
              ? props.rowHeight([props?.row], props.row.rowIdx)
              : defaultRowHeight;
          const menuPlacement = window.innerHeight - props.top < 300 ? 'top' : 'bottom';

          return (
            <MultiSelectEditor
              value={props.row[props.column.key]}
              menuPlacement={menuPlacement}
              onChange={(value) => onRowUpdate(props, value)}
              options={option.component.options || []}
              menuPortalTarget={props.editorPortalTarget}
              rowHeight={height}
            />
          );
        };

        break;
      }

      case 'readOnlyMultiSelect': {
        resultOption.formatter = function setFormatter(props) {
          return <ArrayDataRenderer value={props.row[props.column.key]} readonly />;
        };

        break;
      }

      case 'readOnlyDatePicker': {
        resultOption.formatter = function setFormatter(props) {
          return <DatePickerRenderer value={props.row[props.column.key]} format={option.component.format} readonly />;
        };

        break;
      }

      case 'readOnly': {
        resultOption.summaryFormatter = (props) => {
          return (
            <div
              style={{
                height: '25px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {props.row.numberResult(props.column.key, props.column.component?.summary, props.column.component?.label)}
            </div>
          );
        };

        resultOption.formatter = function setFormatter(props) {
          let value = props.row[props.column.key] || 0;

          if (option.component.action) {
            switch (option.component.action.type) {
              case 'sum': {
                value = 0;
                option.component.action.target?.forEach((key) => {
                  const nodeValue = +props.row[key];

                  if (!Number.isNaN(nodeValue)) {
                    value += nodeValue;
                  }
                });

                if (Number.isNaN(value)) {
                  value = '';
                }

                break;
              }
            }
          }

          if (props.column.component?.useSeparator) {
            const formatter = new Intl.NumberFormat('ru', {});
            const newValue = value.toString().replace(',', '.');

            if (value && !isNaN(newValue)) value = formatter.format(newValue);
          }

          return <ReadOnlyRenderer value={value} />;
        };

        break;
      }

      case 'formula': {
        resultOption.formatter = function setFormatter(props) {
          let value = 0;

          if (option.component.formula) {
            const formula = option.component.formula.split('|');
            value = +props.row[formula[0]] || 0;
            formula.forEach((node, idx) => {
              if (node === '*') {
                if (formula[idx + 1]) {
                  value = value * (+props.row[formula[idx + 1]] || 0);
                } else {
                }
              }

              if (node === '/') {
                if (formula[idx + 1]) {
                  value = value / (+props.row[formula[idx + 1]] || 0);
                } else {
                }
              }

              if (node === '-') {
                if (formula[idx + 1]) {
                  value = value - (+props.row[formula[idx + 1]] || 0);
                } else {
                }
              }

              if (node === '+') {
                if (formula[idx + 1]) {
                  value = value + (+props.row[formula[idx + 1]] || 0);
                } else {
                }
              }
            });
          }

          const finalValue = value === 0 ? '0' : value.toString();
          const stateValue = props.row[props.column.key] || '0';

          if (stateValue !== finalValue.toString()) {
            onRowUpdate(props, finalValue);
          }

          return <ReadOnlyRenderer value={props.row[props.column.key] || '0'} />;
        };

        break;
      }

      case 'readOnlyFile': {
        resultOption.formatter = function setFormatter(props) {
          return <FileRenderer value={props.row[props.column.key]} readOnly />;
        };

        break;
      }

      case 'select': {
        if (option.component.options) {
          const options = optionsMapper(option.component.options);
          resultOption.editor = function setEditor(p) {
            const height =
              typeof p.rowHeight === 'number'
                ? p.rowHeight
                : p.rowHeight
                ? p.rowHeight([p?.row], p.row.rowIdx)
                : defaultRowHeight;
            const menuPlacement = window.innerHeight - p.top < 300 ? 'top' : 'bottom';

            return (
              <SelectEditor
                value={p.row[p.column.key]}
                options={options}
                rowHeight={height}
                menuPlacement={menuPlacement}
                menuPortalTarget={p.editorPortalTarget}
                placeholder={option.component.placeholder || ''}
                onChange={(value) => onRowUpdate(p, value)}
              />
            );
          };
        }

        break;
      }

      case 'number': {
        resultOption.formatter = function setFormatter(props) {
          if (props.column.component?.useSeparator) {
            const value = props.row[props.column.key];
            const formatter = new Intl.NumberFormat('ru', {});

            return <>{value ? formatter.format(value.toString().replace(',', '.')) : value}</>;
          }

          return <>{props.row[props.column.key]}</>;
        };

        resultOption.summaryFormatter = (props) => {
          return (
            <div
              style={{
                height: '25px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {props.row.numberResult(props.column.key, props.column.component?.summary, props.column.component?.label)}
            </div>
          );
        };

        resultOption.editor = function setEditor(props) {
          return (
            <OnlyNumberEditor
              value={props.row[props.column.key]}
              length={option.component.length}
              onlyPositive={option.component.onlyPositive}
              rounding={option.component.rounding}
              onChange={(value) => onRowUpdate(props, value)}
              onBlur={(bool) => props.onClose(bool)}
            />
          );
        };

        break;
      }

      case 'inn': {
        resultOption.editor = function setEditor(props) {
          return (
            <InnEditor
              value={props.row[props.column.key]}
              length={option.component.length}
              onlyPositive={option.component.onlyPositive}
              onChange={(value, err) => {
                onRowUpdate(props, value, false, err);
              }}
              onBlur={(bool) => props.onClose(bool)}
            />
          );
        };

        break;
      }

      case 'textWithRegEx': {
        if (option.component.reg) {
          let regExp: RegExp | undefined = undefined;
          try {
            regExp = new RegExp(option.component.reg);
          } catch (e) {}

          resultOption.editor = function setEditor(p) {
            return (
              <TextRegEditor
                value={p.row[p.column.key]}
                onChange={(value) => onRowUpdate(p, value)}
                reg={regExp}
                onBlur={(bool) => p.onClose(bool)}
              />
            );
          };
        } else {
          resultOption.editor = function setEditor(p) {
            return (
              <TextRegEditor
                value={p.row[p.column.key]}
                onChange={(value) => onRowUpdate(p, value)}
                onBlur={(bool) => p.onClose(bool)}
              />
            );
          };
        }

        break;
      }

      case 'textArea': {
        resultOption.editor = function setEditor(p) {
          return (
            <TextAreaEditor
              value={p.row[p.column.key]}
              onChange={(value) => onRowUpdate(p, value)}
              onBlur={(bool) => p.onClose(bool)}
            />
          );
        };

        break;
      }

      case 'serialNumber': {
        resultOption.formatter = function setFormatter(props) {
          return <div>{props.rowIdx + 1}</div>;
        };

        resultOption.filterRenderer = undefined;
      }
    }

    return resultOption;
  });
};

export const HideColumn = (
  column: HiddenColumn,
  withHeader: HeadersType,
  headers: HeadersType,
  columnTree: ColumnsTree,
  hiddenColumns: HiddenColumn[],
  setHiddenColumns: (columns: HiddenColumn[]) => void,
  setHeaders: (h: HeadersType) => void,
  setHiddenColumnKeys: (c: number[]) => void,
): void => {
  let new_hidden_columns: HiddenColumn[] = hiddenColumns.slice(0);
  const newHeaders = headers;
  //скрываем все колонки уровнем выше
  let level = column.level;
  let parentElementPosition = typeof columnTree[column.level] === 'object' ? columnTree[column.level][column.i] : null;
  const column_element = newHeaders[level].headerRow[column.i];
  let reduction =
    typeof column_element === 'object' ? (column_element.colspan !== undefined ? column_element.colspan : 1) : 1;
  const reduction_copy = reduction;
  level = column.level;
  reduction = reduction_copy;
  while (parentElementPosition !== null && level > 0) {
    const l = level;
    const start = parentElementPosition.start;

    if (parentElementPosition && parentElementPosition.start !== parentElementPosition.end) {
      const element = newHeaders[level].headerRow[parentElementPosition.start];

      if (element.colspan !== undefined && parentElementPosition?.start) {
        while (level >= 0) {
          if (level === column.level) {
            element.colspan = 0;
            newHeaders[level].headerRow[parentElementPosition.start] = element;
          }

          const n = element.colspan;
          const start = parentElementPosition.start;
          const end = parentElementPosition.end;
          new_hidden_columns = new_hidden_columns.filter((c) => {
            return !(c.level === l && c.i >= start && c.i <= end);
          });
          if (start + n < end) {
            for (let i = start + n; i <= end; i++) {
              new_hidden_columns.push({ level, i, label: '' });
            }
          }

          level--;
        }
      }

      continue;
    }

    if (!new_hidden_columns.find((c) => c.level === l - 1 && c.i === start)) {
      const parent_col = newHeaders[level - 1].headerRow[parentElementPosition.start];

      if (typeof parent_col === 'object' && parent_col.colspan) {
        parent_col.colspan -= reduction;
        if (parent_col.colspan < 0) parent_col.colspan = 0;

        if (parent_col.colspan <= 0) {
          new_hidden_columns.push({
            level: level - 1,
            i: parentElementPosition.start,
            label: parent_col.label,
          });
        }

        newHeaders[level - 1].headerRow[parentElementPosition.start] = parent_col;
      } else {
        new_hidden_columns.push({
          level: level - 1,
          i: parentElementPosition.start,
          label: parent_col.toString(),
        });
      }
    }

    level--;
    if (level > 0) parentElementPosition = columnTree[level][parentElementPosition.start];
  }

  level = column.level + 1;
  let hide_list = [column];

  //скрываем все колонки уровнем ниже
  while (columnTree[level]) {
    const l = level;
    const cells: HiddenColumn[] = [];
    hide_list.forEach((col) => {
      columnTree[l].forEach((c, i) => {
        const col1 = newHeaders[l].headerRow[i];

        if (c.start === col.i) {
          if (newHeaders[l].headerRow[i].colspan) newHeaders[l].headerRow[i].colspan = 0;

          cells.push({
            level: l,
            i,
            label: typeof col1 === 'string' ? col1 : col1.label,
          });
        }
      });
    });
    const hid_columns = new_hidden_columns;
    new_hidden_columns = new_hidden_columns.concat(
      cells.filter((c) => !hid_columns.find((h) => h.level === c.level && h.i === c.i)),
    );
    hide_list = cells;
    level++;
  }

  new_hidden_columns.push(column);
  const newHiddenColumnKeys: number[] = new_hidden_columns
    .filter((c) => c.level === withHeader.length - 1)
    .map((c) => c.i);

  if (newHeaders[column.level].headerRow[column.i].colspan) newHeaders[column.level].headerRow[column.i].colspan = 0;

  if (setHiddenColumns) setHiddenColumns(new_hidden_columns);

  setHiddenColumnKeys(newHiddenColumnKeys);
  setHeaders(newHeaders);
};

export const ShowColumn = (
  column: HiddenColumn,
  withHeader: HeadersType,
  headers: HeadersType,
  columnTree: ColumnsTree,
  hiddenColumns: HiddenColumn[],
  setHiddenColumns: (columns: HiddenColumn[]) => void,
  setHeaders: (h: HeadersType) => void,
  setHiddenColumnKeys: (c: number[]) => void,
): void => {
  let new_hidden_columns: HiddenColumn[] = hiddenColumns.slice(0);
  const newHeaders = headers;
  //показываем все колонки уровнем выше
  let level = column.level;
  newHeaders[level].headerRow[column.i] =
    typeof withHeader[level].headerRow[column.i] === 'string'
      ? withHeader[level].headerRow[column.i]
      : { ...withHeader[level].headerRow[column.i] };
  let parentElementPosition = typeof columnTree[column.level] === 'object' ? columnTree[column.level][column.i] : null;
  const column_element = newHeaders[level].headerRow[column.i];
  const reduction =
    typeof column_element === 'object' ? (column_element.colspan !== undefined ? column_element.colspan : 1) : 1;
  level = column.level;
  while (parentElementPosition !== null && level > 0) {
    if (parentElementPosition && parentElementPosition.start !== parentElementPosition.end) {
      const element = newHeaders[level].headerRow[parentElementPosition.start];

      while (level >= 0) {
        if (element.colspan !== undefined) {
          const n = element.colspan;
          const start = parentElementPosition.start;
          const end = parentElementPosition.end;
          const l = level;
          new_hidden_columns = new_hidden_columns.filter((c) => {
            return !(c.level === l && c.i >= start && c.i <= end);
          });
          if (start + n < end) {
            for (let i = start + n; i <= end; i++) {
              new_hidden_columns.push({ level, i, label: '' });
            }
          }
        }

        level--;
      }

      continue;
    }

    const l = level;
    const start = parentElementPosition.start;
    const col_index = new_hidden_columns.findIndex((c) => c.level === l - 1 && c.i === start);
    const no_index = -1;
    const parent_col = newHeaders[level - 1].headerRow[parentElementPosition.start];

    if (col_index > no_index) {
      new_hidden_columns.splice(col_index, 1);
    }

    if (typeof parent_col === 'object') {
      if (!parent_col.colspan) parent_col.colspan = reduction;
      else parent_col.colspan += reduction;

      newHeaders[level - 1].headerRow[parentElementPosition.start] = parent_col;
    } else {
    }

    level--;
    if (level > 0) parentElementPosition = columnTree[level][parentElementPosition.start];
  }

  level = column.level + 1;
  let hide_list = [column];

  //показываем все колонки уровнем ниже
  while (columnTree[level]) {
    const cells: HiddenColumn[] = [];
    const l = level;
    hide_list.forEach((col) => {
      columnTree[l].forEach((c, i) => {
        const col1 = newHeaders[l].headerRow[i];
        newHeaders[l].headerRow[i] =
          typeof withHeader[l].headerRow[i] === 'string'
            ? withHeader[l].headerRow[i]
            : { ...withHeader[l].headerRow[i] };
        if (c.start === col.i)
          cells.push({
            level: l,
            i,
            label: typeof col1 === 'string' ? col1 : col1.label,
          });
      });
    });
    new_hidden_columns = new_hidden_columns.filter((c) => !cells.find((c2) => c2.i === c.i && c2.level === c.level));
    hide_list = cells;
    level++;
  }

  new_hidden_columns = new_hidden_columns.filter((c) => !(column.i === c.i && column.level === c.level));
  const newHiddenColumnKeys: number[] = new_hidden_columns
    .filter((c) => c.level === withHeader.length - 1)
    .map((c) => c.i);

  if (setHiddenColumns) setHiddenColumns(new_hidden_columns);

  setHiddenColumnKeys(newHiddenColumnKeys);
  setHeaders(newHeaders);
};
