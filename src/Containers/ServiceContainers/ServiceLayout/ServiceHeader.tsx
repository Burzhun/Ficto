// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import {
  AddCircleOutline,
  Assignment,
  CloudDownload,
  HelpOutline,
} from '@material-ui/icons';
import DescriptionIcon from '@material-ui/icons/Description';
import FeedbackIcon from '@material-ui/icons/Feedback';
import MenuIcon from '@material-ui/icons/Menu';
import { ConfirmDrawer } from '@sas/ui-kit';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { api, endpoints } from '../../../api';
import { MainLogo } from '../../../Components/Common/MainLogo';
import { AvatarProfile } from '../../../Components/ServiceComponents/AvatarProfile';
import { downloadFileBase64 } from '../../../helpers/downloadFileBase64';
import { logout } from '../../../Redux/actions/auth.actions';
import {
  setCurrentTable,
  setTables,
  setTabs,
} from '../../../Redux/actions/data.action';
import {
  setHOTRowData,
  setHOTSettings,
  setHOTWatchers,
} from '../../../Redux/actions/handontable.action';
import {
  showAboutProject,
  showAboutReport,
  showNavigationDrawer,
} from '../../../Redux/actions/service.action';
import {
  AboutReport,
  Tab,
  Tabs,
  ToolbarBox,
  ToolsLeft,
  ToolsRight,
} from '../../../Style/ServiceStyles/ServiceStyle';
import { FeedbackForm } from '../../TablerContainers/MainLayout/MainHeader/components/FeedbackForm';
import { AddTabsServiceHeader } from './ AddTabsServiceHeader';
import DeletTabs from './DeletTabs';
import EditTabs from './EditTabs';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    leftBox: {
      flexGrow: 1,
      display: 'flex',
      alignItems: 'center',
      paddingLeft: '1rem',
    },
    button: {
      padding: '9px',
    },
    buttons: {
      background: 'red',
    },

    drawwer: {
      width: '40%',
      height: 'auto',
      top: 145,
      left: '30%',
    },
    success: {
      backgroundColor: theme.palette.success.light,
    },
    ring: {
      marginRight: theme.spacing(1),
      padding: '5px',
      color: theme.palette.secondary.light,
    },
    faq: {
      marginRight: theme.spacing(2),
      color: '#fff',
      padding: '0 5px',
    },
    about: {
      marginLeft: '10px',
      color: '#fff',
      padding: '0 5px',
      height: '30px',
      textTransform: 'none',
    },
    download: {
      display: 'flex',
      justifyContent: 'center',
      paddingRight: '5px',
    },
    title: {
      marginRight: '250px',
    },
    titleMargin: {
      marginRight: '30px',
    },
    link: {
      fontSize: '18px',
      marginRight: '2rem',
    },
    regular: {
      minHeight: '20px',
      paddingLeft: '0',
      paddingRight: '0',
    },
  })
);

export type TabsType = {
  value: number;
  label: string;
  canCopy: boolean;
  canCreate: boolean;
};

