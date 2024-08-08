import { ChatContext } from '@/ChatContext';
import { Button, cn } from 'reablocks';
import { FC, ReactNode, useRef, ChangeEvent, useContext } from 'react';
import AttachIcon from '@/assets/paperclip.svg?react';

interface FileInputProps {
  /**
   * Array of allowed file extensions.
   */
  allowedFiles: string[];

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
        onChange={onFileUpload}
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
