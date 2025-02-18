import Icon from '@ant-design/icons';
import { Button as ButtonMui, Select } from 'antd';
import { Drawer as DrawerMui } from 'antd';
import styled from 'styled-components';
import { Tabs as TabsMui } from 'antd';
import { Button as SasBtn } from '@ficto/sas-ui-kit';

const { TabPane } = TabsMui;

export const TableContentBox = styled.div`
  display: flex;
  width: 100%;
  max-height: calc(100vh - 300px);
  height: calc(100vh - 80px);
  flex-direction: column;
  -ms-overflow-style: none;
  scrollbar-width: none;
  overflow: auto;
  /* @media (width > 1900px) {
    width: 1830px;
  } */
  &.projectPageTable {
    width: 100% !important;
    height: calc(100vh - 400px);
  }
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const Tab = styled(TabPane)`
  min-height: 0;
  margin-right: 5px;
  margin-top: 10px;
  text-transform: none;
  background-color: #eee;
  opacity: 0.7;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;

  &.Mui-selected {
    opacity: 1;
    background-color: #fff;
  }
`;

export const Tabs = styled(TabsMui)`
  & .MuiTabs-indicator {
    background-color: #fff;
  }
`;

export const ServiceContainer = styled.div`
  margin-top: 70px;
  margin-left: 2%;
  margin-right: 100px;
`;

export const ToolbarBox = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;

  & .MuiTabs-root {
    flex: 1;
    height: 48px;
    max-width: 100%;
  }

  & .MuiTab-wrapper {
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;
export const ToolsRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;
export const ToolsLeft = styled.div`
  display: flex;
  flex-grow: 1;
  max-width: 100%;
  justify-content: space-between;
`;

export const LegendBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 24px;
  box-sizing: border-box;
`;

export const NewLegendBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 20px;
  gap: 10px;
  height: 50px;
  border-bottom: 1px solid rgb(176, 176, 176);
  .ant-tooltip {
    max-width: 400px !important;
  }
`;
export const LegendText = styled.div`
  p,
  b {
    all: unset;
    font-family: SF Pro;
    font-size: 16px;
    font-weight: 500;
    line-height: 20px;
    text-align: left;
  }
`;

export const ButtonTableBox = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-start;
`;

interface Props {
  bgcolor?: string;
  width?: string;
  disabled?: boolean;
  isArchive?: boolean;
}

export const ServiceButton = styled(ButtonMui)<Props>`
  max-width: ${(props) => props.width || '150px'};
  text-transform: none;
  pointer-events: ${(props) => (props.disabled ? 'none' : null)};
  background-color: ${(props) => (props.disabled ? '#dddddd' : props.bgcolor || '#2196f3')} !important;
  color: #fff !important;

  &:hover {
    background-color: ${(props) => props.bgcolor || '#2196f3'} !important;
  }

  & .arrow-down {
    width: 0;
    height: 0;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    border-top: 7px solid #fff;
    margin-left: 8px;
    margin-top: -1px;
  }
`;

export const AddStringButton = styled(ButtonMui)<Props>`
  max-width: ${(props) => props.width || '150px'};
  text-transform: none;
  border: 1px solid #2196f3;
  display: flex;
  align-items: center;
  padding: 5px 8px;
  overflow: hidden;
  pointer-events: ${(props) => (props.disabled ? 'none' : null)};
  background-color: ${(props) => (props.disabled ? '#2196f3' : props.bgcolor || '#fff')} !important;
  color: #2196f3;

  &:hover {
    max-width: 200px;
    background-color: ${(props) => props.bgcolor || '#2196f3'} !important;
    color: #fff;
  }

  & .arrow-down {
    width: 0;
    height: 0;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    border-top: 7px solid #fff;
    margin-left: 8px;
    margin-top: -1px;
  }
`;

export const SignButton = styled(ServiceButton)<Props>``;

export const StatusBlock = styled.div<Props>`
  background-color: ${(props) => (props.isArchive ? '#aeaeae' : 'rgba(129, 199, 132, 1)')};
  color: white;
  font-weight: 300;
  font-size: 12px;
  padding: 2px 10px;
`;

export const FiltersButton = styled(ButtonMui)<Props>`
  max-width: 200px;
  padding: 5px 8px;
  text-transform: none;
  color: #2196f3;
  border: 1px solid #2196f3;
  display: flex;
  overflow: hidden;
  align-items: center;
  &:hover {
    max-width: 200px;
    background-color: ${(props) => (props.disabled ? '#e3e3e3' : props.bgcolor || '#2196f3')} !important;
    color: white;
  }

  & .MuiButton-label {
    min-width: 150px;
  }

  & .arrow-down {
    width: 0;
    height: 0;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    border-top: 7px solid #fff;
    margin-left: 8px;
    margin-top: -1px;
  }
`;

export const HideButton = styled(ButtonMui)`
  background-color: #e3e3e3;
`;

export const ToolsJexcel = styled.div`
  display: flex;
  margin-top: 20px;
  align-items: center;

  & ${ServiceButton} {
    height: 36px;
  }
`;

export const AggStyle = styled.div`
  &&& {
    margin-left: 4px;

    & .ag-theme-alpine {
    }

    & .ag-root-wrapper {
      border-radius: 4px;
    }

    & .ag-header-group-text {
      white-space: normal;
    }

    & .readonly {
      background-color: #f8f8f8;
    }
  }
`;

export const WidgetButton = styled(Icon)`
  position: absolute;
  bottom: 10px;
  right: 10px;
`;

export const HeaderReport = styled.div`
  width: 100%;
  margin: 0 20px;
  min-height: 105px;
`;

export const Drawer = styled(DrawerMui)``;

export const DrawerContainer = styled.div`
  margin: 0 30px;

  & h2 {
    margin-bottom: 40px;
  }
`;

export const AboutReport = styled.div`
  & p {
    text-transform: none;
  }

  display: flex;
`;

export const PaginationSettingBox = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 20px 0;

  select {
    height: 30px;
    padding: 0 3px;
    outline: none;
    border-radius: 20%;
    background: white;
    margin-left: 15px;
    align-self: baseline;
  }
`;

export const ContextMenu = styled.div`
  width: 200px;
  box-shadow: 0px 5px 5px -3px rgb(0 0 0 / 20%), 0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%);
  background-color: white;
  padding: 5px;
`;

export const ContextMenuItem = styled.div`
  color: black;
  font-size: 15px;
  padding: 7px 10px;
  cursor: pointer;
  font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
  font-weight: 400;
  line-height: 1.5;

  &:hover {
    background-color: #e3e3e3;
  }
`;

export const StatusDropDown = styled(Select)``;

export const TableButton = styled(SasBtn)<{ active?: boolean }>`
  background: ${(props) => (props.active ? '#1c3260 !important' : '#e4e9f6 !important')};
  color: ${(props) => (props.active ? 'white !important' : '#1c3260 !important')};
  div {
    font-family: Montserrat;
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
  }
  svg {
    fill: #1c3260;
  }
`;

export const Button = styled(SasBtn)`
  div {
    font-family: Montserrat;
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
  }
`;

export const RightSide = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 8px;
`;

export const ErrorProjectWrapper = styled.div`
  gap: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
