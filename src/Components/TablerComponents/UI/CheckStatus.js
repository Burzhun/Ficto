import Chip from '@material-ui/core/Chip';
import React from 'react';

export const CheckStatus = (props) => {
  if (props.status) {
    return <Chip label={'Архив'} size="small" />;
  }

  if (props.status === 'send') {
    return (
      <Chip
        color={'secondary'}
        label={'Отправлен'}
        style={{ color: '#fff' }}
        size="small"
      />
    );
  }

  return (
    <Chip
      label="В работе"
      size="small"
      style={{
        backgroundColor: '#1951db',
        color: '#fff',
        paddingLeft: '2px',
        paddingRight: '2px',
      }}
    />
  );
};
