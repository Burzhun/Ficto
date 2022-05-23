import { Drawer } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import SelectMui from '@material-ui/core/Select';
import React, { FC, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { showNavigationDrawer } from '../../Redux/actions/service.action';

type State = {
  auth: {
    observer: boolean;
    cardView: boolean;
  };
  mainData: {
    account: { organizationID: string };
    organizations: { organization: string; organizationID: string }[];
  };
  serviceState: {
    showNavigationDrawer: boolean;
  };
};

const NavigationDrawer: FC = () => {
  const { observer, cardView } = useSelector((state: State) => state.auth);
  const dispatch = useDispatch();
  const organizations = useSelector((state: State) => {
    return state.mainData.organizations;
  });
  const open = useSelector(
    (state: State) => state.serviceState.showNavigationDrawer
  );
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
      open={open}
      anchor={'left'}
      onClick={() => {
        dispatch(showNavigationDrawer(false));
      }}
    >
      <div
        style={{
          padding: '30px',
          background: 'white',
          height: '100%',
        }}
      >
        <List component="nav" aria-labelledby="nested-list-subheader">
          <FormControl fullWidth>
            <InputLabel id="workspaceLabel">Рабочие места</InputLabel>
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

export default NavigationDrawer;
