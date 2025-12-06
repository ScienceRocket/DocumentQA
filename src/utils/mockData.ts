import { Document, QAPair } from '../types';

// Mock document content samples
export const mockDocumentContents = {
  'annual-report.pdf': `
    Annual Report 2024 - TechCorp Inc.

    Executive Summary:
    TechCorp Inc. has achieved significant growth in 2024, with revenue increasing by 35% to $2.4 billion.
    Our AI division showed particular strength, contributing $800 million in revenue.

    Key Highlights:
    - AI Solutions: 45% year-over-year growth
    - Cloud Services: 28% increase in market share
    - Cybersecurity: New partnerships with 15 Fortune 500 companies
    - Employee Count: Grew from 5,000 to 7,200

    Future Outlook:
    We expect continued growth in AI and cloud computing sectors, with planned investments
    of $500 million in R&D for the next fiscal year.

    Financial Performance:
    - Total Revenue: $2.4B (up 35%)
    - Net Profit: $420M (up 42%)
    - R&D Investment: $380M
    - Market Cap: $18.5B
  `,

  'product-manual.pdf': `
    Product Manual - SmartHome Hub v2.0

    Installation Guide:
    1. Unbox the SmartHome Hub and power adapter
    2. Connect the power adapter to the hub
    3. Download the SmartHome app on your mobile device
    4. Create an account or sign in to existing account
    5. Follow in-app instructions to connect the hub to your WiFi network

    Features:
    - Voice control with Alexa and Google Assistant integration
    - Smart device automation
    - Energy monitoring and reporting
    - Security camera integration
    - Remote access via mobile app
    - Firmware updates over-the-air

    Troubleshooting:
    - If the hub won't connect to WiFi, try resetting the device
    - Ensure your router is using 2.4GHz or 5GHz frequency
    - Check that your mobile device is connected to the same network
    - Restart the SmartHome app if connectivity issues persist

    Warranty:
    2-year limited warranty covers manufacturing defects.
    Warranty does not cover damage from misuse or accidents.
  `,

  'research-paper.pdf': `
    Research Paper: Advances in Machine Learning for Natural Language Processing

    Abstract:
    This paper presents recent advances in transformer-based architectures for natural language processing.
    We introduce a novel attention mechanism that improves computational efficiency while maintaining
    performance on benchmark datasets.

    Introduction:
    Natural Language Processing (NLP) has seen rapid advancement with the introduction of transformer
    architectures. The attention mechanism, first introduced in "Attention is All You Need" (Vaswani et al., 2017),
    revolutionized the field by enabling parallel processing of sequences.

    Methodology:
    Our approach modifies the standard multi-head attention mechanism by introducing a sparse attention
    pattern that reduces computational complexity from O(n²) to O(n√n) while preserving 95% of the
    original model's performance.

    Results:
    We evaluated our model on GLUE benchmark tasks, achieving state-of-the-art results on 8 out of 9 tasks.
    The sparse attention mechanism reduced training time by 40% and inference time by 35%.

    Conclusion:
    This work demonstrates that sparse attention mechanisms can significantly improve the efficiency
    of transformer models without sacrificing performance, opening new possibilities for deploying
    large language models on resource-constrained devices.
  `,

  'meeting-notes.docx': `
    Team Meeting Notes - Q1 Planning Session
    Date: January 15, 2024
    Attendees: Sarah Johnson (PM), Mike Chen (Engineering), Lisa Wong (Design), David Kim (QA)

    Agenda Items:

    1. Q1 Objectives Review
       - Launch mobile app redesign
       - Implement user feedback system
       - Expand API documentation
       - Hire 3 additional developers

    2. Current Project Status
       - Mobile redesign: 75% complete, on track for Feb release
       - Feedback system: Backend API completed, frontend in progress
       - Documentation: 40% complete, needs acceleration

    3. Resource Allocation
       - Sarah to focus on stakeholder management
       - Mike to lead technical architecture decisions
       - Lisa to coordinate with marketing team
       - David to establish QA automation pipeline

    4. Risks and Mitigation
       - Timeline risk for documentation: Allocate 2 additional writers
       - Technical debt in legacy system: Schedule refactoring sprint
       - Team bandwidth: Consider hiring freeze until Q2

    Action Items:
    - Sarah: Schedule follow-up with stakeholders (Due: Jan 22)
    - Mike: Create technical specification for feedback system (Due: Jan 20)
    - Lisa: Prepare design system documentation (Due: Jan 25)
    - David: Set up automated testing framework (Due: Feb 1)
  `,
};

