import { Table, TableCell, TableHead, TableRow } from '@material-ui/core';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import EditIcon from '@material-ui/icons/Edit';
import EventIcon from '@material-ui/icons/Event';
import FlagIcon from '@material-ui/icons/Flag';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import PrintIcon from '@material-ui/icons/Print';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import TocIcon from '@material-ui/icons/Toc';
import {
  CardList,
  Pagination,
  PaginationContainer,
  PaginationRequestType,
  useFilter,
} from '@sas/ui-kit';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { api, endpoints } from '../../api';
import { CheckStatus } from '../../Components/TablerComponents/UI/CheckStatus';
import { Page, PageContent, PageHeader } from '../../Components/ui/Page';
import { setCurrentProjectId } from '../../Redux/actions/data.action';
import {
  IconButton,
  TableBody,
  TableCellBox,
  TableContainer,
} from '../../Style/TablesStyles/TablerStyle';
import { getObserverListWithPagination } from './api';
import {
  Btn,
  BtnContainer,
  MonitoringPageUI,
  PaginationSelector,
} from './styled';
import {
  ObserverProjectsListType,
  ObserverProjectTemplateListType,
} from './types';

const PaginationSelectUI = styled.div`
  width: 240px;
  display: flex;
  position: relative;
  top: -6px;
  left: -10px;
`;
type SelectTypeValue = { label: string; value: string } | null;

export const MonitoringPage: FC = () => {
  const { page, setPage, pagination, setPagination, setTotal } = useFilter();
  const [currentProjectIds, setCurrentProjectIds] = useState(0);
  const [projectTemplateList, setProjectTemplateList] =
    useState<ObserverProjectTemplateListType | null>(null);
  const [projectList, setProjectList] =
    useState<ObserverProjectsListType | null>(null);
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(()=>{
      localStorage.setItem('observer', 'true')
  },[])
  useEffect(() => {
    setPage(1);
    if (pagination.limit) {
      getObserverListWithPagination(pagination, currentProjectIds).then(
        (response) => {
          setProjectList(response.data.payload.result);
          setTotal(response.data.payload.total);
        }
      );
    }
  }, [pagination.limit]);

  useEffect(() => {
    (async () => {
      try {
        const response = await api.get(endpoints.observerTemplateProjectList());
        const projectList = response.data.payload.result;
        try {
          setCurrentProjectIds(projectList[0].id);
          if (!pagination.limit)
            setPagination({
              ...pagination,
              limit: parseInt(
                (localStorage.getItem('monitoring_page_size') || 10).toString()
              ),
            });
        } catch (e) {}
        setProjectTemplateList(projectList);
      } catch (e) {
        toast.error(
          'Произошла ошибка при загрузке шаблонов, попробуйте попытку позже!'
        );
      }
    })();
  }, [setPage]);

  const cardListOptions = useMemo(() => {
    return projectTemplateList?.map((node) => ({
      name: node.title,
      id: node.id,
    }));
  }, [projectTemplateList]);

  const onClickHandler = async (id: number) => {
    try {
      //  const response = await api.get(endpoints.observerTemplateProjectId(id));
      setCurrentProjectIds(id);
      setPage(1);
      getObserverListWithPagination(pagination, id).then((response) => {
        setProjectList(response.data.payload.result);
        setTotal(response.data.payload.total);
      });
    } catch (e) {}
  };

  const onClickTableNode = (id: number) => {
    localStorage.setItem('observer', 'true');
    dispatch(setCurrentProjectId(id));
    history.push('/service');
  };

  const onChangePagination = async (
    pagination: PaginationRequestType,
    page: number
  ) => {
    try {
      const response = await getObserverListWithPagination(
        pagination,
        currentProjectIds
      );
      setProjectList(response.data.payload.result);
      setPage(page);
    } catch (e) {
      toast.error('Прозошла ошибка, попробуйте позже!');
    }
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

  const downloadData = async () => {
    const response = await api.get(
      endpoints.downloadProject(currentProjectIds)
    );
    if (response.data && response.data.payload) {
      const name = response.data.payload.name;
      const a = document.createElement('a');
      a.href =
        `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,` +
        response.data.payload.data; //Image Base64 Goes here
      a.download = name; //File name Here
      a.click(); //Downloaded file
    }
  };

  const limit = pagination.limit ? pagination.limit.toString() : '10';

  return (
    <Page>
      <PageHeader title={'Мониторинг сбора данных'} />
      <PageContent>
        <MonitoringPageUI>
          {cardListOptions && (
            <CardList options={cardListOptions} onNodeClick={onClickHandler} />
          )}
          {projectList && (
            <>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <TableCellBox>
                          <AccountBoxIcon />
                          <p>Организация</p>
                        </TableCellBox>
                      </TableCell>
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
                          <FormatListNumberedIcon />
                          <p>Номер</p>
                        </TableCellBox>
                      </TableCell>
                      <TableCell>
                        <TableCellBox>
                          <FlagIcon />
                          <p>Статус</p>
                        </TableCellBox>
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {projectList &&
                      projectList.map((node) => (
                        <TableRow key={node.id}>
                          <TableCell
                            className="rowName"
                            onClick={() => onClickTableNode(node.id)}
                          >
                            {node.organization}
                          </TableCell>
                          <TableCell>{node.name}</TableCell>
                          <TableCell>{node.changesDate}</TableCell>
                          <TableCell>{node.expirationDate}</TableCell>
                          <TableCell>{node.id}</TableCell>
                          <TableCell>
                            <CheckStatus status={node.archive} />
                          </TableCell>
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
                  </TableBody>
                </Table>
              </TableContainer>
              <PaginationContainer>
                <PaginationSelectUI>
                  <BtnContainer>
                    <Btn
                      onClick={() => {
                        downloadData();
                      }}
                      size="medium"
                      type="submit"
                    >
                      Экспорт
                    </Btn>
                  </BtnContainer>
                  <PaginationSelector
                    name="demo"
                    value={{ value: limit, label: limit }}
                    label="Текст"
                    onChange={(e: SelectTypeValue) => {
                      setPagination({
                        ...pagination,
                        limit: parseInt(e ? e.value : '10'),
                      });
                      localStorage.setItem(
                        'monitoring_page_size',
                        e ? e.value : '10'
                      );
                    }}
                    options={['10', '25', '50', '100'].map((t) => ({
                      value: t,
                      label: t,
                    }))}
                    variant="standard"
                  />
                </PaginationSelectUI>
                <Pagination
                  total={pagination.total}
                  page={page}
                  limit={pagination.limit}
                  onChange={onChangePagination}
                />
              </PaginationContainer>
            </>
          )}
        </MonitoringPageUI>
      </PageContent>
    </Page>
  );
};
