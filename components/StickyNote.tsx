'use client';

import { useState, useRef, useEffect } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

export interface Note {
  id: string;
  roomCode: string;
  title: string;
  content: string;
  x: number;
  y: number;
  color: string;
  createdAt: string;
}

interface StickyNoteProps {
  note: Note;
  onUpdate: (note: Note, updates: Partial<Note>) => void;
  onDelete: (note: Note) => void;
  isDragging?: boolean;
  onDragStart?: (note: Note, e: React.MouseEvent) => void;
  onDragEnd?: (note: Note) => void;
}

const colorClassMap: Record<string, string> = {
  yellow: 'bg-yellow-50 border-yellow-200 shadow-yellow-100',
  red: 'bg-red-50 border-red-200 shadow-red-100',
  green: 'bg-green-50 border-green-200 shadow-green-100',
  blue: 'bg-blue-50 border-blue-200 shadow-blue-100',
  pink: 'bg-pink-50 border-pink-200 shadow-pink-100',
  purple: 'bg-purple-50 border-purple-200 shadow-purple-100',
  orange: 'bg-orange-50 border-orange-200 shadow-orange-100',
};

const colors = ['yellow', 'red', 'green', 'blue', 'pink', 'purple', 'orange'];

export default function StickyNote({
  note,
  onUpdate,
  onDelete,
  isDragging = false,
  onDragStart,
  onDragEnd,
}: StickyNoteProps) {
  const [editingTitle, setEditingTitle] = useState(note.title);
  const [editingContent, setEditingContent] = useState(note.content);
  const [hasChanges, setHasChanges] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  
  const noteRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hasChanges = editingTitle !== note.title || editingContent !== note.content;
    setHasChanges(hasChanges);
  }, [editingTitle, editingContent, note.title, note.content]);

  // Close color picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSave = () => {
    if (hasChanges) {
      onUpdate(note, {
        title: editingTitle,
        content: editingContent,
      });
      setHasChanges(false);
    }
  };

  const handleColorChange = (newColor: string) => {
    onUpdate(note, { color: newColor });
    setShowColorPicker(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only start drag if not clicking on input elements or buttons
    const target = e.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.tagName === 'BUTTON' ||
      target.closest('button') ||
      target.closest('.color-picker')
    ) {
      return;
    }

    e.preventDefault();
    setIsMouseDown(true);
    
    const startX = e.clientX - note.x;
    const startY = e.clientY - note.y;

    const handleMouseMove = (e: MouseEvent) => {
      const newX = Math.max(0, e.clientX - startX);
      const newY = Math.max(0, e.clientY - startY);
      
      // Update position immediately for smooth dragging
      if (noteRef.current) {
        noteRef.current.style.left = `${newX}px`;
        noteRef.current.style.top = `${newY}px`;
      }
    };

    const handleMouseUpGlobal = (e: MouseEvent) => {
      setIsMouseDown(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUpGlobal);
      
      // Update the note position in the database
      const newX = Math.max(0, e.clientX - startX);
      const newY = Math.max(0, e.clientY - startY);
      onUpdate(note, { x: newX, y: newY });
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUpGlobal);
  };

  const handleMouseUp = () => {
    // This is now handled in the global mouse up handler
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
      titleRef.current?.blur();
    } else if (e.key === 'Escape') {
      setEditingTitle(note.title);
      titleRef.current?.blur();
    }
  };

  const handleContentKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setEditingContent(note.content);
      (e.target as HTMLTextAreaElement).blur();
    }
    // Allow Ctrl+Enter or Cmd+Enter to save
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSave();
      (e.target as HTMLTextAreaElement).blur();
    }
  };

  return (
    <div
      ref={noteRef}
      data-note-id={note.id}
      className={`relative w-64 min-h-48 max-w-[calc(100vw-2rem)] p-4 rounded-lg border-2 transition-all duration-200 cursor-move select-none ${
        colorClassMap[note.color] || colorClassMap.yellow
      } ${
        isDragging
          ? 'scale-105 shadow-xl rotate-2 z-50'
          : 'hover:shadow-lg hover:scale-102'
      } ${hasChanges ? 'ring-2 ring-blue-300' : ''} sm:w-64`}
      style={{
        position: 'absolute',
        left: `${note.x}px`,
        top: `${note.y}px`,
        zIndex: isDragging ? 1000 : 1,
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={(e) => {
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
          clientX: touch.clientX,
          clientY: touch.clientY,
        }) as any;
        handleMouseDown(mouseEvent);
      }}
    >
      {/* Drag Handle */}
      <div className="absolute top-2 left-2 w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-move">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
          <circle cx="2" cy="2" r="1" />
          <circle cx="6" cy="2" r="1" />
          <circle cx="10" cy="2" r="1" />
          <circle cx="2" cy="6" r="1" />
          <circle cx="6" cy="6" r="1" />
          <circle cx="10" cy="6" r="1" />
          <circle cx="2" cy="10" r="1" />
          <circle cx="6" cy="10" r="1" />
          <circle cx="10" cy="10" r="1" />
        </svg>
      </div>

      {/* Color Picker Button */}
      <div className="absolute top-2 right-2" ref={colorPickerRef}>
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="w-6 h-6 rounded-full border-2 border-slate-300 hover:scale-110 transition-transform"
          style={{ backgroundColor: `var(--${note.color}-200)` }}
          title="Change color"
          type="button"
        />
        
        {showColorPicker && (
          <div className="color-picker absolute top-8 right-0 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-20 min-w-max">
            <div className="flex flex-wrap gap-2 max-w-32">
              {colors.map((color) => (
                <div key={color} className="relative">
                  <button
                    onClick={() => handleColorChange(color)}
                    className={`w-8 h-8 rounded-full border-2 hover:scale-110 transition-all duration-200 shadow-sm ${
                      color === note.color 
                        ? 'border-slate-600 ring-2 ring-slate-300 ring-offset-1' 
                        : 'border-slate-300 hover:border-slate-400'
                    }`}
                    style={{ backgroundColor: `var(--${color}-200)` }}
                    title={color.charAt(0).toUpperCase() + color.slice(1)}
                    type="button"
                  />
                  {color === note.color && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-slate-700">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Title Input */}
      <input
        ref={titleRef}
        value={editingTitle}
        onChange={(e) => setEditingTitle(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleTitleKeyDown}
        placeholder="Note title..."
        className="w-full bg-transparent font-semibold text-lg text-slate-800 placeholder-slate-400 border-none outline-none focus:ring-0 mt-8 mb-2 px-0"
        style={{ cursor: isDragging ? 'move' : 'text' }}
      />

      {/* Content Textarea */}
      <TextareaAutosize
        minRows={3}
        maxRows={10}
        value={editingContent}
        onChange={(e) => setEditingContent(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleContentKeyDown}
        placeholder="Start typing..."
        className="w-full bg-transparent text-slate-700 placeholder-slate-400 border-none outline-none resize-none focus:ring-0 px-0"
        style={{ cursor: isDragging ? 'move' : 'text' }}
      />

      {/* Action Buttons */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-200">
        <div className="flex items-center space-x-2">
          {hasChanges && (
            <button
              onClick={handleSave}
              className="text-xs text-green-600 hover:text-green-700 font-medium"
              type="button"
            >
              Save
            </button>
          )}
          <span className="text-xs text-slate-400">
            {(() => {
              if (!note.createdAt) return 'Just now';
              const date = new Date(note.createdAt);
              return isNaN(date.getTime()) ? 'Just now' : date.toLocaleDateString();
            })()}
          </span>
        </div>
        
        <button
          onClick={() => onDelete(note)}
          className="text-xs text-red-500 hover:text-red-700 transition-colors p-1"
          type="button"
          title="Delete note"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}