import { IconButton } from '@material-ui/core';
import ButtonMui from '@material-ui/core/Button';
import DrawerMui from '@material-ui/core/Drawer';
import TabMui from '@material-ui/core/Tab';
import TabsMui from '@material-ui/core/Tabs';
import styled from 'styled-components';

export const TableContentBox = styled.div`
  padding-top: 1rem;
  display: flex;
  width: 100%;
  height: auto;
  flex-direction: column;
  min-height: 80px;
`;
export const Tab = styled(TabMui)`
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

// export const Select = styled(SelectMui)`
//   margin-left: 10px;
//   margin-top: 3px;
//   min-height: 36px;
//   font-size: 16px!important;
//   color: ${props => props.bgcolor || '#fff'};
//   border: ${props => `1px solid ${props.bgcolor}` || 'none'};
//   padding-left: ${props => props.contained ? '10px': 0};
//   border-radius: ${props => props.contained ? '4px': 0};
//
//   &.MuiInput-underline:after {
//     border-bottom: ${props => props.contained ? 0 : '2px solid #4056F4'};
//   }
//
//   & .MuiSelect-icon {
//     color: ${props => props.bgcolor || '#fff'};
//     margin-top: -1px;
//   }
//   &.MuiInput-underline:before {
//       border-bottom: none;
//       }
//   :hover {
//       &.MuiInput-underline:before {
//       border-bottom: none;
//     }
//   }
//   & .MuiSelect-select:focus {
//     background-color: rgba(0, 0, 0, 0);
//   }
// `

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
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 30px;
`;
export const LegendText = styled.div`
  margin-left: 20px;

  & span {
    font-weight: 600;
  }
`;

export const ButtonTableBox = styled.div`
  display: flex;
  align-items: center;
`;

export const ServiceButton = styled(ButtonMui)`
  max-width: ${(props) => props.width || '150px'};
  text-transform: none;
  background-color: ${(props) => props.bgcolor || '#2196f3'} !important;
  color: #fff !important;
  margin-right: 10px;

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

export const FiltersButton = styled(ButtonMui)`
  max-width: ${(props) => props.width || '150px'};
  text-transform: none;
  background-color: ${(props) => props.bgcolor || '#2196f3'} !important;
  color: #fff !important;
  margin-right: 10px;

  &:hover {
    background-color: ${(props) => props.bgcolor || '#2196f3'} !important;
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

export const WidgetButton = styled(IconButton)`
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
