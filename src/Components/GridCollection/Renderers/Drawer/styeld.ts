import styled from 'styled-components';
import { Drawer } from 'antd';

export const DrawerUI = styled(Drawer)``;
export const ContainerUI = styled.div`
  min-width: 300px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: ${(props: { width: string | undefined }) => props.width};
`;

export const HeaderUi = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 10px;
  align-items: baseline;
`;
