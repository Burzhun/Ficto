import React from 'react';
import Chip from '@material-ui/core/Chip';

export const CheckStatus = (props) => {
  if (props.status === 'available') {
    return (
      <Chip
        label="Доступно"
        size="small"
        style={{ backgroundColor: '#81c784', color: '#fff' }}
      />
    );
  }
};
