import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import StickyBoard from '../../components/StickyBoard';
import { GET_ROOM_NOTES } from '../../src/graphql/queries';
import { Note } from '../../components/StickyNote';

interface RoomPageProps {
  roomCode: string;
}

export default function RoomPage({ roomCode }: RoomPageProps) {
  const router = useRouter();
  const [isValidating, setIsValidating] = useState(true);
  const [roomError, setRoomError] = useState<string | null>(null);
  
  const { data, loading, error, refetch } = useQuery(GET_ROOM_NOTES, {
    variables: { roomCode },
    skip: !roomCode || !!roomError,
    errorPolicy: 'all',
  });

  // Validate room on mount
  useEffect(() => {
    const validateRoom = async () => {
      if (!roomCode) return;

      try {
        const response = await fetch('/api/rooms/validate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            code: roomCode,
            createIfNotExists: false 
          }),
        });

        const result = await response.json();
        
        if (!result.valid) {
          setRoomError('Room not found. Please check the room code.');
        }
      } catch (error) {
        console.error('Room validation error:', error);
        setRoomError('Failed to validate room. Please try again.');
      } finally {
        setIsValidating(false);
      }
    };

    validateRoom();
  }, [roomCode]);

  const handleNotesChange = () => {
    refetch();
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  if (isValidating) {
    return (
      <>
        <Head>
          <title>Validating Room - Sticky Notes</title>
        </Head>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Validating room code...</p>
          </div>
        </div>
      </>
    );
  }

  if (roomError) {
    return (
      <>
        <Head>
          <title>Room Not Found - Sticky Notes</title>
        </Head>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">🔍</div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Room Not Found
            </h1>
            <p className="text-slate-600 mb-6">
              {roomError}
            </p>
            <button
              onClick={handleBackToHome}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Back to Home
            </button>
          </div>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Head>
          <title>Room {roomCode} - Sticky Notes</title>
        </Head>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Loading notes...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Head>
          <title>Error - Sticky Notes</title>
        </Head>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Connection Error
            </h1>
            <p className="text-slate-600 mb-6">
              Failed to load room data. Please check your connection and try again.
            </p>
            <div className="space-x-4">
              <button
                onClick={() => refetch()}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Retry
              </button>
              <button
                onClick={handleBackToHome}
                className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const notes: Note[] = data?.roomNotes || [];

  return (
    <>
      <Head>
        <title>Room {roomCode} - Sticky Notes</title>
        <meta name="description" content={`Collaborative sticky notes room ${roomCode}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <StickyBoard
        roomCode={roomCode}
        notes={notes}
        onNotesChange={handleNotesChange}
      />
      
      {/* Exit Room Button */}
      <button
        onClick={handleBackToHome}
        className="fixed top-4 right-4 z-10 px-4 py-2 bg-white/80 backdrop-blur-sm hover:bg-white text-slate-700 hover:text-slate-900 rounded-lg shadow-sm border border-slate-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
        title="Exit room"
      >
        <div className="flex items-center space-x-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span className="text-sm">Exit</span>
        </div>
      </button>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { code } = context.params!;
  
  if (!code || typeof code !== 'string') {
    return {
      notFound: true,
    };
  }

  // Validate room code format
  if (!/^[A-Z0-9]{6}$/.test(code.toUpperCase())) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      roomCode: code.toUpperCase(),
    },
  };
};