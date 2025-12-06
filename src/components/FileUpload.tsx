import React, { useState, useCallback, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Upload, X, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { uploadDocument, validateFile, formatFileSize } from '../utils/api';
import { FileValidationResult } from '../types';
import './FileUpload.css';

interface FileUploadProps {
  onClose: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onClose }) => {
  const { addDocument, addNotification } = useApp();
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validation, setValidation] = useState<FileValidationResult | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, []);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    const validationResult = validateFile(file);
    setValidation(validationResult);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !validation?.isValid) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const document = await uploadDocument(selectedFile, (progress) => {
        setUploadProgress(progress);
      });

      addDocument(document);

      addNotification({
        type: 'success',
        message: `"${selectedFile.name}" uploaded successfully`,
        autoClose: true,
        duration: 3000,
      });

      onClose();
    } catch (error) {
      addNotification({
        type: 'error',
        message: `Failed to upload "${selectedFile.name}". Please try again.`,
        autoClose: false,
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setValidation(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="file-upload-overlay">
      <div className="file-upload-modal">
        <div className="file-upload-header">
          <h3>Upload Document</h3>
          <button className="btn btn-secondary" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="file-upload-body">
          {!selectedFile ? (
            <div
              className={`drop-zone ${isDragOver ? 'drag-over' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="drop-zone-content">
                <Upload size={48} />
                <h4>Drop your document here</h4>
                <p>or click to browse files</p>
                <p className="file-types">Supports PDF, DOC, DOCX, TXT (max 10MB)</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileInputChange}
                style={{ display: 'none' }}
              />
            </div>
          ) : (
            <div className="file-preview">
              <div className="file-info">
                <FileText size={32} />
                <div className="file-details">
                  <h4>{selectedFile.name}</h4>
                  <p>{formatFileSize(selectedFile.size)}</p>
                </div>
                <button className="btn btn-secondary" onClick={clearSelection}>
                  <X size={16} />
                </button>
              </div>

              {validation && !validation.isValid && (
                <div className="validation-error">
                  <AlertCircle size={16} />
                  <span>{validation.error}</span>
                </div>
              )}

              {validation?.warnings && validation.warnings.length > 0 && (
                <div className="validation-warnings">
                  {validation.warnings.map((warning, index) => (
                    <div key={index} className="warning">
                      <AlertCircle size={14} />
                      <span>{warning}</span>
                    </div>
                  ))}
                </div>
              )}

              {isUploading && (
                <div className="upload-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <span className="progress-text">{uploadProgress}%</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="file-upload-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleUpload}
            disabled={!selectedFile || !validation?.isValid || isUploading}
          >
            {isUploading ? (
              <>
                <div className="loading" />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={16} />
                Upload Document
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
