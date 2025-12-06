import { extractTextFromFile, isTextExtractionSupported } from './textExtraction';

// Test file creation utilities
export function createMockFile(name: string, type: string, content: string): File {
  const blob = new Blob([content], { type });
  return new File([blob], name, { type });
}

// Test functions
export async function testTextExtraction() {
  console.log('Testing text extraction functionality...');

  // Test TXT file
  const txtFile = createMockFile('test.txt', 'text/plain', 'This is a test document with some text content.');
  console.log('Testing TXT file extraction...');
  const txtContent = await extractTextFromFile(txtFile);
  console.log('TXT extracted content:', txtContent);

  // Test if file types are supported
  console.log('TXT file supported:', isTextExtractionSupported(txtFile));

  const pdfFile = createMockFile('test.pdf', 'application/pdf', 'mock pdf content');
  console.log('PDF file supported:', isTextExtractionSupported(pdfFile));

  const docxFile = createMockFile('test.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'mock docx content');
  console.log('DOCX file supported:', isTextExtractionSupported(docxFile));

  const unsupportedFile = createMockFile('test.jpg', 'image/jpeg', 'mock image content');
  console.log('JPG file supported:', isTextExtractionSupported(unsupportedFile));
}
