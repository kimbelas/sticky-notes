'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useMutation } from '@apollo/client';
import StickyNote, { Note } from './StickyNote';
import { ADD_ROOM_NOTE, UPDATE_ROOM_NOTE, DELETE_ROOM_NOTE } from '../src/graphql/queries';

interface StickyBoardProps {
  roomCode: string;
  notes: Note[];
  onNotesChange: () => void;
}

export default function StickyBoard({ roomCode, notes, onNotesChange }: StickyBoardProps) {
  const [showAddButton, setShowAddButton] = useState(true);
  const [noteZIndices, setNoteZIndices] = useState<Record<string, number>>({});
  const [highestZIndex, setHighestZIndex] = useState(1);
  
  const boardRef = useRef<HTMLDivElement>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null);

  const [addRoomNote] = useMutation(ADD_ROOM_NOTE);
  const [updateRoomNote] = useMutation(UPDATE_ROOM_NOTE);
  const [deleteRoomNote] = useMutation(DELETE_ROOM_NOTE);

  // Bring a note to the front
  const bringToFront = useCallback((noteId: string) => {
    const newZIndex = highestZIndex + 1;
    setHighestZIndex(newZIndex);
    setNoteZIndices(prev => ({
      ...prev,
      [noteId]: newZIndex
    }));
  }, [highestZIndex]);

  // Generate a random position for new notes
  const getRandomPosition = useCallback(() => {
    const margin = 50;
    const noteWidth = 256; // w-64 = 16rem = 256px
    const noteHeight = 192; // min-h-48 = 12rem = 192px
    
    const maxX = Math.max(window.innerWidth - noteWidth - margin, margin);
    const maxY = Math.max(window.innerHeight - noteHeight - margin, margin);
    
    return {
      x: Math.random() * (maxX - margin) + margin,
      y: Math.random() * (maxY - margin) + margin,
    };
  }, []);

  // Create a new note
  const handleAddNote = useCallback(async () => {
    const position = getRandomPosition();
    
    try {
      await addRoomNote({
        variables: {
          roomCode,
          input: {
            title: '',
            content: '',
            color: 'yellow',
            x: position.x,
            y: position.y,
          },
        },
      });
      onNotesChange();
    } catch (error) {
      console.error('Error adding note:', error);
    }
  }, [getRandomPosition, addRoomNote, roomCode, onNotesChange]);

  // Update a note
  const handleUpdateNote = useCallback(async (note: Note, updates: Partial<Note>) => {
    try {
      await updateRoomNote({
        variables: {
          roomCode,
          noteId: note.id,
          input: {
            title: updates.title ?? note.title,
            content: updates.content ?? note.content,
            color: updates.color ?? note.color,
            x: updates.x ?? note.x,
            y: updates.y ?? note.y,
          },
        },
      });
      onNotesChange();
    } catch (error) {
      console.error('Error updating note:', error);
    }
  }, [roomCode, updateRoomNote, onNotesChange]);

  // Delete a note
  const handleDeleteNote = async (note: Note) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteRoomNote({
          variables: {
            roomCode,
            noteId: note.id,
          },
        });
        onNotesChange();
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  };

  // Handle drag end callback (simplified since drag is handled in StickyNote)
  const handleDragStart = (note: Note, e: React.MouseEvent) => {
    setShowAddButton(false);
    bringToFront(note.id);
  };

  const handleDragEnd = (note: Note) => {
    setShowAddButton(true);
  };

  // Handle note click to bring to front
  const handleNoteClick = (note: Note) => {
    bringToFront(note.id);
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 'N' key to create new note
      if (e.key.toLowerCase() === 'n' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const activeElement = document.activeElement;
        // Only trigger if not typing in an input
        if (activeElement?.tagName !== 'INPUT' && activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault();
          handleAddNote();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleAddNote]);


  return (
    <div
      ref={boardRef}
      className="relative w-full min-h-screen bg-gradient-to-br from-slate-50 to-slate-100"
      style={{ 
        backgroundImage: `
          radial-gradient(circle at 25px 25px, rgba(148, 163, 184, 0.1) 2px, transparent 0),
          radial-gradient(circle at 75px 75px, rgba(148, 163, 184, 0.1) 2px, transparent 0)
        `,
        backgroundSize: '100px 100px'
      }}
    >
      {/* Room Code Header */}
      <div className="fixed top-4 left-4 z-10 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm border border-slate-200 max-w-[calc(100vw-8rem)]">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-600 hidden sm:inline">Room:</span>
          <code className="font-mono font-semibold text-indigo-600 text-sm sm:text-base">{roomCode}</code>
          <button
            onClick={() => navigator.clipboard.writeText(roomCode)}
            className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
            title="Copy room code"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Instructions */}
      {notes.length === 0 && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-semibold text-slate-700 mb-2">
            Your board is empty
          </h2>
          <p className="text-slate-500 mb-4">
            Click the + button or press &apos;N&apos; to create your first note
          </p>
          <div className="text-sm text-slate-400">
            Drag notes to move them around • Share the room code to collaborate
          </div>
        </div>
      )}

      {/* Notes */}
      {notes.map((note) => (
        <StickyNote
          key={note.id}
          note={note}
          onUpdate={handleUpdateNote}
          onDelete={handleDeleteNote}
          isDragging={false}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onClick={handleNoteClick}
          zIndex={noteZIndices[note.id] || 1}
        />
      ))}

      {/* Add Note Button */}
      {showAddButton && (
        <button
          ref={addButtonRef}
          onClick={handleAddNote}
          className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          title="Add new note (N)"
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="currentColor"
            className="group-hover:scale-110 transition-transform"
          >
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
        </button>
      )}

      {/* Keyboard Shortcuts Info */}
      <div className="fixed bottom-4 left-4 text-xs text-slate-400 bg-white/60 backdrop-blur-sm rounded px-2 py-1 max-w-[calc(100vw-2rem)] hidden sm:block">
        Press &apos;N&apos; to add note • Click and drag to move • Ctrl+Enter to save
      </div>
    </div>
  );
}