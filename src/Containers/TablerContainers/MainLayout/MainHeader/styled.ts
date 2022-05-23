import { createStyles, makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
    },
    appBarFicto: {
      zIndex: theme.zIndex.drawer + 1,
      backgroundColor: '#051a51',
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
    success: {
      backgroundColor: theme.palette.success.light,
    },
    ring: {
      marginRight: theme.spacing(1),
      padding: '5px',
      color: theme.palette.secondary.light,
    },
    rightLink: {
      marginRight: theme.spacing(2),
      color: '#fff',
      padding: '0 5px',
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
  })
);
