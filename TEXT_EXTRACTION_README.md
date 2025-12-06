# Document Text Extraction Implementation

## Overview

This implementation adds real text extraction functionality to the Document QA Service. When documents are uploaded, their text content is now extracted and stored in session for use by AI processing.

## Changes Made

### 1. Dependencies Added
- `pdfjs-dist`: For PDF text extraction
- `mammoth`: For DOCX text extraction

### 2. New Files Created
- `src/utils/textExtraction.ts`: Core text extraction utilities
- `src/utils/textExtraction.test.ts`: Test utilities for text extraction

### 3. Files Modified
- `package.json`: Added new dependencies
- `src/utils/api.ts`: Updated `uploadDocument` function to extract real text content

## Supported File Types

- **PDF** (.pdf): Full text extraction using PDF.js
- **DOCX** (.docx): Full text extraction using Mammoth
- **TXT** (.txt): Plain text extraction
- **DOC** (.doc): Not supported (suggest converting to DOCX)

## Installation

Run the following command to install the required dependencies:

```bash
npm install pdfjs-dist mammoth
```

## How It Works

1. When a document is uploaded, the `uploadDocument` function now calls `extractTextFromFile()`
2. Text extraction happens during the upload process (after upload progress, during processing phase)
3. The extracted text is stored in the `Document.content` field
4. This content is available in session and can be passed to AI for processing

## Usage

The text extraction happens automatically during document upload. The extracted content is stored in the document object and can be accessed via:

```typescript
const document = await uploadDocument(file, onProgress);
console.log(document.content); // Contains the extracted text
```

## Error Handling

If text extraction fails for any reason, the system falls back to an error message in the content field, but the document upload still succeeds. This ensures the application remains functional even if text extraction encounters issues.

## Testing

To test the text extraction functionality:

```typescript
import { testTextExtraction } from './utils/textExtraction.test';

// Run tests
testTextExtraction();
```

## Future Improvements

- Add support for additional file types (DOC, RTF, etc.)
- Implement server-side text extraction for larger files
- Add OCR support for scanned PDFs/images
- Add text preprocessing and cleanup