export const ServiceHeader: FC = () => {
  const classes = useStyles();
  const addIconRef = useRef(null);
  const ref = useRef(null);
  const org = useSelector((state) => state.data.organization);
  const { tables, type } = useSelector((state) => state.data);
  const dispatch = useDispatch();
  const { template } = useSelector((state) => state.serviceState);
  const titleProject = useSelector((state) => state.data.titleProject);
  const tabs = useSelector((state) => state.data.tabs);
  const { plugin, currentProjectId } = useSelector((state) => state.data);
  const currentTableId = useSelector((state) => state.data.currentTable);
  const [update, setUpdate] = useState<number>(1);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [subEl, setSubEl] = React.useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [isOpenAddMenu, setIsOpenAddMenu] = useState(false);
  const { refHOT } = useSelector((state) => state.handsontable);
  const id = useSelector((state) => state.data.currentTable);
  const [isOpenRightMenu, setIsOpenRightMenu] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [openEditTabs, setOpenEditTabs] = useState(null);
  const [openDeleteTabs, setOpenDeleteTabs] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [changeTableId, setChangeTableId] = useState(null);
  const [nextTab, setNextTab] = useState(0);
  const [isObserver, setIsObserver] = useState(false);
  const onCloseRightMenu = useCallback(() => {
    setIsOpenRightMenu(false);
  }, []);
  const [action, setAction] = useState('');
  const [targetTab, setTargetTab] = useState<null | TabsType>(null);

  const handleChange = (event, newValue) => {
    setNextTab(newValue);
  };
  // fixme решает проблему с активным табом при обновлении/уходу с проекта
  useEffect(() => {
    if (tabs?.length !== 0) {
      tabs.forEach((node, idx) => {
        if (node.id === currentTableId) {
          setCurrentTab(idx);
        }
      });
    }
  }, [tabs, currentTableId]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api(endpoints.getTabs(currentProjectId));
        dispatch(setTabs(data.payload));
      } catch (e) {}
    })();
  }, [update, currentProjectId, dispatch]);

  useEffect(() => {
    const observer = localStorage.getItem('observer');
    setIsObserver(observer);

    return () => {
      localStorage.removeItem('observer');
    };
  }, []);
  const closeConfirmDrawer = () => {
    setOpenConfirm(false);
  };

  const openConfirmDrawer = (id: number) => {
    if (id !== currentTableId) {
      setChangeTableId(id);
      setOpenConfirm(true);
    }
  };

  const changeTableHandler = (id) => {
    switch (plugin) {
      case 'handsontable': {
        dispatch(
          setTables(
            tables.map((table) => {
              if (table.id === currentTableId) {
                table.data = refHOT.current.hotInstance.getSourceData();
              }
              return table;
            })
          )
        );
        dispatch(setHOTRowData(currentTable.data));
        dispatch(setHOTSettings(currentTable.options));
        if (currentTable.options.watchers) {
          dispatch(setHOTWatchers(currentTable.options.watchers));
        }
        break;
      }
      default: {
      }
    }
    dispatch(setCurrentTable(id));
  };
  const onConfirmChangeTable = () => {
    setCurrentTab(nextTab);
    changeTableHandler(changeTableId);
    closeConfirmDrawer();
  };

  const testHandler = () => {
    toast('  Скоро появится, в разработке!', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
    });
  };

  const CSVfromBack = async () => {
    switch (plugin) {
      case 'table': {
        try {
          const response = await api.get(
            endpoints.exportProject(currentProjectId)
          );
          downloadFileBase64(response.data.payload);
        } catch (e) {}
        break;
      }
      default: {
        toast('  Скоро появится, в разработке!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
        });
        break;
      }
    }
    setAnchorEl(null);
  };

  const getCSV = async () => {
    const currentTable = tables.find((node) => node.id === id);
    switch (plugin) {
      case 'handsontable': {
        const downloadPlugin =
          refHOT.current.hotInstance.getPlugin('exportFile');
        downloadPlugin.downloadFile('csv', {
          filename: `${titleProject}_${currentTable.name}`,
          columnDelimiter: ';',
        });
        break;
      }
      case 'table': {
        break;
      }
      default:
        break;
    }
    setAnchorEl(null);
  };

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar className={classes.regular}>
        <Box className={classes.leftBox}>
          <MainLogo />
          <Typography style={{ marginLeft: '15px' }} variant="h7">
            {org}
          </Typography>
        </Box>

        <Box className={classes.leftBox}>
          <h2>{titleProject}</h2>
        </Box>
        <AvatarProfile onClick={testHandler} />
        <Button
          color="inherit"
          onClick={() => {
            localStorage.removeItem('userToken');
            dispatch(logout());
          }}
        >
          Выход
        </Button>
      </Toolbar>
      <Toolbar className={classes.regular}>
        <ToolbarBox>
          <ToolsLeft>
            <IconButton
              onClick={() => {
                dispatch(showNavigationDrawer(true));
              }}
              style={{ color: 'white', marginRight: '5px' }}
            >
              <MenuIcon />
            </IconButton>
            <Tabs
              ref={ref}
              value={currentTab}
              onChange={handleChange}
              textcolor="primary"
              variant="scrollable"
              scrollButtons="auto"
            >
              {tabs.map((node) => {
                return (
                  <Tab
                    style={{ color: '#4287f5', background: 'white' }}
                    key={node.id}
                    title={node.title}
                    label={node.title}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setSubEl(node);
                    }}
                    onClick={() => {
                      openConfirmDrawer(node.id);
                    }}
                  />
                );
              })}
              {type !== 'archive' &&
                !isObserver &&
                template &&
                (tabs.filter((el) => el.canCopy).length > 0 ||
                  tabs.filter((el) => el.canCreate).length > 0) && (
                  <AddCircleOutline
                    ref={addIconRef}
                    style={{
                      padding: '18px 0 0 5px',
                      cursor: 'pointer',
                      color: 'white',
                    }}
                    onClick={() => {
                      setIsOpenAddMenu(true);
                    }}
                  />
                )}
            </Tabs>
            <Menu
              open={isOpenAddMenu}
              anchorEl={addIconRef.current}
              onClose={() => setIsOpenAddMenu(false)}
              getContentAnchorEl={null}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            >
              {tabs.filter((el) => el.canCopy).length > 0 && (
                <MenuItem
                  onClick={() => {
                    setOpen((prev) => !prev);
                    setAction('copy');
                    setTargetTab(null);
                  }}
                >
                  Копировать
                </MenuItem>
              )}
              {tabs.filter((el) => el.canCreate).length > 0 && (
                <MenuItem
                  onClick={() => {
                    setOpen((prev) => !prev);
                    setAction('sample');
                    setTargetTab(null);
                  }}
                >
                  Создать по шаблону
                </MenuItem>
              )}
            </Menu>

            {tabs.map((node, i) => {
              return (
                <Menu
                  key={i}
                  data-id={i}
                  id="simple-menu"
                  anchorEl={
                    ref?.current?.children[1]?.className ===
                    'MuiTabs-scrollable'
                      ? ref.current?.children[2]?.children[0]?.children[i]
                      : ref.current?.children[1]?.children[0]?.children[i]
                  }
                  keepMounted
                  open={
                    subEl === node &&
                    !isObserver &&
                    type !== 'archive' &&
                    (node.userId !== null || node.canCopy || node.canCreate)
                  }
                  onClose={() => setSubEl(null)}
                  getContentAnchorEl={null}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                >
                  {node.canCopy && (
                    <MenuItem
                      onClick={() => {
                        setOpen((prev) => !prev);
                        setAction('copy');
                        setTargetTab(node);
                      }}
                    >
                      Копировать
                    </MenuItem>
                  )}
                  {node.canCreate && (
                    <MenuItem
                      onClick={() => {
                        setOpen((prev) => !prev);
                        setAction('sample');
                        setTargetTab(node);
                      }}
                    >
                      Создать по шаблону
                    </MenuItem>
                  )}
                  {node.userId && (
                    <MenuItem
                      onClick={() => {
                        setOpenEditTabs(node);
                      }}
                    >
                      Переименовать
                    </MenuItem>
                  )}
                  {node.userId && (
                    <MenuItem
                      onClick={() => {
                        setOpenDeleteTabs(node.id);
                      }}
                    >
                      Удалить
                    </MenuItem>
                  )}
                </Menu>
              );
            })}
            {open && (
              <AddTabsServiceHeader
                targetTab={
                  targetTab && { value: targetTab.id, label: targetTab.title }
                }
                action={action}
                setOpen={setOpen}
              />
            )}
            {openEditTabs && (
              <EditTabs
                node={openEditTabs}
                setOpenEditTabs={setOpenEditTabs}
                setSubEl={setSubEl}
                setUpdate={setUpdate}
              />
            )}

            {openDeleteTabs && (
              <DeletTabs
                currentTableId={currentTableId}
                tabsList={tabs}
                id={openDeleteTabs}
                setOpenDeleteTabs={setOpenDeleteTabs}
                setSubEl={setSubEl}
                setUpdate={setUpdate}
              />
            )}

            <ToolsRight>
              <AboutReport>
                <Button
                  startIcon={<Assignment />}
                  className={classes.about}
                  component={Link}
                  size="small"
                  onClick={() => {
                    dispatch(showAboutProject(true));
                  }}
                >
                  <p>Реквизиты</p>
                </Button>
                <Button
                  startIcon={<CloudDownload />}
                  className={classes.about}
                  component={Link}
                  size="small"
                  onClick={(event) => {
                    setAnchorEl(event.currentTarget);
                  }}
                >
                  <p>Экспорт</p>
                </Button>

                <Menu
                  id="simple-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                  getContentAnchorEl={null}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                >
                  {plugin === 'handsontable' ? (
                    <MenuItem onClick={getCSV}>
                      сохранить текущую вкладку в .csv
                    </MenuItem>
                  ) : null}
                  <MenuItem onClick={CSVfromBack}>
                    сохранить весь проект
                  </MenuItem>
                </Menu>

                <Button
                  startIcon={<DescriptionIcon />}
                  className={classes.about}
                  component={Link}
                  size="small"
                  target="_blank"
                  onClick={() => dispatch(showAboutReport())}
                >
                  <p>Описание проекта</p>
                </Button>
                <Button
                  startIcon={<FeedbackIcon />}
                  className={classes.about}
                  component={Link}
                  size={'small'}
                  onClick={() => setIsOpenRightMenu(true)}
                  target="_blank"
                >
                  Обратная связь
                </Button>
                <Button
                  startIcon={<HelpOutline />}
                  className={classes.about}
                  component={Link}
                  size={'small'}
                  target="_blank"
                >
                  Справка
                </Button>
              </AboutReport>
            </ToolsRight>
          </ToolsLeft>
        </ToolbarBox>
      </Toolbar>
      <Drawer
        anchor={'right'}
        open={isOpenRightMenu}
        onClose={onCloseRightMenu}
      >
        <FeedbackForm handleClose={onCloseRightMenu} />
      </Drawer>
      <ConfirmDrawer
        isOpenMenu={openConfirm}
        onCloseMenu={closeConfirmDrawer}
        onConfirm={onConfirmChangeTable}
        message={'Все несохраненные данные будут утеряны! Вы уверены?'}
      />
    </AppBar>
  );
};
