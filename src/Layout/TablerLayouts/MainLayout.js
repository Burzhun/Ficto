import { makeStyles, createStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import { MainHeader } from '../../Containers/TablerContainers/MainLayout/MainHeader';
import { MainSidebar } from '../../Containers/TablerContainers/MainLayout/MainSidebar';

const useStyles = makeStyles(() =>
  // todo: запилить grid-areas
  createStyles({
    root: {
      top: 0,
      display: 'grid',
      gridTemplateColumns: '200px 1fr',
      gridTemplateRows: '1fr',
      position: 'relative',
      height: '100vh',
    },
    content: {
      flexGrow: 1,
    },
    container: {
      minHeight: '80vh',
    },
  })
);

export const MainLayout = ({ children }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <MainHeader />
      <MainSidebar />
      <main className={classes.content}>
        <Toolbar />
        {children}
      </main>
    </div>
  );
};
