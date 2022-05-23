import { Link as LinkMaterial } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Badge from '@material-ui/core/Badge';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { HelpOutline } from '@material-ui/icons';
import FeedbackIcon from '@material-ui/icons/Feedback';
import NotificationsIcon from '@material-ui/icons/Notifications';
import academyLogo from 'img/academyLogo.png';
import fictoLogo from 'img/fictoLogo.svg';
import React, { FC, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { AvatarProfile } from '../../../../Components/TablerComponents/AvatarProfile';
import { logout } from '../../../../Redux/actions/auth.actions';
import { FeedbackForm } from './components/FeedbackForm';
import { useStyles } from './styled';

export const MainHeader: FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const matches = useMediaQuery('(min-width:600px)');
  const [isOpenRightMenu, setIsOpenRightMenu] = useState(false);
  const onCloseRightMenu = useCallback(() => {
    setIsOpenRightMenu(false);
  }, []);
  const isFicto = window.location.host === 'sas.ficto.ru';

  return (
    <AppBar
      position="fixed"
      className={isFicto ? classes.appBarFicto : classes.appBar}
    >
      <Toolbar>
        <Box className={classes.leftBox}>
          <a href="/">
            <img
              className="academyLogo"
              src={isFicto ? fictoLogo : academyLogo}
              alt="academyLogo.png"
            />
          </a>
          <Typography
            variant="h6"
            className={matches ? classes.title : classes.titleMargin}
          >
            Система мониторинга
          </Typography>
        </Box>
        <Button
          startIcon={<FeedbackIcon />}
          className={classes.rightLink}
          size="small"
          target="_blank"
          component={LinkMaterial}
          onClick={() => setIsOpenRightMenu(true)}
        >
          <p>Обратная связь</p>
        </Button>
        <Button
          startIcon={<HelpOutline />}
          color="inherit"
          component={LinkMaterial}
          className={classes.rightLink}
          size={'small'}
          href={'https://sasdoc.ficto.ru'}
          target="_blank"
        >
          Руководство пользователя
        </Button>
        <IconButton
          className={classes.ring}
          onClick={() => {
            toast('Скоро появится, в разработке!', {
              position: 'top-right',
              autoClose: 3000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
            });
          }}
        >
          <Badge badgeContent={0} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <div
          onClick={() => {
            toast('Скоро появится, в разработке!', {
              position: 'top-right',
              autoClose: 3000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
            });
          }}
        >
          <AvatarProfile />
        </div>
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
      <Drawer
        anchor={'right'}
        open={isOpenRightMenu}
        onClose={onCloseRightMenu}
      >
        <FeedbackForm handleClose={onCloseRightMenu} />
      </Drawer>
    </AppBar>
  );
};
