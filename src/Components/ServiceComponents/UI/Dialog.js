import React from 'react';
import DialogMui from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const Dialog = (props) => {
  return (
    <div>
      <DialogMui
        open={props.open}
        TransitionComponent={Transition}
        keepMounted
        onClose={props.onClose}
      >
        {props.children}
      </DialogMui>
    </div>
  );
};
