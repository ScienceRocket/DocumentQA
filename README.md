# Document QA Service

A React TypeScript application for document question-and-answer functionality with mock data. This application allows users to upload documents, ask questions about their content, and search through Q&A history.

## Features

### Core Features ✅
- **Document Upload**: Drag-and-drop interface with simulated file uploads and progress tracking
- **Document Library**: View uploaded files with metadata (name, size, upload date, status)
- **Document Content Viewer**: View extracted text content in a clean, readable modal
- **Document Management**: Delete documents from both sidebar and main content area
- **Q&A Interface**: Ask questions about documents with real-time character count (500 max)
- **AI Integration**: Configurable AI service integration (every 3rd question uses real AI, others use mock data)
- **Q&A History**: View conversation history for each document
- **Search Functionality**: Search across all Q&A history with debounced search

### Technical Features ✅
- **React + TypeScript**: Built with modern React and full TypeScript support
- **Custom Hooks**: Data management with custom hooks and Context API
- **Component Architecture**: Reusable components with proper composition
- **TypeScript Interfaces**: Comprehensive type definitions for all data structures
- **Error Boundaries**: Graceful error handling with error boundaries
- **Loading States**: Proper loading indicators throughout the app
- **State Management**: Context API for global state management
- **AI Integration**: Configurable external AI service with fallback to mock responses
- **Mock API**: Simulated API responses with realistic delays

### UI/UX Features ✅
- **File Upload Progress**: Visual progress indicators for uploads
- **Toast Notifications**: Success/error notifications with auto-dismiss
- **Responsive Layout**: Sidebar navigation that works on all screen sizes
- **Keyboard Shortcuts**:
  - `Ctrl/Cmd + /`: Toggle dark/light mode
  - `Ctrl/Cmd + U`: Upload document shortcut
  - `Ctrl/Cmd + K`: Focus search input
  - `Ctrl + Enter`: Submit question
- **Dark/Light Mode**: Complete theme switching with persistence

### Technical Implementation ✅
- **Simulated Uploads**: Realistic file upload simulation with progress
- **Text Extraction**: Automatic text extraction from PDF, DOCX, and TXT files
- **Content Viewer**: Clean modal interface for viewing extracted document text
- **AI Integration**: External AI service for document Q&A (configurable, with mock fallback)
- **Mock Q&A**: Intelligent mock responses based on document content
- **Debounced Search**: Optimized search with 300ms debounce
- **Form Validation**: Real-time validation with visual feedback
- **Local Storage**: Automatic persistence of app state
- **Responsive Design**: Mobile-first design that works on all devices

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Document Processing**: PDF.js (PDF text extraction) + Mammoth (DOCX text extraction)
- **Testing**: Vitest + React Testing Library
- **Styling**: CSS Modules with CSS Variables for theming

## Project Structure

```
src/
├── components/           # React components
│   ├── __tests__/       # Component tests
│   ├── ErrorBoundary.tsx
│   ├── FileUpload.tsx
│   ├── DocumentCard.tsx
│   ├── DocumentContentModal.tsx
│   ├── MainContent.tsx
│   ├── NotificationContainer.tsx
│   ├── QAHistory.tsx
│   ├── QuestionInput.tsx
│   ├── SearchInput.tsx
│   ├── SearchResults.tsx
│   └── Sidebar.tsx
├── context/             # State management
│   └── AppContext.tsx
├── types/               # TypeScript interfaces
│   └── index.ts
├── utils/               # Utility functions
│   ├── api.ts          # Mock API functions
│   └── mockData.ts     # Sample data generators
├── test/               # Test setup
│   └── setup.ts
├── App.tsx             # Main app component
├── App.css             # Global styles
├── index.css           # Base styles
└── main.tsx           # App entry point
```

## Getting Started

### Prerequisites

Since this project was built without Node.js/npm available in the environment, you'll need to:

1. Install Node.js (version 18 or higher)
2. Install npm or yarn
3. The project includes additional dependencies for document text extraction (PDF.js, Mammoth)

### Installation

1. **Clone or download the project**
2. **Install dependencies** (includes PDF.js and Mammoth for document text extraction):
   ```bash
   npm install
   ```
