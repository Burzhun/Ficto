import styled from 'styled-components';

export const FileEditorUI = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

export const ContentUI = styled.div`
  padding-left: 10px;
  font-size: 0.85em;
  font-weight: bold;
  margin-right: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
`;

export const LinkUI = styled.a`
  white-space: nowrap;
  overflow: hidden;
  cursor: pointer;
  text-overflow: ellipsis;
  color: #0f04ed;
  text-decoration: underline;
`;

export const CloseButtonUI = styled.div`
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  margin-right: 5px;
`;

export const ButtonUI = styled.button`
  border: 2px solid #66afe9;
  background: #66afe9;
  color: #fff;
  border-left: none;
  cursor: pointer;
  width: 80px;
`;
