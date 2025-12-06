import { Document, QAPair, FileValidationResult } from '../types';
import { generateMockAnswer } from './mockData';
import { extractTextFromFile } from './textExtraction';
import { API_CONFIG, incrementQuestionCounter, shouldUseAI } from './config';

// Simulate network delay
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Validate file before upload
export function validateFile(file: File): FileValidationResult {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'application/rtf',
  ];

  const result: FileValidationResult = {
    isValid: true,
    warnings: [],
  };

  // Check file size
  if (file.size > maxSize) {
    result.isValid = false;
    result.error = `File size (${(file.size / 1024 / 1024).toFixed(1)}MB) exceeds maximum limit of 10MB`;
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    result.isValid = false;
    result.error = `File type "${file.type}" is not supported. Supported types: PDF, DOC, DOCX, TXT, RTF`;
  }

  // Add warnings
  if (file.size > 5 * 1024 * 1024) {
    result.warnings?.push('Large file detected. Upload may take longer.');
  }

  return result;
}

// Upload document with text extraction
export async function uploadDocument(
  file: File,
  onProgress?: (progress: number) => void
): Promise<Document> {
  const validation = validateFile(file);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  // Simulate upload progress (first 70% for upload)
  const uploadSteps = 70;
  const uploadStepDelay = Math.random() * 50 + 25; // 25-75ms per step

  for (let i = 0; i <= uploadSteps; i++) {
    await delay(uploadStepDelay);
    onProgress?.(i);
  }

  // Extract text content from the file
  let content: string;
  try {
    content = await extractTextFromFile(file);
  } catch (error) {
    console.error('Failed to extract text:', error);
    // Fallback to a generic message if extraction fails
    content = `Failed to extract text from ${file.name}. The document was uploaded but text extraction failed.`;
  }

  // Simulate text processing progress (remaining 30%)
  const processingSteps = 30;
  const processingStepDelay = Math.random() * 100 + 50; // 50-150ms per step

  for (let i = 1; i <= processingSteps; i++) {
    await delay(processingStepDelay);
    onProgress?.(uploadSteps + i);
  }

  const document: Document = {
    id: Date.now().toString(),
    name: file.name,
    size: file.size,
    type: file.type,
    uploadDate: new Date(),
    lastModified: new Date(),
    status: 'ready',
    content: content,
  };

  return document;
}

// Ask a question - uses AI for every 3rd question
export async function askQuestion(
  question: string,
  documentId: string,
  documentContent: string
): Promise<QAPair> {
  // Increment question counter and check if we should use AI
  incrementQuestionCounter();
  const useAI = shouldUseAI();

  let answer: string;

  if (useAI) {
    try {
      const response = await fetch(API_CONFIG.AI_SERVICE_URL + "?ask=" + `Below is my document content, i want to know - ${question}. Respond with the context only - ${documentContent.substring(0, 1000)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        answer = generateMockAnswer(question, documentContent);
        console.log("AI API request failed, falling back to mock.");
      }
      else{
      var responseText = await response.text(); 
      console.log("AI API request successful: ", responseText);
      answer = responseText;
      }
    } catch (error) {
      console.error('AI API call failed, falling back to mock:', error);
      // Fallback to mock answer if AI fails
      answer = generateMockAnswer(question, documentContent);
    }
  } else {
    // Simulate processing delay for mock answers
    const processingTime = 1000 + Math.random() * 3000; // 1-4 seconds
    await delay(processingTime);

    answer = generateMockAnswer(question, documentContent);
  }

  const qaPair: QAPair = {
    id: `qa-${Date.now()}`,
    documentId,
    question,
    answer,
    timestamp: new Date(),
  };

  return qaPair;
}

// Simulate searching Q&A history
export async function searchQAHistory(
  query: string,
  qaHistory: QAPair[],
  documents: Document[]
): Promise<any[]> {
  if (!query.trim()) {
    return [];
  }

  // Simulate search delay
  await delay(200 + Math.random() * 300);

  const queryLower = query.toLowerCase();

  return qaHistory
    .map(qa => {
      const questionMatch = qa.question.toLowerCase().includes(queryLower);
      const answerMatch = qa.answer.toLowerCase().includes(queryLower);

      if (!questionMatch && !answerMatch) {
        return null;
      }

      const document = documents.find(doc => doc.id === qa.documentId);
      if (!document) return null;

      // Calculate match score
      let score = 0;
      if (questionMatch) score += 10;
      if (answerMatch) score += 5;

      // Boost score for exact matches
      if (qa.question.toLowerCase() === queryLower) score += 20;
      if (qa.answer.toLowerCase().includes(queryLower)) score += 15;

      return {
        qaPair: qa,
        document,
        matchScore: score,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b!.matchScore - a!.matchScore);
}

// Simulate document deletion
export async function deleteDocument(documentId: string): Promise<void> {
  // Simulate API call delay
  await delay(500 + Math.random() * 1000);

  // In a real app, this would make an API call
  // For demo purposes, we'll just simulate success
}

// Utility to format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Utility to get file extension
export function getFileExtension(filename: string): string {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
}

// Utility to get file icon based on type
export function getFileIcon(type: string): string {
  if (type.includes('pdf')) return '📄';
  if (type.includes('word') || type.includes('document')) return '📝';
  if (type.includes('text')) return '📄';
  return '📄';
}
