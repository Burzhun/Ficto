import React, { FC, useState, useMemo, useEffect } from 'react';
import { Switch } from 'antd';
import { Popover } from 'antd';
import { ColumnGraph, HiddenColumn, HeadersType, HeaderRowType, ColumnsTree } from '../../../../types';
import { TableButton } from '../../ServiceStyle';
import { ColumnsPopup, Wrapper } from './styled';

const column_graph_offset = 20;
type HideColumnButtonPropsType = {
  hiddenColumns: HiddenColumn[];
  setColumn: (c: HiddenColumn, type: number, hiddenColumns2: HiddenColumn[]) => void;
  columnTree: ColumnsTree | undefined;
  headers: HeadersType;
  showAllColumns: () => void;
  disabled?: boolean;
};

export const HideColumnButton: FC<HideColumnButtonPropsType> = (props) => {
  const { hiddenColumns, setColumn, columnTree, headers, showAllColumns, disabled } = props;
  const [hidMenuOpen, setHidMenuOpen] = useState<Element | null>(null);
  const [graphs, setGraph] = useState<ColumnGraph[] | undefined>(undefined);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setHidMenuOpen(event.currentTarget as Element);
  };

  const id = useMemo(() => {
    return hidMenuOpen ? 'simple-popover' : undefined;
  }, [hidMenuOpen]);

  useEffect(() => {
    const graphs: ColumnGraph[] = [];

    if (columnTree && headers.length) {
      headers[0].headerRow.forEach((cell: HeaderRowType, i: number) => {
        let j = 1;
        const cg: ColumnGraph = { level: 0, i, label: cell.label, nested: [] };
        let current_cells = [cg];

        while (columnTree[j] && j < headers.length) {
          const child_cells: ColumnGraph[] = [];
          const newJ = j;
          current_cells.forEach((cell2: ColumnGraph) => {
            for (let k = 0; k < columnTree[newJ].length; k++) {
              if (cell2.i === columnTree[newJ][k].start) {
                if (!headers[newJ].headerRow[k]) {
                  continue;
                }

                const cg1: ColumnGraph = {
                  level: newJ,
                  i: k,
                  label:
                    typeof headers[newJ].headerRow[k] === 'string'
                      ? headers[newJ].headerRow[k].toString()
                      : headers[newJ].headerRow[k].label || '',
                  nested: [],
                };
                cell2.nested?.push(cg1);
                child_cells.push(cg1);
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
  }, [columnTree, headers]);

  const showColumn = (html: JSX.Element[], c: ColumnGraph, level: number) => {
    const checked = hiddenColumns?.find((c1) => c1.i === c.i && c1.level === c.level) !== undefined;

    if (c.label) {
      html.push(
        <div
          key={'columnHide' + c.label + c.level}
          style={{ marginBottom: '5px', marginLeft: level * column_graph_offset + 'px' }}
        >
          <Switch
            checked={checked}
            onChange={(checked2) => {
              setColumn({ i: c.i, level: c.level, label: c.label }, checked2 ? 0 : 1, hiddenColumns);
            }}
          />{' '}
          {c.label}
        </div>,
      );
    }

    c.nested?.forEach((c2: ColumnGraph) => {
      showColumn(html, c2, level + (c.label ? 1 : 0));
    });

    return html;
  };

  const showTree = () => {
    const html: JSX.Element[] = hiddenColumns?.length
      ? [
          <TableButton key="graph_hide_button" onClick={() => showAllColumns()}>
            Отображать столбцы
          </TableButton>,
        ]
      : [];

    if (graphs) {
      graphs.forEach((g: ColumnGraph) => {
        showColumn(html, g, 0);
      });
    }

    return html;
  };

  const content = <ColumnsPopup>{showTree()}</ColumnsPopup>;

  const hiddenColumnsCount = useMemo(() => {
    return hiddenColumns ? hiddenColumns.filter((c) => c.level === headers.length - 1).length : 0;
  }, [hiddenColumns, headers]);

  return (
    <Wrapper id="hidecolswrap">
      <Popover
        id={id}
        content={content}
        trigger="click"
        placement="rightTop"
        getPopupContainer={() => document.getElementById('hidecolswrap') as HTMLElement}
      >
        <TableButton disabled={disabled} onClick={handleClick}>
          {hiddenColumns?.length ? 'Скрыто столбцов ' + hiddenColumnsCount.toString() : 'Скрыть столбцы'}
        </TableButton>
      </Popover>
    </Wrapper>
  );
};
