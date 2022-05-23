import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import {
  AvatarName,
  Centred,
  FlexBoxBetween,
} from "../../Style/TablesStyles/TablerStyle";
import Box from "@material-ui/core/Box";
import { AvatarProfile } from "./AvatarProfile";
import { toast } from "react-toastify";


export const WorkInfoHeader: FC = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { account } = useSelector((state) => state.mainData);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const log = useSelector((state) => state.mainData?.account?.login);

  return (
    <FlexBoxBetween>
      <Centred>
          <p>{account?.organization}</p>
        {/* <MenuItem
          value={account?.organizationID}
          onClick={showOrgInfo}
        >
          {account?.organization}
        </MenuItem> */}

        {/* <Select value={currentWorkPlace} onChange={handleChange} displayEmpty>
          {workPlaceList.map((node) => (
            <MenuItem key={node.id} value={node.id}>
              {node.title}
            </MenuItem>
          ))}
        </Select> */}
      </Centred>
      <Box>
        {/*<Link to={"/profile"}>*/}
        <AvatarName
          avatar={<AvatarProfile marginLeft />}
          label={log}
          variant="outlined"
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
        {/*</Link>*/}
      </Box>
    </FlexBoxBetween >
  );
};
