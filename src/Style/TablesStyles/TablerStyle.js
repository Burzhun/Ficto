import { Paper } from '@material-ui/core';
import AccordionMui from '@material-ui/core/Accordion';
import MuiButton from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import IconButtonMui from '@material-ui/core/IconButton';
import SelectMui from '@material-ui/core/Select';
import TableBodyMui from '@material-ui/core/TableBody';
import TableContainerMui from '@material-ui/core/TableContainer';
import TextFieldMui from '@material-ui/core/TextField';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const HeaderLink = styled(Link)`
  font-size: 16px;
  margin-right: 2rem;
  color: #fff;
  font-weight: 400;
  transition: all 0.3s;

  :hover {
    color: #ffd453;
    text-decoration: none;
  }
`;

export const ContentBox = styled(Paper)`
  padding: 30px;
  margin: 10px;
  min-height: 40vh;
`;

export const LoaderBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const TextField = styled(TextFieldMui)`
  width: 300px;
  margin-bottom: 15px;
  :hover {
    & .MuiInput-underline:before {
      border-bottom: 1px solid #ffd453;
    }
  }
`;

export const FieldsBox = styled.div`
  margin-bottom: 30px;
`;

export const Button = styled(MuiButton)``;

export const FlexCol = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 300px;
`;
export const SliderBox = styled.div`
  width: 90%;
  margin-left: 45px;
  margin-bottom: 30px;
`;

export const Select = styled(SelectMui)`
  font-weight: 600;
  color: rgba(0, 0, 0, 0.75);
  :hover {
    &.MuiInput-underline:before {
      border-bottom: 1px solid #ffd453;
    }
  }
  & .MuiSelect-select:focus {
    background-color: rgba(0, 0, 0, 0);
  }
`;

export const FlexBoxBetween = styled.div`
  display: flex;
  justify-content: space-between;
  margin-right: 50px;
`;

export const Centred = styled.div`
  margin: auto 0;
`;

export const AvatarName = styled(Chip)`
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
  border: 1px solid rgba(0, 0, 0, 0.05);

  :hover {
    background-color: #ebf6fa;
    border: 1px solid #ebf6fa;
    box-shadow: -5px 3px 15px -12px rgba(0, 0, 0, 0.75);
  }
`;

export const AccordionBox = styled.div`
  & .Mui-expanded {
    margin: 0;
  }

  & .MuiAccordionSummary-root {
    min-height: 0;
    margin-bottom: 20px;
  }
`;

export const SliderClickBox = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  cursor: pointer;
`;
export const ReportAccordionBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const Accordion = styled(AccordionMui)`
  box-shadow: none;
`;

export const AccordionPaper = styled(Paper)`
  height: 100px;
  width: 100px;
  border-radius: 14px;
  background-color: ${(props) => props.color};
  cursor: pointer;
`;

export const SliderTitle = styled.div`
  display: flex;
  color: #2196f3;
  align-items: center;
  & p {
    margin: 0 10px 0 0;
  }
`;

export const WorkInfoTableBox = styled.div``;

export const TableContainer = styled(TableContainerMui)`
  border: 1px solid #eee;
  border-radius: 9px;

  & .MuiTableCell-head {
    background-color: rgba(0, 0, 0, 0.05);
  }

  & .MuiTableCell-root {
    border-bottom: none;
  }
`;

export const TableCellBox = styled.div`
  display: flex;
  align-items: center;
  height: 30px;
  white-space: nowrap;
  color: rgba(0, 0, 0, 0.7);
  & p {
    margin-left: 10px;
  }
`;

export const TableBody = styled(TableBodyMui)`
  & .MuiTableCell-sizeSmall {
    padding-left: 20px;
  }

  & ${TableCellBox} {
    justify-content: flex-end;
  }
`;

export const IconButton = styled(IconButtonMui)`
  cursor: pointer;
  margin-right: 5px;
  padding: 3px;
`;
