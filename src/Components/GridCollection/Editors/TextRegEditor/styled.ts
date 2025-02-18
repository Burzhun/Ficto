import styled from 'styled-components';

export const TextRegEditorUi = styled.input`
  appearance: none;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 0 6px 0 6px;
  border: 2px solid #ccc;
  vertical-align: top;
  color: var(--color);
  background-color: var(--background-color);
  font-family: inherit;
  font-size: var(--font-size);
  &:focus {
    border-color: var(--selection-color);
    outline: none;
  }
  &::placeholder {
    color: #999;
    opacity: 1;
  }
`;

export const TextAreaEditorUi = styled.textarea`
  appearance: none;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 0 6px 0 6px;
  border: 2px solid #ccc;
  vertical-align: top;
  color: var(--color);
  background-color: var(--background-color);
  font-family: inherit;
  font-size: var(--font-size);
  &:focus {
    border-color: var(--selection-color);
    outline: none;
  }
  &::placeholder {
    color: #999;
    opacity: 1;
  }
`;
