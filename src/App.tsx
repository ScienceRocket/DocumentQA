import React, { useEffect, useCallback, useRef } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { generateSampleDocuments, generateSampleQAHistory } from './utils/mockData';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import NotificationContainer from './components/NotificationContainer';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

function AppContent() {
  const { state, addDocument, addQAPair, toggleTheme, addNotification } = useApp();
  const initializedRef = useRef(false);

  // Initialize with sample data if app appears empty 
  useEffect(() => {

    // Small delay to ensure localStorage loading is complete
    const timer = setTimeout(() => {
      // Load sample data if there are no documents and no Q&A history
      const shouldLoadSamples = state.documents.length === 0 && state.qaHistory.length === 0;

      console.log(shouldLoadSamples); 
      if (shouldLoadSamples) {
        const sampleDocs = generateSampleDocuments();
        const sampleQA = generateSampleQAHistory();

        sampleDocs.forEach(doc => addDocument(doc)); 
        sampleQA.forEach(qa => addQAPair(qa));
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [state.documents.length, state.qaHistory.length, addDocument, addQAPair]);

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const isCtrlOrCmd = e.ctrlKey || e.metaKey;

    if (isCtrlOrCmd) {
      switch (e.key) {
        case '/':
          e.preventDefault();
          toggleTheme();
          addNotification({
            type: 'info',
            message: `Switched to ${state.theme === 'light' ? 'dark' : 'light'} mode`,
            autoClose: true,
            duration: 1500,
          });
          break;
        case 'u':
        case 'U':
          e.preventDefault();
          // This would trigger the upload modal - for now just show a notification
          addNotification({
            type: 'info',
            message: 'Upload shortcut pressed (Ctrl+U)',
            autoClose: true,
            duration: 2000,
          });
          break;
        case 'k':
        case 'K':
          e.preventDefault();
          // Focus search input - would need to expose a ref or method
          addNotification({
            type: 'info',
            message: 'Search shortcut pressed (Ctrl+K)',
            autoClose: true,
            duration: 2000,
          });
          break;
      }
    }
  }, [toggleTheme, addNotification, state.theme]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className={`app ${state.theme}`}>
      <ErrorBoundary>
        <div className="app-layout">
          <Sidebar />
          <MainContent />
        </div>
        <NotificationContainer />
      </ErrorBoundary>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
