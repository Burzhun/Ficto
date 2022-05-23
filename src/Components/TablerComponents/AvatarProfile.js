import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import PersonIcon from '@material-ui/icons/Person';
import { createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() =>
  createStyles({
    button: {
      padding: '9px',
    },
    success: {
      backgroundColor: '#81c784',
    },
  })
);

export const AvatarProfile = (props) => {
  const classes = useStyles();

  return (
    <IconButton
      style={props.marginLeft ? { marginLeft: '-10px' } : {}}
      className={classes.button}
    >
      <Avatar className={classes.success}>
        <PersonIcon />
      </Avatar>
    </IconButton>
  );
};
