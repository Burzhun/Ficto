import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import HotTable from '@handsontable/react';
import {
  setHOTRef,
  setHOTRowData,
  // cspell:disable-next-line
} from '../../Redux/actions/handontable.action';
import styled from 'styled-components';
import { StatusBar } from './StatusBar';
import { setLastSaveDate } from '../../Redux/actions/data.action';
import { useHttp } from '../../hooks/http.hook';
import { store } from '../../index';
import { endpoints } from "../../api";

const HotStyles = styled.div`
  margin-left: 10px;
`;

export const HandOnTablePlugin = () => {
  const { data, settings, refHOT, watchers } = useSelector(
    (state) => state.handsontable
  );
  const { currentProjectId, tables } = useSelector((state) => state.data);
  const { token } = useSelector((state) => state.auth);
  const { subjects_federation } = useSelector((state) => state.filters);
  const [didAutoSave, setAutoSave] = useState(true);
  const handOnTableRef = useRef(null);
  const { request } = useHttp();
  const dispatch = useDispatch();

  const filterOnSubjectFederation = () => {
    const filtersPlugin = handOnTableRef.current.hotInstance.getPlugin(
      'filters'
    );
    if (filtersPlugin?.enabled && subjects_federation !== '') {
      filtersPlugin.removeConditions(0);
      filtersPlugin.addCondition(0, 'eq', [subjects_federation]);
      filtersPlugin.filter();
    }
  };

  useEffect(() => {
    filterOnSubjectFederation();
  }, [filterOnSubjectFederation, subjects_federation]);

  useEffect(() => {
    dispatch(setHOTRef(handOnTableRef));
  }, [dispatch]);

  const afterChange = async (props) => {
    // console.log(props)
    // console.log(props.mok.watch)
    if (props.changes) {
      props.changes.forEach((change) => {
        const [idxRow, idxCell] = change;
        // console.log(idxRow, idxCell, prev, value)
        // console.log(idxCell)
        // console.log(props.mok.watch.find(node => node === idxCell))
        props.watchers.forEach((nodeWatcher) => {
          if (nodeWatcher.watch.find((node) => node === idxCell)) {
            let rowData = handOnTableRef.current.hotInstance.getSourceDataAtRow(
              idxRow
            );
            // console.log(rowData)
            // console.log(handOnTableRef.current.hotInstance.getSourceData())
            const formula = nodeWatcher.formula.split('|');
            // console.log(formula)
            let value = rowData[formula[1]];

            formula.forEach((node, idx) => {
              if (node === '*') {
                if (+formula[idx + 1]) {
                  value = value * rowData[formula[idx + 1]];
                } else {
                  value = value * nodeWatcher.params[formula[idx + 1]];
                }
              }
              if (node === '/') {
                if (+formula[idx + 1]) {
                  value = value / rowData[formula[idx + 1]];
                } else {
                  value = value / nodeWatcher.params[formula[idx + 1]];
                }
              }
              if (node === '-') {
                if (+formula[idx + 1]) {
                  value = value - rowData[formula[idx + 1]];
                } else {
                  value = value - nodeWatcher.params[formula[idx + 1]];
                }
              }
              if (node === '+') {
                if (+formula[idx + 1]) {
                  value = value + rowData[formula[idx + 1]];
                } else {
                  value = value + nodeWatcher.params[formula[idx + 1]];
                }
              }
            });

            // const result = (+rowData[3] * +rowData[4]) / +rowData[2]
            if (!isNaN(value)) {
              rowData[nodeWatcher.target] = value.toFixed(2);
              // handOnTableRef.current.hotInstance.setDataAtRowProp(idxRow, '', rowData)
              let newData = [
                ...handOnTableRef.current.hotInstance.getSourceData(),
              ];
              newData[idxRow] = rowData;
              // console.log(newData)
              dispatch(setHOTRowData(newData));
              // setServerSettings({
              //   ...serverSettings,
              //   data: newData
              // })
            } else {
              // rowData[props.mok.target] = ''
              // let newData = [...handOnTableRef.current.hotInstance.getSourceData()]
              // newData[idxRow] = {...rowData, [props.mok.target]: null}
              // // console.log(newData)
              // setSettingsState({
              //   ...settings,
              //   data: newData
              // })
            }
          }
        });
      });
    }
  };

  const afterChangeSetting = (changes) => {
    if (!changes) {
      return;
    } else {
      refHOT.current.hotInstance.validateCells((valid) => {
        if (valid) {
          if (didAutoSave) {
            setAutoSave(false);
            setTimeout(async () => {
              try {
                const currentTableId = store.getState().data.currentTable;
                const HOTData = refHOT.current.hotInstance.getSourceData();
                const uploadData = tables.map((node) => {
                  if (node.id === currentTableId) {
                    node.data = HOTData;
                  }
                  return {
                    id: node.id,
                    data: node.data,
                  };
                });
                await request(
                  endpoints.project(currentProjectId) + '?type=autoSave',
                  'POST',
                  {
                    tables: [...uploadData],
                  },
                  {
                    Authorization: `Bearer ${token}`,
                  }
                );

                dispatch(setLastSaveDate(new Date()));
                setAutoSave(true);
              } catch (e) {
                setAutoSave(true);
              }
            }, 30000);
          }
        }
      });
    }

    if (watchers) {
      return afterChange({ watchers, changes });
    }
  };

  return (
    <HotStyles>
      <div style={{ borderRadius: '10px' }}>
        <HotTable
          licenseKey="non-commercial-and-evaluation"
          settings={settings}
          data={data}
          ref={handOnTableRef}
          width={window.innerWidth - 20}
          height={window.innerHeight - 220}
          afterChange={(changes, source) => afterChangeSetting(changes, source)}
        />
      </div>
      <StatusBar />
    </HotStyles>
  );
};
