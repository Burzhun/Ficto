import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import { createStyles } from '@material-ui/styles';
import React, { useEffect } from 'react';
import { AboutProjectDrawer } from '../../Components/ServiceComponents/AboutProjectDrawer';
import { AboutReport } from '../../Components/ServiceComponents/AboutReport';
import NavigationDrawer from '../../Components/ServiceComponents/NavigationDrawer';
import { ServiceHeader } from '../../Containers/ServiceContainers/ServiceLayout/ServiceHeader';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexGrow: 1,
    },
    content: {
      flexGrow: 1,
    },
    container: {
      minHeight: '80vh',
      marginTop: '30px',
    },
  })
);

export const ServiceLayout = ({ children }) => {
  const classes = useStyles();
  const [state, setState] = React.useState(false);
  useEffect(() => {
    window.onbeforeunload = () => {
      return false;
    };
    return () => (window.onbeforeunload = null);
  }, []);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setState(open);
  };

  return (
    <div className={classes.root}>
      <ServiceHeader state={state} toggleDrawer={toggleDrawer} />
      <main className={classes.content}>
        <Toolbar />
        {children}
        <AboutProjectDrawer />
        <AboutReport />
        <NavigationDrawer />
      </main>
    </div>
  );
};
