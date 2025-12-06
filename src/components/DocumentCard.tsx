import React, { useState } from 'react';
import { CheckCircle, AlertCircle, Eye, Trash2 } from 'lucide-react';
import { DocumentCardProps } from '../types';
import { formatFileSize, getFileIcon } from '../utils/api';
import DocumentContentModal from './DocumentContentModal';
import './DocumentCard.css';

const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  isSelected,
  onSelect,
  onDelete,
}) => {
  const [showContentModal, setShowContentModal] = useState(false);

  const getStatusIcon = () => {
    switch (document.status) {
      case 'ready':
        return <CheckCircle size={14} className="status-icon ready" />;
      case 'error':
        return <AlertCircle size={14} className="status-icon error" />;
      case 'uploading':
      case 'processing':
        return <div className="status-icon loading" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (document.status) {
      case 'uploading':
        return `Uploading${document.uploadProgress ? ` (${document.uploadProgress}%)` : ''}`;
      case 'processing':
        return 'Processing';
      case 'ready':
        return 'Ready';
      case 'error':
        return 'Error';
      default:
        return '';
    }
  };

  return (
    <div
      className={`document-card ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
    >
      <div className="document-icon">
        <span className="file-icon">{getFileIcon(document.type)}</span>
      </div>
      <div className="document-info">
        <div className="document-name" title={document.name}>
          {document.name}
        </div>
        <div className="document-meta">
          <span className="document-size">{formatFileSize(document.size)}</span>
          <span className="document-date">
            {document.uploadDate.toLocaleDateString()}
          </span>
        </div>
        <div className="document-status">
          {getStatusIcon()}
          <span className="status-text">{getStatusText()}</span>
        </div>
      </div>


      <DocumentContentModal
        document={document}
        isOpen={showContentModal}
        onClose={() => setShowContentModal(false)}
      />
    </div>
  );
};

export default DocumentCard;
