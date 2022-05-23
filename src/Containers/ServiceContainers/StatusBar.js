import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
// import {useDispatch, useSelector} from "react-redux";
// import {useHttp} from "../../hooks/http.hook";
// import {setPrevTableData} from "../../Redux/actions/data.action";

const StatusBarStyles = styled.div`
  margin-top: 3px;
  height: 100%;
  width: calc(100% - 10px);
  display: flex;
  justify-content: space-between;
`;

const getHoursFormat = (time) => {
  return +time.getHours() <= 9 ? '0' + +time.getHours() : +time.getHours();
};

const getMinutesFormat = (time) => {
  return +time.getMinutes() <= 9
    ? '0' + +time.getMinutes()
    : +time.getMinutes();
};

export const StatusBar = () => {
  const { lastSave } = useSelector((state) => state.data);
  // const {gridApi, currentProjectId, tables, currentTable, previousTableData} = useSelector(state => state.data)
  // const {request} = useHttp()
  // const {token} = useSelector(state => state.auth)
  // const dispatch = useDispatch()

  // useEffect(() => {
  //   const interval = setInterval(async () => {
  //     const newData = []
  //
  //     gridApi.forEachNode((node) => {
  //       newData.push(node.data)
  //     })
  //
  //     const uploadData = tables.map(node => {
  //       if (node.id === currentTable) {
  //         node.data = newData
  //       }
  //       return {
  //         id: node.id,
  //         data: node.data
  //       }
  //     })
  //     console.log(newData, previousTableData)
  //
  //     console.log(JSON.stringify(newData) === JSON.stringify(previousTableData))
  //     if (newData.length !== previousTableData.length) {
  //
  //     }
  //
  //     if (JSON.stringify(newData) === JSON.stringify(previousTableData)) {
  //     } else {
  //       // console.log('Save')
  //       // try {
  //       //   await request(`/api/project/${currentProjectId}`, 'POST', {
  //       //     tables: [...uploadData]
  //       //   }, {
  //       //     Authorization: `Bearer ${token}`
  //       //   })
  //       // } catch (e) {
  //       //   console.log(e)
  //       // }
  //       setTime(new Date())
  //       dispatch(setPrevTableData([...newData]))
  //     }
  //   }, 3000)
  //
  //   return () => clearInterval(interval)
  //   // eslint-disable-next-line
  // }, [gridApi, previousTableData])

  return (
    <StatusBarStyles>
      <div />
      <div>
        Сохранено: {`${getHoursFormat(lastSave)}:${getMinutesFormat(lastSave)}`}
      </div>
    </StatusBarStyles>
  );
};
