import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Send, MessageSquare } from 'lucide-react';
import { askQuestion } from '../utils/api';
import './QuestionInput.css';

const QuestionInput: React.FC = () => {
  const { state, addQAPair, updateQAPair, setQALoading, addNotification } = useApp();
  const [question, setQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const maxLength = 500;
  const isDisabled = !state.currentDocumentId || isSubmitting;

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [question]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!question.trim() || isDisabled) return;

    const trimmedQuestion = question.trim();
    const document = state.documents.find(doc => doc.id === state.currentDocumentId);

    if (!document) {
      addNotification({
        type: 'error',
        message: 'No document selected',
        autoClose: true,
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);

    // Create a temporary Q&A pair with loading state
    const tempId = `temp-${Date.now()}`;
    const tempQAPair = {
      id: tempId,
      documentId: state.currentDocumentId!,
      question: trimmedQuestion,
      answer: '',
      timestamp: new Date(),
      isLoading: true,
    };

    addQAPair(tempQAPair);

    try {

      // Ask question - uses real AI API for every 3rd question, mock otherwise
      const result = await askQuestion(trimmedQuestion, state.currentDocumentId!, document.content || '');

      // Update the temp item with the real answer
      updateQAPair(tempId, {
        answer: result.answer,
        isLoading: false,
        // Optionally update timestamp to when answer was received
        timestamp: new Date(),
      });

      addNotification({
        type: 'success',
        message: 'Question answered successfully',
        autoClose: true,
        duration: 2000,
      });

      setQuestion('');
    } catch (error) {
      // Mark the temp item as not loading on error
      setQALoading(tempId, false);

      addNotification({
        type: 'error',
        message: 'Failed to get answer. Please try again.',
        autoClose: false,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const characterCount = question.length;
  const isNearLimit = characterCount > maxLength * 0.9;

  return (
    <div className="question-input-container">
      <div className="question-input-header">
        <MessageSquare size={18} />
        <h3>Ask a Question</h3>
      </div>

      <form onSubmit={handleSubmit} className="question-form">
        <div className="input-wrapper">
          <textarea
            ref={textareaRef}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              state.currentDocumentId
                ? "Ask a question about this document..."
                : "Select a document first"
            }
            disabled={isDisabled}
            maxLength={maxLength}
            rows={1}
            className="question-textarea"
          />
          <button
            type="submit"
            disabled={isDisabled || !question.trim()}
            className="submit-button"
            title="Submit question (Ctrl+Enter)"
          >
            {isSubmitting ? (
              <div className="loading" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>

        <div className="input-footer">
          <div className={`character-count ${isNearLimit ? 'near-limit' : ''}`}>
            {characterCount}/{maxLength}
          </div>
          <div className="input-hint">
            Press Ctrl+Enter to submit
          </div>
        </div>
      </form>
    </div>
  );
};

export default QuestionInput;
