import { Close } from '@material-ui/icons';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { FileWithPath, useDropzone } from 'react-dropzone';
import {
  AddIconUi,
  DeleteBtnUi,
  ImgContainerUi,
  ImgUi,
  UploadDnDContainerUi,
  UploadImageUi,
} from './styled';

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

type DropzoneProps = {
  onUpload: (file: RequestFileType) => void;
  onRemove: () => void;
  value: ResponseFileType;
};

export const UploadImage: FC<DropzoneProps> = ({
  onUpload,
  value,
  onRemove,
}) => {
  const [img, setImg] = useState<ResponseFileType | null>(null);
  useEffect(() => {
    setImg(value);
  }, [value]);
  // TODO: запилить в хук, сделать асинхронным
  const onDrop = (acceptedFiles: FileWithPath[]) => {
    const reader = new FileReader();
    const file = acceptedFiles[0];
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const binaryStr = reader.result?.toString();
      if (onUpload && binaryStr) {
        onUpload({ data: binaryStr, name: file.name, size: file.size });
      }
    };
  };
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: 'image/*',
    onDrop,
  });
  const handleRemoveBtn = useCallback(() => {
    onRemove && onRemove();
  }, [img, onRemove]);
  return (
    <UploadImageUi>
      <UploadDnDContainerUi {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <ImgContainerUi>
          {img?.link ? <ImgUi src={img.link} alt={img.name} /> : <AddIconUi />}
        </ImgContainerUi>
      </UploadDnDContainerUi>
      {img?.link && (
        <DeleteBtnUi onClick={handleRemoveBtn}>
          <Close />
        </DeleteBtnUi>
      )}
    </UploadImageUi>
  );
};
