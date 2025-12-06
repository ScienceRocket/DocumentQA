export interface Document {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: Date;
  lastModified: Date;
  status: 'uploading' | 'processing' | 'ready' | 'error';
  uploadProgress?: number;
  content?: string; // Mock content for Q&A simulation
}

export interface QAPair {
  id: string;
  documentId: string;
  question: string;
  answer: string;
  timestamp: Date;
  isLoading?: boolean;
}

export interface SearchResult {
  qaPair: QAPair;
  document: Document;
  matchScore: number;
}

export interface AppState {
  documents: Document[];
  qaHistory: QAPair[];
  currentDocumentId: string | null;
  searchQuery: string;
  searchResults: SearchResult[];
  isSearching: boolean;
  theme: 'light' | 'dark';
  notifications: Notification[];
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  timestamp: Date;
  autoClose?: boolean;
  duration?: number;
}

export interface UploadProgress {
  documentId: string;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
  loading: boolean;
}

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  warnings?: string[];
}

// Hook return types
export interface UseDocumentsReturn {
  documents: Document[];
  currentDocument: Document | null;
  uploadDocument: (file: File) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  selectDocument: (id: string) => void;
  isUploading: boolean;
}

export interface UseQAReturn {
  qaHistory: QAPair[];
  askQuestion: (question: string) => Promise<void>;
  isLoading: boolean;
  clearHistory: () => void;
}

export interface UseSearchReturn {
  searchResults: SearchResult[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearching: boolean;
  clearSearch: () => void;
}

export interface UseNotificationsReturn {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export interface UseThemeReturn {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

// Component prop types
export interface DocumentCardProps {
  document: Document;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export interface QAPairProps {
  qaPair: QAPair;
  document: Document;
}

export interface QuestionInputProps {
  onSubmit: (question: string) => void;
  disabled?: boolean;
  maxLength?: number;
}

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isLoading?: boolean;
}

export interface NotificationToastProps {
  notification: Notification;
  onClose: () => void;
}

export interface SidebarProps {
  documents: Document[];
  currentDocumentId: string | null;
  onDocumentSelect: (id: string) => void;
  onDocumentUpload: () => void;
  onDocumentDelete: (id: string) => void;
}

export interface DragDropAreaProps {
  onFileSelect: (files: FileList) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
}
