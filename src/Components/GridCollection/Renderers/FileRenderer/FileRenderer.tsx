import React, { FC, MouseEvent } from 'react';
import { FileEditorData } from '../../Editors/FileEditor/types';
import { LinkUI } from '../../Editors/FileEditor/styled';
import { FileRendererUI } from './styled';

type FileRendererProps = {
  value: FileEditorData;
  onChange?: (data: FileEditorData) => void;
  readOnly?: boolean;
};

export const FileRenderer: FC<FileRendererProps> = ({ value = {}, onChange, readOnly }) => {
  const { name, id } = value;
  const onLinkClickHandler = async (event: MouseEvent) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`/api/file/projectfile/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      const { payload } = data;
      onChange && onChange(payload);
      const { link } = payload;
      window.open(link, '_blank');
    } catch (e) {}
  };

  return (
    <FileRendererUI readOnly={readOnly}>
      {name ? <LinkUI onClick={onLinkClickHandler}>{name}</LinkUI> : ''}
    </FileRendererUI>
  );
};
