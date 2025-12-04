import { Button, cn } from 'reablocks';
import type { ChangeEvent, FC, ReactNode } from 'react';
import { useContext, useRef } from 'react';

import AttachIcon from '@/assets/paperclip.svg?react';
import { ChatContext } from '@/ChatContext';

interface FileInputProps {
  /**
   * Array of allowed file extensions.
   */
  allowedFiles: string[];

  /**
   * Allow multiple file uploads.
   */
  multiple: boolean;

  /**
   * Indicates whether a file upload is in progress.
   */
  isLoading: boolean;

  /**
   * Disables the file input when true.
   */
  disabled: boolean;

  /**
   * Custom icon for the attach button.
   */
  attachIcon: ReactNode;

  /**
   * Callback function triggered when a file is selected.
   */
  onFileUpload: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const FileInput: FC<FileInputProps> = ({
  allowedFiles,
  multiple,
  onFileUpload,
  isLoading,
  disabled,
  attachIcon = <AttachIcon />
}) => {
  const { theme } = useContext(ChatContext);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept={allowedFiles.join(',')}
        multiple={multiple}
        onChange={e => {
          onFileUpload(e);
          // Cleanup field value after fire callback
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }}
      />
      <Button
        title="Upload"
        variant="text"
        disabled={isLoading || disabled}
        className={cn(theme.input.upload)}
        onClick={() => fileInputRef.current?.click()}
      >
        {attachIcon}
      </Button>
    </>
  );
};
