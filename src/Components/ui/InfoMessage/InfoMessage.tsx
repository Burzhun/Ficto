import React, { FC } from 'react';
import { InfoMessageUI } from './styled';

type InfoMessagePropsType = {
  title: string
}

export const InfoMessage: FC<InfoMessagePropsType> = (props) => {
  const { title } = props

  return (
    <InfoMessageUI>
      <h2>{title}</h2>
    </InfoMessageUI>
  )
}