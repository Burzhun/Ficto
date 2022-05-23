import React, { FC } from 'react';
import { AnalyticsCardItemUi, Icon } from './styled';
import { Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';

type AnalyticsCardItemProps = {
  path: string,
  name: string
}


export const AnalyticsCardItem: FC<AnalyticsCardItemProps> = (props) => {
  const { path, name } = props

  return (
    <Link to={path}>
      <AnalyticsCardItemUi>
        <div>
          <Icon/>
        </div>
        <div>
          <Typography variant={'h6'} >
            { name }
          </Typography>
        </div>
      </AnalyticsCardItemUi>
    </Link>
  )
}