import { CloseOutlined, UploadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { ChangeEvent, FC, useRef } from 'react';
import { api, endpoints } from '../../../api';
import { FileInputUI, FileNameUI } from './styled';

export type FileNode = {
  name: string;
  id: string;
  link: string;
};

export type RequestFileType = {
  data: string;
  name: string;
  size: number;
};

export type ResponseFileType = {
  name: string;
  id: string;
  size: number;
  link: string;
};

export type FileEditorData = {
  data?: string | ArrayBuffer | null;
  fileName?: string;
};

type FileEditorProps = {
  onChange: (data: FileEditorData | undefined) => void;
  value?: FileNode;
  label?: string;
  formats?: string[];
};

export const FileInput: FC<FileEditorProps> = ({ label, value, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const onChangeFileHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const element = event.target;

    if (element.files && element.files.length !== 0) {
      const fileReader = new FileReader();
      const file = element.files[0];
      const { name, size } = file;
      fileReader.onload = () => {
        const binaryStr = fileReader.result?.toString();
        if (binaryStr) {
          handleUpload({ data: binaryStr, name, size });
        }
      };

      fileReader.readAsDataURL(file);
    }
  };

  const handleUpload = async (value: RequestFileType) => {
    if (value) {
      try {
        const {
          data: { payload },
        } = await api.post(endpoints.organizationFile(), value);
        onChange(payload);
        //setFieldValue(`head.photo.id`, id);
      } catch (e) {}
    } else {
      // setFieldValue(`head.photo.content`, '');
    }
  };

  return (
    <div style={{ marginBottom: 15 }}>
      {label && <div style={{ marginBottom: 6 }}>{label}</div>}
      <FileInputUI>
        <input
          type="file"
          ref={inputRef}
          onChange={onChangeFileHandler}
          style={{ display: 'none' }}
        />
        <FileNameUI style={{ marginRight: '0px' }}>
          {value?.name ? (
            <div
              style={{
                display: 'flex',
                gap: 10,
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <a href={value.link}>{value.name}</a>
              <CloseOutlined
                style={{ cursor: 'pointer' }}
                onClick={() => onChange(undefined)}
              />
            </div>
          ) : (
            <div style={{ color: '#b3b3b3' }}>Загрузите файл...</div>
          )}
        </FileNameUI>
        <Button
          icon={<UploadOutlined />}
          onClick={() => {
            inputRef.current?.click();
          }}
        >
          Загрузить
        </Button>
      </FileInputUI>
    </div>
  );
};
