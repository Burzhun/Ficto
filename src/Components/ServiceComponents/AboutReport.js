import React, { useEffect } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useSelector } from 'react-redux';
import {
  Drawer,
  DrawerContainer,
  HeaderReport,
} from '../../Style/ServiceStyles/ServiceStyle';

const drawerWidth = 450;

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

export const AboutReport = () => {
  const classes = useStyles();
  const open = useSelector((state) => state.serviceState.showAboutReport);
  const descriptions = useSelector((state) => state.data.descriptions);

  useEffect(() => {
    const el = document.getElementById('description');
    el.innerHTML = descriptions;
  }, [descriptions]);

  return (
    <Drawer
      className={classes.drawer}
      variant="persistent"
      anchor="right"
      open={open}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <HeaderReport />
      <DrawerContainer>
        <h2>Описание проекта</h2>
        <div id="description" />
      </DrawerContainer>
    </Drawer>
  );
};
