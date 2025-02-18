import React, { CSSProperties, FC, useState, ReactElement, useCallback, useMemo, useEffect } from 'react';
import { HeaderGridCollectionUi, HeaderGridNestedNode, HeaderGridRow } from './styled';
import { ContextMenu, ContextMenuItem } from '../ServiceStyle';

type HeaderRowType = {
  colspan?: number;
  label: string;
  frozen?: boolean;
  key?: string;
  alignX?: 'left' | 'center' | 'right';
  alignY?: 'top' | 'center' | 'bottom';
};
const initContextMenuProps = {
  mouseX: 0,
  mouseY: 0,
};

type HiddenColumn = {
  level: number;
  i: number;
  label: string;
};

type HeaderRow = {
  headerRow: HeaderRowType[];
  height?: number;
};

export type HeadersType = HeaderRow[];

type HeadersPropsType = {
  nestedHeaders: HeadersType;
  hideColumn?(column: HiddenColumn, hiddenColumns2: HiddenColumn[]): void;
  showAllColumns(): void;
  hiddenColumns?: HiddenColumn[];
  hiddenKeys?: number[];
  setHiddenColumns?(columns: HiddenColumn[]): void;
  showHideButton?: boolean;
};

export const HeaderGridCollection: FC<HeadersPropsType> = (props) => {
  const { nestedHeaders, hiddenColumns } = props;
  const [contextMenu, setContextMenu] = useState(initContextMenuProps);
  const [selectedColumn, setSelectedColumn] = useState<HiddenColumn>();

  const getCellStyle = (row: HeaderRowType): CSSProperties => {
    return row.frozen ? { left: `var(--frozen-left-${row.key})`, zIndex: 100 } : {};
  };

  const contextMenuHandler = useCallback(
    (event: React.MouseEvent, level: number, i: number, label: string) => {
      //if (!props.showHideButton) return;
      event.preventDefault();
      const defaultXMargin = 2;
      const defaultYMargin = 4;
      const parentElement: HTMLElement | null = document.querySelector('.rdg-light');
      setContextMenu({
        mouseX: event.clientX - defaultXMargin - (parentElement ? parentElement.offsetLeft : 0),
        mouseY: event.clientY - defaultYMargin - (parentElement ? parentElement.offsetTop : 0),
      });
      setSelectedColumn({ level, i, label });
    },
    [setSelectedColumn, setContextMenu],
  );

  const handleCloseContextMenu = useCallback(() => {
    setContextMenu(initContextMenuProps);
  }, [setContextMenu]);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (event.target) {
        handleCloseContextMenu();
      }
    },
    [handleCloseContextMenu],
  );

  const scrollEvent = useCallback(
    (ev: Event) => {
      if (ev.target) {
        handleCloseContextMenu();
      }
    },
    [handleCloseContextMenu],
  );

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    document.addEventListener('scroll', scrollEvent, true);

    return () => {
      document.removeEventListener('click', handleClickOutside, true);
      document.removeEventListener('scroll', scrollEvent, true);
    };
  }, [handleClickOutside, scrollEvent]);

  const afterHide = (column: HiddenColumn) => {
    if (props.hideColumn) props.hideColumn(column, hiddenColumns || []);
  };

  const showRows = useCallback(
    (rows: HeaderRow, ind: number) => {
      const html: ReactElement[] = [];
      let gridColStart = 1;
      (rows.headerRow || []).forEach((row, ind1) => {
        if (hiddenColumns?.find((c) => c.level === ind && c.i === ind1)) return;

        if (typeof row === 'string') {
          gridColStart++;
          html.push(
            <HeaderGridNestedNode
              key={ind + '_' + ind1}
              role="columnheader"
              onContextMenu={(event) => contextMenuHandler(event, ind, ind1, row)}
              aria-colindex={ind + 1}
            >
              <h5>{row}</h5>
            </HeaderGridNestedNode>,
          );
        } else {
          const colStart = gridColStart;
          const colspan = row.colspan || 1;
          gridColStart += colspan;
          html.push(
            <HeaderGridNestedNode
              key={ind + '_' + ind1}
              grid-column-start={colStart}
              grid-column-end={colStart + colspan}
              role="columnheader"
              aria-colindex={ind + 1}
              style={getCellStyle(row)}
              alignX={row.alignX}
              alignY={row.alignY}
              onContextMenu={(event) => contextMenuHandler(event, ind, ind1, row.label)}
            >
              <h5>{row.label}</h5>
            </HeaderGridNestedNode>,
          );
        }
      });

      return html;
    },
    [hiddenColumns, contextMenuHandler],
  );

  const rows = useMemo(() => {
    return nestedHeaders.map((rows, ind1) => {
      return (
        <HeaderGridRow key={ind1} height={rows?.height}>
          {showRows(rows, ind1)}
        </HeaderGridRow>
      );
    });
  }, [nestedHeaders, showRows]);

  const menu = (
    <ContextMenu>
      <ContextMenuItem
        onClick={() => {
          if (selectedColumn) {
            setContextMenu(initContextMenuProps);
            afterHide(selectedColumn);
          }
        }}
        style={{ color: 'black' }}
        className="table_row_context"
      >
        Скрыть столбец
      </ContextMenuItem>
      <ContextMenuItem
        onClick={() => {
          setContextMenu(initContextMenuProps);
          props.showAllColumns();
        }}
        style={{ color: 'black' }}
        className="table_row_context"
      >
        Показать все столбцы
      </ContextMenuItem>
    </ContextMenu>
  );

  return (
    <>
      <HeaderGridCollectionUi>{rows}</HeaderGridCollectionUi>
      <div
        style={{
          visibility: contextMenu.mouseY !== 0 ? 'visible' : 'hidden',
          position: 'absolute',
          top: contextMenu.mouseY + 'px',
          left: contextMenu.mouseX + 'px',
          width: '200px',
          opacity: '0.9',
          color: 'white',
          zIndex: '10000',
        }}
      >
        {menu}
      </div>
    </>
  );
};
