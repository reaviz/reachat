import { cn } from 'reablocks';
import type { FC, ReactNode } from 'react';
import { useCallback, useContext } from 'react';
import { useDropzone } from 'react-dropzone';

import UploadIcon from '@/assets/upload.svg?react';
import { ChatContext } from '@/ChatContext';

interface FileDropzoneProps {
  /**
   * Array of allowed file extensions (e.g., ['.pdf', '.docx', '.png']).
   */
  allowedFiles?: string[];

  /**
   * Allow multiple file uploads.
   */
  multiple?: boolean;

  /**
   * Disables the dropzone when true.
   */
  disabled?: boolean;

  /**
   * Icon to show for the dropzone overlay.
   */
  dropIcon?: ReactNode;

  /**
   * Text to show on the dropzone overlay.
   */
  dropText?: string;

  /**
   * Children to render inside the dropzone.
   */
  children: ReactNode;

  /**
   * Callback function triggered when files are dropped.
   */
  onFileDrop?: (file: File) => void;
}

export const FileDropzone: FC<FileDropzoneProps> = ({
  allowedFiles,
  multiple = false,
  disabled,
  dropIcon = <UploadIcon />,
  dropText = 'Drop files here to upload',
  children,
  onFileDrop
}) => {
  const { theme } = useContext(ChatContext);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (onFileDrop && acceptedFiles.length > 0) {
        if (multiple) {
          acceptedFiles.forEach(file => onFileDrop(file));
        } else {
          onFileDrop(acceptedFiles[0]);
        }
      }
    },
    [onFileDrop, multiple]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    noClick: true,
    noKeyboard: true,
    disabled: disabled || !allowedFiles?.length
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        theme.input.dropzone.base,
        isDragActive && theme.input.dropzone.active
      )}
    >
      <input {...getInputProps()} />
      {isDragActive && (
        <div className={cn(theme.input.dropzone.overlay)}>
          {dropIcon && (
            <span className={cn(theme.input.dropzone.icon)}>{dropIcon}</span>
          )}
          <span className={cn(theme.input.dropzone.text)}>{dropText}</span>
        </div>
      )}
      {children}
    </div>
  );
};
