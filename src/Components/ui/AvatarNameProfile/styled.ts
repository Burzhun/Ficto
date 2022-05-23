import styled from 'styled-components'
import Chip from '@material-ui/core/Chip';

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