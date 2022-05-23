import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import styled from 'styled-components';

export const SeveralElem = styled.div`
  width: 100%;
  display: flex;
  gap: 33px;
  padding-bottom: 15px;
`;
export const Load = styled.div`
  height: 100%;
  margin: 0 0 15px 0;
`;

export const Btn = styled(Button)`
  width: 280px;
  height: 50px;
  color: white;
  background: #28b101;
  background: -webkit-linear-gradient(top right, #28b101, #57b36f);
  background: -moz-linear-gradient(top right, #28b101, #57b36f);
  background: linear-gradient(to bottom left, #28b101, #57b36f);
  border-radius: 10px;
`;
export const BlockTitle = styled.title`
  margin: 0 0 20px 30px;

  font-size: 16px;
  line-height: 19px;
  display: flex;
  align-items: center;
  text-align: center;
`;
export const BtnContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  width: 100%;
  margin-top: 10px;
`;
export const Block = styled.div`
  display: flex;
  flex-direction: column;
  padding: 30px 45px;
  background-color: #fff;
`;
export const FullTable = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  margin-bottom: 5px;
  margin-top: 15px;
  width: 100%;
  position: relative;
`;
export const useStyles = makeStyles({
  table: {
    width: '100%',
    border: '1px solid #babfc757',
    borderRadius: '5px',
  },
  head: {
    backgroundColor: '#babfc72b',
  },
  title: {
    backgroundColor: '#b7babe57',
    textTransform: 'uppercase',
    fontSize: 15,
  },
  button: {
    position: 'relative',
    height: '100%',
  },
  formControl: {
    width: '100%',
    marginBottom: '30px',
  },
  select: {
    width: '100%',
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
});

export const HeaderContainer = styled.div`
  display: flex;
  margin-right: 60px;
`;
export const HeaderContainerLeftSide = styled.div`
  flex: 1;
`;
export const HeaderContainerRightSide = styled.div`
  display: flex;
`;
