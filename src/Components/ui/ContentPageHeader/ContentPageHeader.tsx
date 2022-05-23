import React, { FC } from 'react';
import { HeaderUi } from './styled';
import { Typography } from '@material-ui/core';
import { AvatarNameProfile } from '../AvatarNameProfile';
import { AvatarProfile } from '../../TablerComponents/AvatarProfile';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

type ContentHeaderType = {
  title: string;
};

/**
 * @deprecated
 * @description use PageHeader
 * */

export const ContentPageHeader: FC<ContentHeaderType> = (props) => {
  const { title } = props;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const log = useSelector((state) => state.mainData?.account?.login);

  return (
    <HeaderUi>
      <Typography variant="h5">{title}</Typography>
      <AvatarNameProfile
        avatar={<AvatarProfile marginLeft />}
        label={log}
        variant={'outlined'}
        onClick={() => {
          toast('Скоро появится, в разработке!', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
          });
        }}
      />
    </HeaderUi>
  );
};
