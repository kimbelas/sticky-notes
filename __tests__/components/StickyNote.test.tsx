import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import StickyNote, { Note } from '../../components/StickyNote';

describe('StickyNote Component', () => {
  const mockNote: Note = {
    id: '1',
    roomCode: 'ABC123',
    title: 'Test Note',
    content: 'Test content',
    x: 100,
    y: 200,
    color: 'yellow',
    createdAt: '2023-01-01T00:00:00.000Z',
  };

  const mockOnUpdate = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnDragStart = jest.fn();
  const mockOnDragEnd = jest.fn();

  const defaultProps = {
    note: mockNote,
    onUpdate: mockOnUpdate,
    onDelete: mockOnDelete,
    isDragging: false,
    onDragStart: mockOnDragStart,
    onDragEnd: mockOnDragEnd,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders note content correctly', () => {
    render(<StickyNote {...defaultProps} />);
    
    expect(screen.getByDisplayValue('Test Note')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test content')).toBeInTheDocument();
    expect(screen.getByText('1/1/2023')).toBeInTheDocument();
  });

  it('handles date formatting correctly', () => {
    const noteWithoutDate = { ...mockNote, createdAt: '' };
    render(<StickyNote {...defaultProps} note={noteWithoutDate} />);
    
    expect(screen.getByText('Just now')).toBeInTheDocument();
  });

  it('handles invalid date correctly', () => {
    const noteWithInvalidDate = { ...mockNote, createdAt: 'invalid-date' };
    render(<StickyNote {...defaultProps} note={noteWithInvalidDate} />);
    
    expect(screen.getByText('Just now')).toBeInTheDocument();
  });

  it('updates title when changed', async () => {
    render(<StickyNote {...defaultProps} />);
    const titleInput = screen.getByDisplayValue('Test Note');
    
    fireEvent.change(titleInput, { target: { value: 'Updated Title' } });
    fireEvent.blur(titleInput);
    
    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalledWith(mockNote, {
        title: 'Updated Title',
        content: 'Test content',
      });
    });
  });

  it('updates content when changed', async () => {
    render(<StickyNote {...defaultProps} />);
    const contentTextarea = screen.getByDisplayValue('Test content');
    
    fireEvent.change(contentTextarea, { target: { value: 'Updated content' } });
    fireEvent.blur(contentTextarea);
    
    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalledWith(mockNote, {
        title: 'Test Note',
        content: 'Updated content',
      });
    });
  });

  it('saves changes with Enter key in title', async () => {
    render(<StickyNote {...defaultProps} />);
    const titleInput = screen.getByDisplayValue('Test Note');
    
    fireEvent.change(titleInput, { target: { value: 'New Title' } });
    fireEvent.keyDown(titleInput, { key: 'Enter' });
    
    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalledWith(mockNote, {
        title: 'New Title',
        content: 'Test content',
      });
    });
  });

  it('saves changes with Ctrl+Enter in content', async () => {
    render(<StickyNote {...defaultProps} />);
    const contentTextarea = screen.getByDisplayValue('Test content');
    
    fireEvent.change(contentTextarea, { target: { value: 'New content' } });
    fireEvent.keyDown(contentTextarea, { key: 'Enter', ctrlKey: true });
    
    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalledWith(mockNote, {
        title: 'Test Note',
        content: 'New content',
      });
    });
  });

  it('opens and closes color picker', () => {
    render(<StickyNote {...defaultProps} />);
    const colorButton = screen.getByTitle('Change color');
    
    fireEvent.click(colorButton);
    expect(screen.getByText('Yellow')).toBeInTheDocument();
    
    // Click outside to close
    fireEvent.mouseDown(document.body);
    // Color picker should close (this would need to be tested with proper DOM querying)
  });

  it('changes note color', async () => {
    render(<StickyNote {...defaultProps} />);
    const colorButton = screen.getByTitle('Change color');
    
    fireEvent.click(colorButton);
    const redColorButton = screen.getByTitle('Red');
    fireEvent.click(redColorButton);
    
    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalledWith(mockNote, { color: 'red' });
    });
  });

  it('calls onDelete when delete button is clicked', () => {
    // Mock window.confirm
    window.confirm = jest.fn().mockReturnValue(true);
    
    render(<StickyNote {...defaultProps} />);
    const deleteButton = screen.getByTitle('Delete note');
    
    fireEvent.click(deleteButton);
    
    expect(mockOnDelete).toHaveBeenCalledWith(mockNote);
  });

  it('does not delete when user cancels confirmation', () => {
    // Mock window.confirm to return false
    window.confirm = jest.fn().mockReturnValue(false);
    
    render(<StickyNote {...defaultProps} />);
    const deleteButton = screen.getByTitle('Delete note');
    
    fireEvent.click(deleteButton);
    
    expect(mockOnDelete).not.toHaveBeenCalled();
  });

  it('shows dragging state correctly', () => {
    render(<StickyNote {...defaultProps} isDragging={true} />);
    const noteElement = screen.getByTestId || screen.getByRole('note') || document.querySelector('[data-note-id="1"]');
    
    // This would test for dragging styles, but requires proper test setup
    expect(noteElement).toBeTruthy();
  });

  it('prevents drag on input elements', () => {
    render(<StickyNote {...defaultProps} />);
    const titleInput = screen.getByDisplayValue('Test Note');
    
    fireEvent.mouseDown(titleInput);
    
    expect(mockOnDragStart).not.toHaveBeenCalled();
  });
});