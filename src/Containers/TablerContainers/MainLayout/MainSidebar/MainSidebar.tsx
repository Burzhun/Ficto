import Drawer from '@material-ui/core/Drawer';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import SelectMui from '@material-ui/core/Select';
import Toolbar from '@material-ui/core/Toolbar';
import React, { FC, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useStyles } from './styled';

// TODO: Вынести в типы общего store после слияния
type State = {
  auth: {
    observer: boolean;
    cardView: boolean;
  };
  mainData: {
    account: { organizationID: string };
    organizations: { organization: string; organizationID: string }[];
  };
};

export const MainSidebar: FC = () => {
  const classes = useStyles();
  const { observer, cardView } = useSelector((state: State) => state.auth);
  const organizations = useSelector((state: State) => {
    return state.mainData.organizations;
  });
  const currentOrganisation = useSelector((state: State) => {
    return state.mainData?.account?.organizationID || '';
  });
  const workplaceOptions = useMemo(() => {
    if (Array.isArray(organizations)) {
      return organizations.map((node) => {
        return { value: node.organizationID, label: node.organization };
      });
    } else return [];
  }, [organizations]);

  return (
    <Drawer
      open={false}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <Toolbar />
      <div>
        <List component="nav" aria-labelledby="nested-list-subheader">
          <FormControl fullWidth>
            <InputLabel id="workspaceLabel">Рабочие места</InputLabel>
            {/*TODO: вынести в компоненты select под material*/}
            <SelectMui labelId="workspaceLabel" value={currentOrganisation}>
              {workplaceOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </SelectMui>
          </FormControl>
        </List>
        <List>
          {cardView && (
            <Link to={'/organization'}>
              <ListItem button>
                <ListItemText primary={'Об организации'} />
              </ListItem>
            </Link>
          )}
          <Link to={'/'}>
            <ListItem button>
              <ListItemText primary={'Проекты'} />
            </ListItem>
          </Link>
          {observer && (
            <Link to={'/monitoring'}>
              <ListItem button>
                <ListItemText primary={'Мониторинг'} />
              </ListItem>
            </Link>
          )}
          <Link to={'/analytics'}>
            <ListItem button>
              <ListItemText primary={'Аналитика'} />
            </ListItem>
          </Link>
        </List>
      </div>
    </Drawer>
  );
};
