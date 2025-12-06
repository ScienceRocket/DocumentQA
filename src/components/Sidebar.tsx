import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Upload, Search, FileText, Moon, Sun, Trash2 } from 'lucide-react';
import DocumentCard from './DocumentCard';
import FileUpload from './FileUpload';
import SearchInput from './SearchInput';
import { formatFileSize } from '../utils/api';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const {
    state,
    selectDocument,
    deleteDocument,
    addNotification,
    toggleTheme
  } = useApp();

  const [showUpload, setShowUpload] = useState(false);

  const handleDocumentSelect = (documentId: string) => {
    selectDocument(documentId);
  };

  const handleDocumentDelete = async (documentId: string) => {
    try {
      await deleteDocument(documentId);
      addNotification({
        type: 'success',
        message: 'Document deleted successfully',
        autoClose: true,
        duration: 3000,
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Failed to delete document',
        autoClose: true,
        duration: 5000,
      });
    }
  };

  const totalDocuments = state.documents.length;
  const totalSize = state.documents.reduce((sum, doc) => sum + doc.size, 0);

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">
          <FileText size={24} />
          <h1>Document QA</h1>
        </div>

        <div className="sidebar-actions">
          <button
            className="btn btn-secondary"
            onClick={toggleTheme}
            title={`Switch to ${state.theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {state.theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>
        </div>
      </div>

      <div className="sidebar-search">
        <SearchInput
          value={state.searchQuery}
          onChange={(value) => {/* Handled by SearchInput component */}}
          placeholder="Search Q&A history..."
        />
      </div>

      <div className="sidebar-upload">
        <button
          className="btn btn-primary w-full"
          onClick={() => setShowUpload(true)}
        >
          <Upload size={16} />
          Upload Document
        </button>

        {showUpload && (
          <FileUpload
            onClose={() => setShowUpload(false)}
          />
        )}
      </div>

      <div className="sidebar-stats">
        <div className="stat">
          <span className="stat-label">Documents</span>
          <span className="stat-value">{totalDocuments}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Total Size</span>
          <span className="stat-value">{formatFileSize(totalSize)}</span>
        </div>
      </div>

      <div className="sidebar-documents">
        <h3>Documents</h3>
        <div className="documents-list">
          {state.documents.length === 0 ? (
            <div className="empty-state">
              <FileText size={48} />
              <p>No documents uploaded yet</p>
              <p>Upload a document to get started</p>
            </div>
          ) : (
            state.documents.map((document) => (
              <DocumentCard
                key={document.id}
                document={document}
                isSelected={state.currentDocumentId === document.id}
                onSelect={() => handleDocumentSelect(document.id)}
                onDelete={() => handleDocumentDelete(document.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