3. **Start the development server**:
   ```bash
   npm run dev
   ```
4. **Open your browser** to `http://localhost:5173` (or your computer's IP address on port 5173 for network access)

   **Network Access**: The development server now binds to all network interfaces, allowing access from other devices on your local network. Use your computer's IP address instead of `localhost` (e.g., `http://192.168.1.100:5173`). You can find your IP address using `ipconfig` (Windows), `ifconfig` (Linux/Mac), or checking your network settings.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI

## Usage

### Uploading Documents

1. Click "Upload Document" in the sidebar or use `Ctrl+U`
2. Drag and drop a file or click to browse
3. Supported formats: PDF, DOC, DOCX, TXT (max 10MB)
4. Watch the upload progress and status indicators

### Viewing Document Content

1. Select a document from the sidebar
2. Click the eye icon (👁️) in the document header to view extracted text content
3. Content displays in a clean, readable modal with document metadata
4. Text extraction supports PDF, DOCX, and TXT files using client-side processing

### Managing Documents

1. **Delete from Sidebar**: Hover over a document card and click the delete icon
2. **Delete from Main View**: When viewing a document, click the delete button in the header
3. **View Content**: Access document text content via the view button in both locations

### Asking Questions

1. Select a document from the sidebar
2. Type your question in the input field (max 500 characters)
3. Press `Ctrl+Enter` or click the send button
4. Wait for the response:
   - **Questions 1, 2, 4, 5, 7, 8...**: Use intelligent mock responses
   - **Questions 3, 6, 9, 12...**: Use external AI service (if configured)

### AI Integration

The application includes configurable AI integration that activates for every 3rd question asked:

- **Configuration**: AI service URL can be set in `src/utils/config.ts`
- **Fallback**: If AI service is unavailable, automatically falls back to mock responses
- **Content Limit**: Document content is limited to 1000 characters for API efficiency
- **Privacy**: AI service URL should be removed before sharing the codebase publicly

To disable AI integration entirely, set `AI_SERVICE_URL` to an empty string in the config file.

### Searching Q&A History

1. Use the search bar in the sidebar or press `Ctrl+K`
2. Type keywords to search across all questions and answers
3. Results show matching Q&A pairs with document context

### Keyboard Shortcuts

- `Ctrl/Cmd + /`: Toggle theme
- `Ctrl/Cmd + U`: Upload document
- `Ctrl/Cmd + K`: Focus search
- `Ctrl + Enter`: Submit question

## Sample Data

The application comes pre-loaded with sample documents and Q&A history:

- **Annual Report** (PDF): Financial and business information with extracted text content
- **Product Manual** (PDF): Smart home device setup guide with full text extraction
- **Research Paper** (PDF): AI/ML research findings with academic content
- **Meeting Notes** (DOCX): Team planning discussion with formatted text extraction

## Architecture

### State Management

The app uses React Context API for global state management:

- **Documents**: File metadata, upload status, content
- **Q&A History**: Questions, answers, timestamps
- **Search**: Query, results, loading states
- **UI State**: Theme, notifications, current document

### API Integration

The application uses a hybrid approach combining external AI services with mock data:

- **File Upload**: 1-3 second processing with progress updates
- **Q&A**: Alternates between external AI (every 3rd question) and mock responses (1-4 second delay)
- **Search**: 200-500ms search with scoring algorithm
- **AI Service**: Configurable external API with automatic fallback to mock data
- **Configuration**: AI endpoint can be enabled/disabled via `src/utils/config.ts`

### Component Design

Components follow a composition pattern:

- **Container Components**: Manage state and data flow
- **Presentational Components**: Focus on UI rendering
- **Custom Hooks**: Encapsulate business logic
- **Error Boundaries**: Prevent cascading failures

## Testing

Basic test setup is included with:

- Vitest for test runner
- React Testing Library for component testing
- Sample test for DocumentCard component
- Test utilities and mocking setup

Run tests with:
```bash
npm run test
```


## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

This is a demo project, but contributions are welcome:

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## License

This project is for educational purposes. Feel free to use and modify as needed.
