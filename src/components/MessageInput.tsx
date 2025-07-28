import React, { useState, useRef, type KeyboardEvent } from 'react';
import { fileUploadService, type FileUploadResult } from '../services/fileUpload';

interface MessageInputProps {
  onSendMessage: (message: string, file?: FileUploadResult) => void;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFile, setUploadedFile] = useState<FileUploadResult | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setUploadError(null);
    setIsUploading(true);

    try {
      const result = await fileUploadService.uploadFile(file);
      setUploadedFile(result);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Failed to upload file');
      setSelectedFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadedFile(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled && !isUploading) {
      onSendMessage(message.trim(), uploadedFile || undefined);
      setMessage('');
      handleRemoveFile();
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="message-input-container">
      {/* File attachment display */}
      {(selectedFile || uploadError) && (
        <div className="file-attachment-info">
          {isUploading && (
            <div className="file-upload-status">
              <span>Uploading {selectedFile?.name}...</span>
            </div>
          )}
          {uploadedFile && !isUploading && (
            <div className="file-attached">
              <span className="file-name">📎 {uploadedFile.fileName}</span>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="remove-file-button"
                disabled={disabled}
              >
                ✕
              </button>
            </div>
          )}
          {uploadError && (
            <div className="file-upload-error">
              <span>{uploadError}</span>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="remove-file-button"
                disabled={disabled}
              >
                ✕
              </button>
            </div>
          )}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="message-input-form">
        <div className="message-input-wrapper">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            disabled={disabled || isUploading}
            style={{ display: 'none' }}
            accept="*/*"
          />
          <textarea
            id="message-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask your Worker about fire protection solutions..."
            disabled={disabled}
            rows={1}
            className="message-input"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isUploading}
            className="attachment-button"
            title="Attach file"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.64 16.2a2 2 0 0 1-2.83-2.83l8.49-8.49" />
            </svg>
          </button>
          <button
            type="submit"
            disabled={!message.trim() || disabled || isUploading}
            className="send-button"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;