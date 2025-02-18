import styled from 'styled-components';
import { CloseOutlined } from '@ant-design/icons';
import Select from 'react-select';

export const SelectEditorContainer = styled.div`
  position: relative;
`;

export const ClearButtonUI = styled(CloseOutlined)`
  font-size: 14px !important;
  cursor: pointer;
  color: hsl(0, 0%, 40%);
  transition: all 0.3s;

  &:hover {
    color: hsl(0, 0%, 60%);
  }
`;

export const IndicatorContainerUI = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
`;

export const MultiSelectUI = styled(Select)`
  .react-select__value-container {
    flex-wrap: nowrap;
  }

  .react-select__multi-value {
    min-width: 50px;
    margin-bottom: 6px;
  }
`;
