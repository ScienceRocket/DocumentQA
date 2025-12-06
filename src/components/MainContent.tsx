import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FileText, MessageSquare, Search, Eye, Trash2, Download } from 'lucide-react';
import QuestionInput from './QuestionInput';
import QAHistory from './QAHistory';
import SearchResults from './SearchResults';
import DocumentContentModal from './DocumentContentModal';
import { formatFileSize, getFileIcon } from '../utils/api';
import './MainContent.css';

const MainContent: React.FC = () => {
  const { state, deleteDocument,addNotification } = useApp();
  const [showContentModal, setShowContentModal] = useState(false);

  const handleExport = () => {
    if (!currentDocument) return;

    const exportData = {
      document: {
        id: currentDocument.id,
        name: currentDocument.name,
        type: currentDocument.type,
        size: currentDocument.size,
        uploadDate: currentDocument.uploadDate.toISOString(),
        content: currentDocument.content
      },
      qaHistory: documentQAHistory.map(qa => ({
        id: qa.id,
        question: qa.question,
        answer: qa.answer,
        timestamp: qa.timestamp.toISOString()
      }))
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentDocument.name}_export.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    addNotification({
      type: 'success',
      message: 'Document exported successfully',
      autoClose: true,
      duration: 3000,
    });
  };

  const currentDocument = state.documents.find(doc => doc.id === state.currentDocumentId);
  const documentQAHistory = state.qaHistory.filter(qa => qa.documentId === state.currentDocumentId);

  if (state.searchQuery) {
    return (
      <div className="main-content">
        <div className="main-header">
          <div className="header-icon">
            <Search size={24} />
          </div>
          <div className="header-info">
            <h2>Search Results</h2>
            <p>
              {state.searchResults.length > 0
                ? `Found ${state.searchResults.length} matches for "${state.searchQuery}"`
                : `No results found for "${state.searchQuery}"`
              }
            </p>
          </div>
        </div>

        <SearchResults />
      </div>
    );
  }

  if (!currentDocument) {
    return (
      <div className="main-content">
        <div className="empty-main">
          <div className="empty-icon">
            <FileText size={64} />
          </div>
          <h2>Welcome to Document QA</h2>
          <p>Select a document from the sidebar to start asking questions</p>
          <div className="empty-stats">
            <div className="stat">
              <span className="stat-number">{state.documents.length}</span>
              <span className="stat-label">Documents</span>
            </div>
            <div className="stat">
              <span className="stat-number">{state.qaHistory.length}</span>
              <span className="stat-label">Q&A Pairs</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="main-header">
        <div className="header-icon">
          <span className="file-icon">{getFileIcon(currentDocument.type)}</span>
        </div>
        <div className="header-info">
          <h2>{currentDocument.name}</h2>
          <div className="document-meta">
            <span>{formatFileSize(currentDocument.size)}</span>
            <span>•</span>
            <span>Uploaded {currentDocument.uploadDate.toLocaleDateString()}</span>
            <span>•</span>
            <span>{documentQAHistory.length} Q&A pairs</span>
          </div>
        </div>
        <div className="header-actions">
          {currentDocument.content && (
            <button
              className="header-action-btn header-view-btn"
              onClick={() => setShowContentModal(true)}
              title="View document content"
            >
              <Eye size={16} />
            </button>
          )}
          <button
            className="header-action-btn header-export-btn"
            onClick={handleExport}
            title="Export document data"
          >
            <Download size={16} />
          </button>
          <button
            className="header-action-btn header-delete-btn"
            onClick={() => {
              if (confirm('Are you sure you want to delete this document?')) {
                deleteDocument(currentDocument.id);
                addNotification({
                  type: 'success',
                  message: `Document has been deleted`,
                  autoClose: true,
                  duration: 30000,
                })
              }
            }}
            title="Delete document"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="main-body">
        <div className="question-section">
          <QuestionInput />
        </div>

        <div className="qa-section">
          <div className="section-header">
            <MessageSquare size={18} />
            <h3>Question & Answer History</h3>
            <span className="qa-count">{documentQAHistory.length}</span>
          </div>
            <br/>
          <QAHistory />
        </div>
      </div>

      <DocumentContentModal
        document={currentDocument}
        isOpen={showContentModal}
        onClose={() => setShowContentModal(false)}
      />
    </div>
  );
};

export default MainContent;
