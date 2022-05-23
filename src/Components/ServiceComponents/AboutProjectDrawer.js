import IconButton from '@material-ui/core/IconButton';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Drawer } from '@sas/ui-kit';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { showAboutProject } from '../../Redux/actions/service.action';
import { DrawerContainer } from '../../Style/ServiceStyles/ServiceStyle';
import { ReportForm } from './UI/ReportForm';
import { ResponsobilesData } from './UI/ResponsobiledData';

const CloseBtn = styled(IconButton)`
  position: absolute;
  right: 2px;
  top: 2px;
`;

const drawerWidth = 350;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
  },
}));

export const AboutProjectDrawer = () => {
  const classes = useStyles();
  const open = useSelector((state) => state.serviceState.showAboutProject);
  const { aboutProjectInfoData } = useSelector((state) => state.serviceState);
  const dispatch = useDispatch();

  return (
    <Drawer
      isOpenMenu={open}
      onCloseMenu={() => {
        dispatch(showAboutProject(false));
      }}
      title="Реквизиты отчета"
    >
      <DrawerContainer>
        <p>
          <strong>Номер отчета:</strong> {aboutProjectInfoData.number}
        </p>
        <p>
          <strong>Изменен:</strong> {aboutProjectInfoData.changeDate}
        </p>
        <p>
          <strong>Дата завершения:</strong>{' '}
          {aboutProjectInfoData.expirationDate}
        </p>
        <p>
          <strong>Статус:</strong>{' '}
          {aboutProjectInfoData.status ? 'Архивный' : 'В работе'}
        </p>
      </DrawerContainer>
      {aboutProjectInfoData.status ? <ResponsobilesData /> : <ReportForm />}
    </Drawer>
  );
};
