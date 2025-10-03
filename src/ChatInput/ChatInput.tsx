import {
  useState,
  KeyboardEvent,
  ReactElement,
  useRef,
  ChangeEvent,
  useContext,
  forwardRef,
  useImperativeHandle,
  useEffect,
  MutableRefObject
} from 'react';
import { Button, Textarea, cn, TextAreaRef } from 'reablocks';
import SendIcon from '@/assets/send.svg?react';
import StopIcon from '@/assets/stop.svg?react';
import { ChatContext } from '@/ChatContext';
import { FileInput } from './FileInput';

interface ChatInputProps {
  /**
   * Reference to the input element.
   */
  inputRef?: MutableRefObject<HTMLTextAreaElement>;

  /**
   * Default value for the input field.
   */
  defaultValue?: string;

  /**
   * Allowed file types for upload.
   */
  allowedFiles?: string[];

  /**
   * Placeholder text for the input field.
   */
  placeholder?: string;

  /**
   * Icon to show for send.
   */
  sendIcon?: ReactElement;

  /**
   * Icon to show for stop.
   */
  stopIcon?: ReactElement;

  /**
   * Icon to show for attach.
   */
  attachIcon?: ReactElement;
}

export interface ChatInputRef {
  /**
   * Focus the input.
   */
  focus: () => void;
}

export const ChatInput = forwardRef<ChatInputRef, ChatInputProps>(
  (
    {
      inputRef,
      allowedFiles,
      placeholder,
      defaultValue,
      sendIcon = <SendIcon />,
      stopIcon = <StopIcon />,
      attachIcon
    },
    ref
  ) => {
    const {
      theme,
      isLoading,
      disabled,
      sendMessage,
      stopMessage,
      fileUpload,
      activeSessionId
    } = useContext(ChatContext);
    const [message, setMessage] = useState<string>('');
    const _inputRef = useRef<TextAreaRef | null>(null);

    useEffect(() => {
      if (_inputRef?.current) {
        _inputRef?.current?.focus();
      }
    }, [activeSessionId, _inputRef]);

    /**
     * Sync the input reference with the internal input reference.
     */
    useEffect(() => {
      if (inputRef && _inputRef?.current?.inputRef?.current) {
        inputRef.current = _inputRef?.current?.inputRef?.current;
      }
    }, [_inputRef, inputRef]);

    useImperativeHandle(ref, () => ({
      focus: () => {
        _inputRef.current?.focus();
      }
    }));

    const handleSendMessage = () => {
      if (message.trim()) {
        sendMessage?.(message);
        setMessage('');
      }
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    };

    const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && fileUpload) {
        fileUpload(file);
      }
    };

    return (
      <div className={cn(theme.input.base)}>
        <Textarea
          ref={_inputRef}
          containerClassName={cn(theme.input.input)}
          minRows={1}
          autoFocus
          value={message}
          defaultValue={defaultValue}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={isLoading || disabled}
          onChange={e => setMessage(e.target.value)}
        />
        <div className={cn(theme.input.actions.base)}>
          {allowedFiles?.length > 0 && (
            <FileInput
              allowedFiles={allowedFiles}
              onFileUpload={handleFileUpload}
              isLoading={isLoading}
              disabled={disabled}
              attachIcon={attachIcon}
            />
          )}
          {isLoading && (
            <Button
              title="Stop"
              className={cn(theme.input.actions.stop)}
              onClick={stopMessage}
              disabled={disabled}
            >
              {stopIcon}
            </Button>
          )}
          <Button
            title="Send"
            className={cn(theme.input.actions.send)}
            onClick={handleSendMessage}
            disabled={isLoading || disabled}
          >
            {sendIcon}
          </Button>
        </div>
      </div>
    );
  }
);
