import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DocumentCard from '../DocumentCard';
import { Document } from '../../types';

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  FileText: () => <div data-testid="file-text-icon">📄</div>,
  Trash2: () => <div data-testid="trash-icon">🗑️</div>,
  Clock: () => <div data-testid="clock-icon">🕐</div>,
  CheckCircle: () => <div data-testid="check-circle-icon">✅</div>,
  AlertCircle: () => <div data-testid="alert-circle-icon">⚠️</div>,
}));

describe('DocumentCard', () => {
  const mockDocument: Document = {
    id: '1',
    name: 'test-document.pdf',
    size: 1024000, // 1MB
    type: 'application/pdf',
    uploadDate: new Date('2024-01-15'),
    lastModified: new Date('2024-01-15'),
    status: 'ready',
  };

  const mockProps = {
    document: mockDocument,
    isSelected: false,
    onSelect: vi.fn(),
    onDelete: vi.fn(),
  };

  it('renders document information correctly', () => {
    render(<DocumentCard {...mockProps} />);

    expect(screen.getByText('test-document.pdf')).toBeInTheDocument();
    expect(screen.getByText('1 MB')).toBeInTheDocument();
    expect(screen.getByText('1/15/2024')).toBeInTheDocument();
    expect(screen.getByText('Ready')).toBeInTheDocument();
  });

  it('calls onSelect when clicked', () => {
    render(<DocumentCard {...mockProps} />);
    const card = screen.getByText('test-document.pdf').closest('.document-card');

    fireEvent.click(card!);
    expect(mockProps.onSelect).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete when delete button is clicked', () => {
    render(<DocumentCard {...mockProps} />);
    const deleteButton = screen.getByTitle('Delete document');

    fireEvent.click(deleteButton);
    expect(mockProps.onDelete).toHaveBeenCalledTimes(1);
    expect(mockProps.onSelect).not.toHaveBeenCalled();
  });

  it('shows selected styling when isSelected is true', () => {
    const { container } = render(<DocumentCard {...mockProps} isSelected={true} />);
    const card = container.querySelector('.document-card.selected');

    expect(card).toBeInTheDocument();
  });

  it('displays different status indicators', () => {
    const uploadingDoc = { ...mockDocument, status: 'uploading' as const, uploadProgress: 50 };
    const { rerender } = render(<DocumentCard {...mockProps} document={uploadingDoc} />);

    expect(screen.getByText('Uploading (50%)')).toBeInTheDocument();

    const errorDoc = { ...mockDocument, status: 'error' as const };
    rerender(<DocumentCard {...mockProps} document={errorDoc} />);

    expect(screen.getByText('Error')).toBeInTheDocument();
  });
});
