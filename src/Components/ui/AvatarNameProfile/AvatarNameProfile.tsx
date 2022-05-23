import React, { FC, ReactElement } from 'react';
import { AvatarName } from './styled';

type AvatarNameTypes = {
  avatar: ReactElement,
  label: string,
  variant: "default" | "outlined" | undefined,
  onClick: (() => void) | undefined
}

export const AvatarNameProfile: FC<AvatarNameTypes> = (props) => {
  const {avatar, label, variant, onClick} = props

  return (
    <AvatarName
      avatar={avatar}
      label={label}
      variant={variant}
      onClick={onClick}
    />
  )
}