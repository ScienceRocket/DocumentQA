import * as pdfjsLib from 'pdfjs-dist';
import * as mammoth from 'mammoth';

// Configure PDF.js worker to use the local worker file from public directory
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

/**
 * Extracts text content from various document types
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const fileType = file.type;

  try {
    switch (fileType) {
      case 'application/pdf':
        return await extractTextFromPDF(file);
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return await extractTextFromDOCX(file);
      case 'text/plain':
        return await extractTextFromTXT(file);
      default:
        // Try to extract text based on file extension for files without proper MIME types
        const extension = getFileExtension(file.name).toLowerCase();
        switch (extension) {
          case 'pdf':
            return await extractTextFromPDF(file);
          case 'docx':
            return await extractTextFromDOCX(file);
          case 'txt':
            return await extractTextFromTXT(file);
          case 'doc':
            // DOC files are more complex, return a placeholder for now
            return `Text extraction not supported for .doc files. Please convert to .docx format.`;
          default:
            throw new Error(`Unsupported file type: ${fileType || extension}`);
        }
    }
  } catch (error) {
    console.error('Error extracting text from file:', error);
    return `Error extracting text: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}

/**
 * Extracts text from PDF files using PDF.js
 */
async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let fullText = '';

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();

    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');

    fullText += pageText + '\n';
  }

  return fullText.trim();
}

/**
 * Extracts text from DOCX files using Mammoth
 */
async function extractTextFromDOCX(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });

  return result.value.trim();
}

/**
 * Extracts text from plain text files
 */
async function extractTextFromTXT(file: File): Promise<string> {
  return await file.text();
}

/**
 * Gets file extension from filename
 */
function getFileExtension(filename: string): string {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
}

/**
 * Validates if a file type is supported for text extraction
 */
export function isTextExtractionSupported(file: File): boolean {
  const supportedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];

  if (supportedTypes.includes(file.type)) {
    return true;
  }

  // Check file extension for files without proper MIME types
  const extension = getFileExtension(file.name).toLowerCase();
  return ['pdf', 'docx', 'txt'].includes(extension);
}
