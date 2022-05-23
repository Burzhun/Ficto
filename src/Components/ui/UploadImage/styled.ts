import styled from 'styled-components';
import AddIcon from '@material-ui/icons/Add';
import { IconButton } from '@material-ui/core';

export const UploadImageUi = styled.section`
  width: 200px;
  height: 100%;
  border: 1px solid #c4c4c4;
  position: relative;
  margin: 0px -50px 0px 33px;
`;
export const UploadDnDContainerUi = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  cursor: pointer;
`;
export const ImgContainerUi = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
export const ImgUi = styled.img`
  max-width: 100%;
  max-height: 100%;
`;
export const AddIconUi = styled(AddIcon)`
  width: 64px;
  height: 64px;
  fill: #c4c4c4;
`;
export const DeleteBtnUi = styled(IconButton)`
  color: #0000008a;
  position: absolute;
  top: 0;
  right: 0;
`;
