import { FC } from 'react';
import { FileEditorData, FileInput, FileNode } from './FileInput';

type FileEditorProps = {
  onChange: (data: FileEditorData | undefined) => void;
  label?: string;
  value?: FileNode;
};
type changeVoid = (data: FileNode | undefined) => void;
export const FileComponent: FC<FileEditorProps> = ({
  onChange,
  label,
  value,
}) => {
  return <FileInput value={value} onChange={onChange} label={label} />;
};
