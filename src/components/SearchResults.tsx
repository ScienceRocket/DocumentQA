import React from 'react';
import { useApp } from '../context/AppContext';
import { FileText, MessageSquare, Clock, ExternalLink } from 'lucide-react';
import { formatFileSize, getFileIcon } from '../utils/api';
import './SearchResults.css';

const SearchResults: React.FC = () => {
  const { state,setSearchQuery, setSearchResults, selectDocument } = useApp();

  if (state.searchResults.length === 0) {
    return (
      <div className="search-results-empty">
        <div className="empty-icon">
          <MessageSquare size={48} />
        </div>
        <h3>No results found</h3>
        <p>Try adjusting your search terms or check your spelling</p>
      </div>
    );
  }

  const handleResultClick = (documentId: string, qaId: string) => {
    selectDocument(documentId);
    setSearchResults([]);
    setSearchQuery("");
  };

  return (
    <div className="search-results">
      <div className="search-results-header">
        <h3>Search Results</h3>
        <span className="results-count">
          {state.searchResults.length} match{state.searchResults.length !== 1 ? 'es' : ''}
        </span>
      </div>

      <div className="search-results-list">
        {state.searchResults.map((result, index) => (
          <div
            key={`${result.qaPair.id}-${index}`}
            className="search-result-item"
            onClick={() => handleResultClick(result.document.id, result.qaPair.id)}
          >
            <div className="result-document">
              <div className="document-icon">
                <span className="file-icon">{getFileIcon(result.document.type)}</span>
              </div>
              <div className="document-info">
                <div className="document-name">{result.document.name}</div>
                <div className="document-meta">
                  {formatFileSize(result.document.size)} • {result.document.uploadDate.toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="result-qa">
              <div className="qa-question">
                <div className="qa-label">Q:</div>
                <div className="qa-text">{result.qaPair.question}</div>
              </div>
              <div className="qa-answer">
                <div className="qa-label">A:</div>
                <div className="qa-text">{result.qaPair.answer}</div>
              </div>
            </div>

            <div className="result-meta">
              <div className="result-timestamp">
                <Clock size={12} />
                {result.qaPair.timestamp.toLocaleString()}
              </div>
              <div className="result-score">
                Match score: {result.matchScore}
              </div>
            </div>

            <div className="result-action">
              <ExternalLink size={14} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