// Generate realistic Q&A responses based on document content
export function generateMockAnswer(question: string, documentContent: string): string {
  const questionLower = question.toLowerCase();
  const contentLower = documentContent.toLowerCase();

  // Simple keyword-based response generation
  if (questionLower.includes('revenue') || questionLower.includes('financial')) {
    if (contentLower.includes('annual report')) {
      return "According to the annual report, TechCorp Inc. achieved $2.4 billion in revenue for 2024, representing a 35% increase from the previous year. The company's AI division contributed significantly with $800 million in revenue.";
    }
  }

  if (questionLower.includes('installation') || questionLower.includes('setup')) {
    if (contentLower.includes('product manual')) {
      return "To install the SmartHome Hub v2.0: 1) Unbox and connect power adapter, 2) Download the SmartHome mobile app, 3) Create/sign into account, 4) Follow in-app WiFi connection instructions.";
    }
  }

  if (questionLower.includes('research') || questionLower.includes('machine learning')) {
    if (contentLower.includes('research paper')) {
      return "The research paper introduces a novel sparse attention mechanism for transformer architectures that reduces computational complexity from O(n²) to O(n√n) while maintaining 95% performance. The model achieved state-of-the-art results on 8 out of 9 GLUE benchmark tasks.";
    }
  }

  if (questionLower.includes('meeting') || questionLower.includes('planning')) {
    if (contentLower.includes('meeting notes')) {
      return "The Q1 planning meeting focused on: mobile app redesign launch, user feedback system implementation, API documentation expansion, and hiring 3 additional developers. Key action items were assigned to team members with specific deadlines.";
    }
  }

  // Generic responses based on question type
  if (questionLower.includes('what') || questionLower.includes('summary')) {
    return `Based on the document content, this appears to be a ${getDocumentType(documentContent)} containing information about ${getDocumentTopic(documentContent)}.`;
  }

  if (questionLower.includes('how') || questionLower.includes('guide')) {
    return "The document provides detailed instructions and guidelines. Please ask a more specific question about the particular process or feature you're interested in.";
  }

  if (questionLower.includes('when') || questionLower.includes('date')) {
    return "The document mentions several dates and timelines. For specific scheduling information, please refer to the relevant sections of the document.";
  }
  // Default response
  return "I've analyzed the document content. This appears to be a comprehensive document with detailed information. Could you please ask a more specific question about particular aspects you'd like to know more about?";
}

function getDocumentType(content: string): string {
  if (content.includes('annual report')) return 'annual report';
  if (content.includes('product manual')) return 'product manual';
  if (content.includes('research paper')) return 'research paper';
  if (content.includes('meeting notes')) return 'meeting notes';
  return 'document';
}

function getDocumentTopic(content: string): string {
  if (content.includes('techcorp')) return 'company performance and growth';
  if (content.includes('smarthome')) return 'smart home device installation and features';
  if (content.includes('machine learning')) return 'advances in NLP and transformer architectures';
  if (content.includes('planning session')) return 'quarterly planning and team objectives';
  return 'various topics';
}

// Generate sample documents for initial state
export function generateSampleDocuments(): Document[] {
  const documents: Document[] = [
    {
      id: '1',
      name: 'annual-report.pdf',
      size: 2457600, // ~2.4MB
      type: 'application/pdf',
      uploadDate: new Date('2024-01-15'),
      lastModified: new Date('2024-01-15'),
      status: 'ready',
      content: mockDocumentContents['annual-report.pdf'],
    },
    {
      id: '2',
      name: 'product-manual.pdf',
      size: 1536000, // ~1.5MB
      type: 'application/pdf',
      uploadDate: new Date('2024-01-20'),
      lastModified: new Date('2024-01-20'),
      status: 'ready',
      content: mockDocumentContents['product-manual.pdf'],
    },
    {
      id: '3',
      name: 'research-paper.pdf',
      size: 512000, // ~512KB
      type: 'application/pdf',
      uploadDate: new Date('2024-01-25'),
      lastModified: new Date('2024-01-25'),
      status: 'ready',
      content: mockDocumentContents['research-paper.pdf'],
    },
    {
      id: '4',
      name: 'meeting-notes.docx',
      size: 768000, // ~768KB
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      uploadDate: new Date('2024-02-01'),
      lastModified: new Date('2024-02-01'),
      status: 'ready',
      content: mockDocumentContents['meeting-notes.docx'],
    },
  ];

  return documents;
}

// Generate sample Q&A history
export function generateSampleQAHistory(): QAPair[] {
  return [
    {
      id: 'qa1',
      documentId: '1',
      question: 'What was TechCorp\'s revenue for 2024?',
      answer: 'According to the annual report, TechCorp Inc. achieved $2.4 billion in revenue for 2024, representing a 35% increase from the previous year.',
      timestamp: new Date('2024-01-16'),
    },
    {
      id: 'qa2',
      documentId: '2',
      question: 'How do I install the SmartHome Hub?',
      answer: 'To install the SmartHome Hub v2.0: 1) Unbox and connect power adapter, 2) Download the SmartHome mobile app, 3) Create/sign into account, 4) Follow in-app WiFi connection instructions.',
      timestamp: new Date('2024-01-21'),
    },
    {
      id: 'qa3',
      documentId: '3',
      question: 'What are the key findings of the research?',
      answer: 'The research paper introduces a novel sparse attention mechanism for transformer architectures that reduces computational complexity while maintaining performance. The model achieved state-of-the-art results on most GLUE benchmark tasks.',
      timestamp: new Date('2024-01-26'),
    },
  ];
}
