import { createStyles, fade, makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    nested: {
      paddingLeft: theme.spacing(2),
    },
    drawer: {
      flexShrink: 0,
    },
    drawerPaper: {
      borderRight: 0,
      paddingLeft: '1rem',
      paddingRight: '1rem',
      position: 'relative',
    },
    drawerContainer: {
      overflow: 'auto',
    },
    search: {
      position: 'relative',
      borderRadius: '10px',
      backgroundColor: '#e9e9e9',
      border: '1px solid #eee',
      transition: 'all .3s',
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginRight: theme.spacing(2),
      marginLeft: '18px',
      marginTop: '20px',
      marginBottom: '10px',
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: 'auto',
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
    subTitle: {
      color: 'rgb(0, 0, 0, .6)',
    },
    primary: {
      color: theme.palette.primary.main,
    },
  })
);
