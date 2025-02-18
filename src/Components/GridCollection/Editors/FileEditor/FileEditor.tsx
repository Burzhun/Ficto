import React, { ChangeEvent, FC, useRef, MouseEvent, useMemo } from 'react';
import { ButtonUI, CloseButtonUI, ContentUI, FileEditorUI, LinkUI } from './styled';
import { FileEditorData } from './types';
import { CloseOutlined } from '@ant-design/icons';

type FileEditorProps = {
  onChange: (data: FileEditorData) => void;
  value?: FileEditorData;
  maxSize?: number;
  formats?: string[];
  onMessage?: (message: string) => void;
};

const oneKilobyte = 1024;
const defaultMaxSize = 10485760; // 10Мб

export const FileEditor: FC<FileEditorProps> = ({
  onChange,
  value = {},
  maxSize = defaultMaxSize,
  onMessage,
  formats,
}) => {
  const { name, id } = value;
  const inputRef = useRef<HTMLInputElement>(null);
  const onClickHandler = () => {
    return inputRef.current && inputRef.current.click();
  };

  const onChangeFileHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const element = event.target;

    if (element.files) {
      const fileReader = new FileReader();
      const file = element.files[0];
      const { name, type, size } = file;

      if (size < maxSize) {
        fileReader.onload = async () => {
          const token = localStorage.getItem('userToken');
          const requestData = { name, size, type, data: fileReader.result };
          try {
            const response = await fetch('/api/file/projectfile', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(requestData),
            });
            const data = await response.json();
            const { payload } = data;
            onChange(payload);
          } catch (e) {
            onMessage && onMessage(`Произошла ошибка с загрузкой файла!`);
          }
        };

        fileReader.readAsDataURL(file);
      } else {
        onMessage &&
          onMessage(`Превышен максимальный размер файла! (${(maxSize / oneKilobyte / oneKilobyte).toFixed(0)} Мб)`);
      }
    }
  };

  const onClearHandler = () => {
    onChange({});
  };

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
      onChange(payload);
      const { link } = payload;
      window.open(link, '_blank');
    } catch (e) {}
  };

  const acceptFiles = useMemo(() => {
    return formats ? formats.join(', ') : '';
  }, [formats]);

  return (
    <>
      <FileEditorUI>
        <ContentUI>{name ? <LinkUI onClick={onLinkClickHandler}>{name}</LinkUI> : 'Имя файла...'}</ContentUI>
        {name && (
          <CloseButtonUI onClick={onClearHandler}>
            <CloseOutlined />
          </CloseButtonUI>
        )}
        <ButtonUI onClick={onClickHandler}>Загрузить</ButtonUI>
      </FileEditorUI>
      <input
        type="file"
        style={{ display: 'none' }}
        accept={acceptFiles}
        ref={inputRef}
        onChange={onChangeFileHandler}
      />
    </>
  );
};
