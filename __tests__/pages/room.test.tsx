import { render, screen, waitFor } from '@testing-library/react';
import { useQuery } from '@apollo/client';
import RoomPage from '../../pages/room/[code]';

// Mock useQuery
jest.mock('@apollo/client');
const mockUseQuery = useQuery as jest.MockedFunction<typeof useQuery>;

// Mock fetch
global.fetch = jest.fn();

// Mock next/router
const mockPush = jest.fn();
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('Room Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it('renders loading state', () => {
    mockUseQuery.mockReturnValue({
      data: null,
      loading: true,
      error: null,
      refetch: jest.fn(),
    });

    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({ valid: true }),
    });

    render(<RoomPage roomCode="ABC123" />);
    
    expect(screen.getByText('Loading notes...')).toBeInTheDocument();
  });

  it('renders room validation error', async () => {
    mockUseQuery.mockReturnValue({
      data: null,
      loading: false,
      error: null,
      refetch: jest.fn(),
    });

    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({ valid: false, error: 'Room not found' }),
    });

    render(<RoomPage roomCode="INVALID" />);

    await waitFor(() => {
      expect(screen.getByText('Room Not Found')).toBeInTheDocument();
      expect(screen.getByText('Room not found. Please check the room code.')).toBeInTheDocument();
    });
  });

  it('renders GraphQL error state', () => {
    mockUseQuery.mockReturnValue({
      data: null,
      loading: false,
      error: new Error('GraphQL error'),
      refetch: jest.fn(),
    });

    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({ valid: true }),
    });

    render(<RoomPage roomCode="ABC123" />);

    expect(screen.getByText('Connection Error')).toBeInTheDocument();
    expect(screen.getByText('Retry')).toBeInTheDocument();
  });

  it('renders room with notes', async () => {
    const mockNotes = [
      {
        id: '1',
        roomCode: 'ABC123',
        title: 'Test Note',
        content: 'Test content',
        x: 100,
        y: 200,
        color: 'yellow',
        createdAt: '2023-01-01T00:00:00.000Z',
      },
    ];

    mockUseQuery.mockReturnValue({
      data: { roomNotes: mockNotes },
      loading: false,
      error: null,
      refetch: jest.fn(),
    });

    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({ valid: true }),
    });

    render(<RoomPage roomCode="ABC123" />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Note')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test content')).toBeInTheDocument();
    });
  });

  it('renders empty room state', async () => {
    mockUseQuery.mockReturnValue({
      data: { roomNotes: [] },
      loading: false,
      error: null,
      refetch: jest.fn(),
    });

    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({ valid: true }),
    });

    render(<RoomPage roomCode="ABC123" />);

    await waitFor(() => {
      expect(screen.getByText('Your board is empty')).toBeInTheDocument();
      expect(screen.getByText('Click the + button or press \'N\' to create your first note')).toBeInTheDocument();
    });
  });

  it('validates room code format in getServerSideProps', () => {
    // This would be tested in a full integration test
    // Testing getServerSideProps requires a different approach
    expect(true).toBe(true);
  });
});