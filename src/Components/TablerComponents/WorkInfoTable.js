import {
  LinearProgress,
  Table,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import EventIcon from '@material-ui/icons/Event';
import FlagIcon from '@material-ui/icons/Flag';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import PrintIcon from '@material-ui/icons/Print';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import TocIcon from '@material-ui/icons/Toc';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api, endpoints } from '../../api';
import { setCurrentProjectId } from '../../Redux/actions/data.action';
import { loadTableList } from '../../Redux/actions/workPlace.action';
import {
  IconButton,
  TableBody,
  TableCellBox,
  TableContainer,
  WorkInfoTableBox,
} from '../../Style/TablesStyles/TablerStyle';
import { CheckStatus } from './UI/CheckStatus';

export const WorkInfoTable = () => {
  const [limit, setLimit] = useState(10);
  const dispatch = useDispatch();
  const { reportsInfoList } = useSelector((state) => state.workPlaces);
  const [status, setStatus] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api(endpoints.projectFind(0));
        setLimit(data.payload.total);
        dispatch(loadTableList(data.payload.result));
      } catch (e) {}
    })();
  }, [dispatch]);

  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if (
      scrollHeight - scrollTop <= clientHeight &&
      reportsInfoList.length < limit
    ) {
      (async () => {
        setStatus((prev) => !prev);
        try {
          const { data } = await api(
            endpoints.projectFind(reportsInfoList.length)
          );
          dispatch(loadTableList([...reportsInfoList, ...data.payload.result]));
        } catch (e) {}
      })();
      setStatus((prev) => !prev);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  });

  const history = useHistory();

  const onClickHandler = async (id) => {
    dispatch(setCurrentProjectId(id));
    history.push('/service');
  };

  const onToDo = () => {
    toast('Скоро появится, в разработке!', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
    });
  };
  if (!reportsInfoList) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', height: '651px' }}>
        <div className="spinner" />
      </div>
    );
  }
  return (
    <WorkInfoTableBox>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <TableCellBox>
                  <TocIcon />
                  <p>Наименование</p>
                </TableCellBox>
              </TableCell>
              <TableCell align="right">
                <TableCellBox>
                  <EventIcon />
                  <p>Дата изменения</p>
                </TableCellBox>
              </TableCell>
              <TableCell>
                <TableCellBox>
                  <EventIcon />
                  <p>Дата окончания</p>
                </TableCellBox>
              </TableCell>
              <TableCell>
                <TableCellBox>
                  <FlagIcon />
                  <p>Статус</p>
                </TableCellBox>
              </TableCell>
              <TableCell>
                <TableCellBox>
                  <FormatListNumberedIcon />
                  <p>Номер</p>
                </TableCellBox>
              </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {reportsInfoList &&
              reportsInfoList.map((node) => (
                <TableRow key={node.id}>
                  <TableCell
                    className="rowName"
                    onClick={() => onClickHandler(node.id)}
                  >
                    {node.name}
                  </TableCell>
                  <TableCell>{node.changesDate}</TableCell>
                  <TableCell>{node.expirationDate}</TableCell>
                  <TableCell>
                    <CheckStatus status={node.archive} />
                  </TableCell>
                  <TableCell>{node.id}</TableCell>
                  <TableCell align={'right'}>
                    <TableCellBox>
                      <IconButton onClick={onToDo}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={onToDo}>
                        <StarBorderIcon />
                      </IconButton>
                      <IconButton onClick={onToDo}>
                        <PrintIcon />
                      </IconButton>
                    </TableCellBox>
                  </TableCell>
                </TableRow>
              ))}
            {status ? (
              <TableRow>
                <TableCell colSpan={8}>
                  <LinearProgress />
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </TableContainer>
    </WorkInfoTableBox>
  );
};
