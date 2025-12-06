import React, { useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { User, Bot, Clock } from 'lucide-react';
import './QAHistory.css';

const QAHistory: React.FC = () => {
  const { state } = useApp();
  const historyRef = useRef<HTMLDivElement>(null);

  const currentDocumentQA = state.qaHistory
    .filter(qa => qa.documentId === state.currentDocumentId)
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  // Auto-scroll to bottom when new Q&A is added
  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [currentDocumentQA]);

  if (currentDocumentQA.length === 0) {
    return (
      <div className="qa-history-empty">
        <Bot size={48} />
        <h3>No questions yet</h3>
        <p>Ask your first question about this document</p>
      </div>
    );
  }

  return (
    <div className="qa-history" ref={historyRef}>
      {currentDocumentQA.map((qa) => (
        <div key={qa.id} className="qa-item">
          {/* Question */}
          <div className="qa-question">
            <div className="qa-avatar">
              <User size={16} />
            </div>
            <div className="qa-content">
              <div className="qa-text">{qa.question}</div>
              <div className="qa-timestamp">
                <Clock size={12} />
                {qa.timestamp.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Answer */}
          <div className="qa-answer">
            <div className="qa-avatar">
              {qa.isLoading ? (
                <div className="loading" />
              ) : (
                <Bot size={16} />
              )}
            </div>
            <div className="qa-content">
              {qa.isLoading ? (
                <div className="qa-loading">
                  <div className="loading-text">Thinking...</div>
                  <div className="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="qa-text">{qa.answer}</div>
                  <div className="qa-timestamp">
                    <Clock size={12} />
                    Answered {qa.timestamp.toLocaleString()}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QAHistory;
