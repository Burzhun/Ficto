import { useCallback, FC } from 'react';
import { useDropzone } from 'react-dropzone';
import ClearIcon from '@material-ui/icons/Clear';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import {
  DropzoneWrap,
  DropzoneControls,
  DropzoneButton,
  File,
  FileName,
  Info,
  PlusImage
} from './style';
import bluePlus from 'img/bluePlus.png';
interface Props {
  fileUploadHandler: (
    file: string | null,
    binaryFile: string | ArrayBuffer | null,
    placeInState: string
  ) => void;
  placeInState: string;
  fileName: string;
}

export const Dropzone: FC<Props> = ({
  fileUploadHandler,
  placeInState,
  fileName,
}) => {
  const onDrop = useCallback((acceptedFiles) => {
    const reader = new FileReader();

    reader.readAsDataURL(acceptedFiles[0]);
    reader.onload = () => {
      const binaryStr = reader.result;
      fileUploadHandler(acceptedFiles[0], binaryStr, placeInState);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { getRootProps, getInputProps, open } = useDropzone({
    noClick: true,
    noKeyboard: true,
    multiple: false,
    maxFiles: 1,
    onDrop,
  });

  return (
    <DropzoneWrap {...getRootProps({ className: 'dropzone' })}>
      <DropzoneControls>
        <input {...getInputProps()} />
        <DropzoneButton type="button" onClick={open}>
          {/* <PlusImage src={bluePlus} alt="bluePlus" />  */}
          {/* Загрузить */}
          +
        </DropzoneButton>
        <Info>Или перетащите файл сюда...</Info>
      </DropzoneControls>
      {fileName && (
        <File>
          <AttachFileIcon />
          <FileName>{fileName}</FileName>
          <ClearIcon
            style={{ cursor: 'pointer' }}
            onClick={() => {
              fileUploadHandler(null, null, placeInState);
            }}
          />
        </File>
      )}
    </DropzoneWrap>
  );
};
