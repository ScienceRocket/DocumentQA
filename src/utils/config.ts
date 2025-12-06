// Configuration for external API endpoints
export const API_CONFIG = {
  // AI service for document Q&A
  AI_SERVICE_URL: 'https://vitradatacollection.vitraaspire.com/special/process/askAI.aspx',
} as const;

// Question tracking for AI integration
export let questionCounter = 0;

// Reset counter (useful for testing)
export function resetQuestionCounter(): void {
  questionCounter = 0;
}

// Increment and get current count
export function incrementQuestionCounter(): number {
  questionCounter++;
  return questionCounter;
}

// Check if current question should use AI (every 3rd question)
export function shouldUseAI(): boolean {
  if(API_CONFIG.AI_SERVICE_URL == null || API_CONFIG.AI_SERVICE_URL == undefined || API_CONFIG.AI_SERVICE_URL.length === 0){
    return false;
  }
  return questionCounter % 3 === 0 && questionCounter > 0;
}
