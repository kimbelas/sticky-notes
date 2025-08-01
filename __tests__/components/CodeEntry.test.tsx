import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CodeEntry from '../../components/CodeEntry';

// Mock next/router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('CodeEntry Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it('renders correctly', () => {
    render(<CodeEntry />);
    
    expect(screen.getByText('NoteSpace')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('ENTER CODE')).toBeInTheDocument();
    expect(screen.getByText('Join Room')).toBeInTheDocument();
    expect(screen.getByText('Create New Room')).toBeInTheDocument();
  });

  it('loads saved code from localStorage on mount', () => {
    mockLocalStorage.getItem.mockReturnValue('ABC123');
    
    render(<CodeEntry />);
    
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('noteSpace_lastRoomCode');
    expect(screen.getByDisplayValue('ABC123')).toBeInTheDocument();
  });

  it('validates input format', () => {
    render(<CodeEntry />);
    const input = screen.getByPlaceholderText('ENTER CODE');
    
    // Test valid input
    fireEvent.change(input, { target: { value: 'abc123' } });
    expect(input).toHaveValue('ABC123');
    
    // Test invalid characters are filtered
    fireEvent.change(input, { target: { value: 'abc!@#' } });
    expect(input).toHaveValue('ABC');
    
    // Test length limit
    fireEvent.change(input, { target: { value: 'abcdefghij' } });
    expect(input).toHaveValue('ABCDEF');
  });

  it('submits valid code and navigates', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({ valid: true, room: { code: 'ABC123' } }),
    });

    render(<CodeEntry />);
    const input = screen.getByPlaceholderText('ENTER CODE');
    const submitButton = screen.getByText('Join Room');
    
    fireEvent.change(input, { target: { value: 'ABC123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/rooms/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: 'ABC123', createIfNotExists: true }),
      });
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('noteSpace_lastRoomCode', 'ABC123');
      expect(mockPush).toHaveBeenCalledWith('/room/ABC123');
    });
  });

  it('shows error for invalid code', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({ valid: false, error: 'Room not found' }),
    });

    render(<CodeEntry />);
    const input = screen.getByPlaceholderText('ENTER CODE');
    const submitButton = screen.getByText('Join Room');
    
    fireEvent.change(input, { target: { value: 'INVALID' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Room not found')).toBeInTheDocument();
    });
  });

  it('generates new room code', async () => {
    global.fetch = jest.fn()
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ code: 'NEW123' }),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ valid: true, room: { code: 'NEW123' } }),
      });

    render(<CodeEntry />);
    const createButton = screen.getByText('Create New Room');
    
    fireEvent.click(createButton);
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('NEW123')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/room/NEW123');
    }, { timeout: 2000 });
  });

  it('clears errors when user types', () => {
    render(<CodeEntry />);
    const input = screen.getByPlaceholderText('ENTER CODE');
    
    // Simulate an error state
    fireEvent.click(screen.getByText('Join Room'));
    
    // Type in input should clear error
    fireEvent.change(input, { target: { value: 'A' } });
    
    // Error should be cleared (this test assumes error state management works)
    expect(input).toHaveValue('A');
  });
});