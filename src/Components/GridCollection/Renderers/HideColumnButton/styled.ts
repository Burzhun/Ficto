import styled from 'styled-components';

export const ColumnsPopup = styled.div`
  width: 500px;
  font-family: Montserrat;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  text-align: left;
  max-height: 500px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0;
`;

export const Wrapper = styled.div`
  .ant-popover {
    padding-top: 0px !important;
    &-inner {
      padding: 0;
      border: 1px;
      border-radius: 16px;
      &-content {
        padding: 24px;
      }
    }
    &-arrow {
      display: none;
    }
  }
`;
