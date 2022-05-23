import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import React from 'react';
import {useSelector} from "react-redux";
import { ServiceButton } from '../../../Style/ServiceStyles/ServiceStyle';

export const MenuComponent = (props) => {
  const {type} = useSelector(state => state.data)
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      {type !== 'archive'
      &&
      <ServiceButton variant="contained" onClick={handleClick}>
        Заполнить
        <i class="arrow-down"></i>
      </ServiceButton>
      }
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        // elevation={0}
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
        <MenuItem
          onClick={() => {
            props.openDialog();
            handleClose();
          }}
        >
          Из предыдущего отчета
        </MenuItem>
      </Menu>
    </div>
  );
};
