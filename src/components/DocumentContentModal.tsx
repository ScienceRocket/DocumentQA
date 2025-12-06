import React from 'react';
import { X, FileText } from 'lucide-react';
import { Document } from '../types';
import './DocumentContentModal.css';

interface DocumentContentModalProps {
  document: Document;
  isOpen: boolean;
  onClose: () => void;
}

const DocumentContentModal: React.FC<DocumentContentModalProps> = ({
  document,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="document-content-modal-overlay" onClick={handleBackdropClick}>
      <div className="document-content-modal">
        <div className="modal-header">
          <div className="modal-title">
            <FileText size={20} />
            <h3>{document.name}</h3>
          </div>
          <button
            className="modal-close"
            onClick={onClose}
            title="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="content-info">
            <div className="content-meta">
              <span className="content-size">{document.size ? `${(document.size / 1024).toFixed(1)} KB` : 'Size unknown'}</span>
              <span className="content-type">{document.type || 'Unknown type'}</span>
              <span className="content-date">{document.uploadDate.toLocaleDateString()}</span>
            </div>
          </div>

          <div className="content-text">
            {document.content ? (
              <pre className="text-content">
                {document.content}
              </pre>
            ) : (
              <div className="no-content">
                <p>No text content available for this document.</p>
                <p>This may occur if the document format is not supported or if text extraction failed.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentContentModal;
