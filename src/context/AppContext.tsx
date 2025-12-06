import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import { AppState, Document, QAPair, Notification, SearchResult } from '../types';
import { generateSampleDocuments, generateSampleQAHistory } from '../utils/mockData';

// Action types
type AppAction =
  | { type: 'ADD_DOCUMENT'; payload: Document }
  | { type: 'UPDATE_DOCUMENT'; payload: { id: string; updates: Partial<Document> } }
  | { type: 'DELETE_DOCUMENT'; payload: string }
  | { type: 'SELECT_DOCUMENT'; payload: string }
  | { type: 'ADD_QA_PAIR'; payload: QAPair }
  | { type: 'UPDATE_QA_PAIR'; payload: { id: string; updates: Partial<QAPair> } }
  | { type: 'SET_QA_LOADING'; payload: { id: string; loading: boolean } }
  | { type: 'CLEAR_QA_HISTORY' }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_SEARCH_RESULTS'; payload: SearchResult[] }
  | { type: 'SET_SEARCHING'; payload: boolean }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_NOTIFICATIONS' }
  | { type: 'TOGGLE_THEME' }
  | { type: 'LOAD_STATE'; payload: Partial<AppState> };

// Initial state
const initialState: AppState = {
  documents: [],
  qaHistory: [],
  currentDocumentId: null,
  searchQuery: '',
  searchResults: [],
  isSearching: false,
  theme: 'light',
  notifications: [],
};

// Reducer function
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_DOCUMENT':
      return {
        ...state,
        documents: [...state.documents, action.payload],
        currentDocumentId: action.payload.id,
      };

    case 'UPDATE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.map(doc =>
          doc.id === action.payload.id ? { ...doc, ...action.payload.updates } : doc
        ),
      };

    case 'DELETE_DOCUMENT':
      const filteredDocs = state.documents.filter(doc => doc.id !== action.payload);
      const filteredQA = state.qaHistory.filter(qa => qa.documentId !== action.payload);
      return {
        ...state,
        documents: filteredDocs,
        qaHistory: filteredQA,
        currentDocumentId: state.currentDocumentId === action.payload
          ? (filteredDocs[0]?.id || null)
          : state.currentDocumentId,
      };

    case 'SELECT_DOCUMENT':
      return {
        ...state,
        currentDocumentId: action.payload,
      };

    case 'ADD_QA_PAIR':
      return {
        ...state,
        qaHistory: [...state.qaHistory, action.payload],
      };

    case 'UPDATE_QA_PAIR':
      return {
        ...state,
        qaHistory: state.qaHistory.map(qa =>
          qa.id === action.payload.id ? { ...qa, ...action.payload.updates } : qa
        ),
      };

    case 'SET_QA_LOADING':
      return {
        ...state,
        qaHistory: state.qaHistory.map(qa =>
          qa.id === action.payload.id ? { ...qa, isLoading: action.payload.loading } : qa
        ),
      };

    case 'CLEAR_QA_HISTORY':
      return {
        ...state,
        qaHistory: [],
      };

    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.payload,
      };

    case 'SET_SEARCH_RESULTS':
      return {
        ...state,
        searchResults: action.payload,
      };

    case 'SET_SEARCHING':
      return {
        ...state,
        isSearching: action.payload,
      };

    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };

    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
      };

    case 'CLEAR_NOTIFICATIONS':
      return {
        ...state,
        notifications: [],
      };

    case 'TOGGLE_THEME':
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      return {
        ...state,
        theme: newTheme,
      };

    case 'LOAD_STATE':
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
}

// Context
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Helper functions
  addDocument: (document: Document) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  deleteDocument: (id: string) => void;
  selectDocument: (id: string) => void;
  addQAPair: (qaPair: QAPair) => void;
  updateQAPair: (id: string, updates: Partial<QAPair>) => void;
  setQALoading: (id: string, loading: boolean) => void;
  clearQAHistory: () => void;
  setSearchQuery: (query: string) => void;
  setSearchResults: (results: SearchResult[]) => void;
  setSearching: (searching: boolean) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('document-qa-state');
    if (savedState) {
      
      try {
        const parsedState = JSON.parse(savedState);
        // Convert date strings back to Date objects
        const processedState: Partial<AppState> = {
          ...parsedState,
          documents: parsedState.documents?.map((doc: any) => ({
            ...doc,
            uploadDate: new Date(doc.uploadDate),
            lastModified: new Date(doc.lastModified),
          })),
          qaHistory: parsedState.qaHistory?.map((qa: any) => ({
            ...qa,
            timestamp: new Date(qa.timestamp),
          })),
          notifications: parsedState.notifications?.map((notif: any) => ({
            ...notif,
            timestamp: new Date(notif.timestamp),
          })),
        };
        dispatch({ type: 'LOAD_STATE', payload: processedState });
      } catch (error) {
        console.error('Failed to load saved state:', error);
      }
    } 
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('document-qa-state', JSON.stringify(state));
  }, [state]);

  // Helper functions
  const addDocument = useCallback((document: Document) => {
    dispatch({ type: 'ADD_DOCUMENT', payload: document });
  }, []);

  const updateDocument = useCallback((id: string, updates: Partial<Document>) => {
    dispatch({ type: 'UPDATE_DOCUMENT', payload: { id, updates } });
  }, []);

  const deleteDocument = useCallback((id: string) => {
    dispatch({ type: 'DELETE_DOCUMENT', payload: id });
  }, []);

  const selectDocument = useCallback((id: string) => {
    dispatch({ type: 'SELECT_DOCUMENT', payload: id });
  }, []);

  const addQAPair = useCallback((qaPair: QAPair) => {
    dispatch({ type: 'ADD_QA_PAIR', payload: qaPair });
  }, []);

  const updateQAPair = useCallback((id: string, updates: Partial<QAPair>) => {
    dispatch({ type: 'UPDATE_QA_PAIR', payload: { id, updates } });
  }, []);

  const setQALoading = useCallback((id: string, loading: boolean) => {
    dispatch({ type: 'SET_QA_LOADING', payload: { id, loading } });
  }, []);

  const clearQAHistory = useCallback(() => {
    dispatch({ type: 'CLEAR_QA_HISTORY' });
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  }, []);

  const setSearchResults = useCallback((results: SearchResult[]) => {
    dispatch({ type: 'SET_SEARCH_RESULTS', payload: results });
  }, []);

  const setSearching = useCallback((searching: boolean) => {
    dispatch({ type: 'SET_SEARCHING', payload: searching });
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const fullNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    dispatch({ type: 'ADD_NOTIFICATION', payload: fullNotification });
  }, []);

  const removeNotification = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  }, []);

  const clearNotifications = useCallback(() => {
    dispatch({ type: 'CLEAR_NOTIFICATIONS' });
  }, []);

  const toggleTheme = useCallback(() => {
    dispatch({ type: 'TOGGLE_THEME' });
  }, []);

  const value: AppContextType = {
    state,
    dispatch,
    addDocument,
    updateDocument,
    deleteDocument,
    selectDocument,
    addQAPair,
    updateQAPair,
    setQALoading,
    clearQAHistory,
    setSearchQuery,
    setSearchResults,
    setSearching,
    addNotification,
    removeNotification,
    clearNotifications,
    toggleTheme,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
