import styled from 'styled-components'
import AssessmentIcon from '@material-ui/icons/Assessment';

export const AnalyticsCardItemUi = styled.div`
  //background-color: #777777;
  min-height: 80px;
  width: calc(100% - 175px);
  margin-bottom: 20px;
  margin-left: 70px;
  display: flex;
  align-items: center;
  padding-left: 40px;
  box-shadow: -4px 2px 5px -2px rgba(33, 150, 243, 0.18);
  //border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, .2);
  border-radius: 4px;
  
  
  
  & > div {
    margin-right: 30px;
    
    & > h6 {
      color: #000;
    }
  }
`

export const Icon = styled(AssessmentIcon) `
  font-size: 50px!important;
  color: #2196f3;
`