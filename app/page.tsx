'use client';
import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_NOTES,
  ADD_NOTE,
  UPDATE_NOTE,
  DELETE_NOTE,
} from '../src/graphql/queries';
import TextareaAutosize from 'react-textarea-autosize';
import { Note } from '../src/store/noteStore';

export default function Home() {
  const { data, loading, error, refetch } = useQuery(GET_NOTES);
  const [addNoteMutation] = useMutation(ADD_NOTE);
  const [updateNoteMutation] = useMutation(UPDATE_NOTE);
  const [deleteNoteMutation] = useMutation(DELETE_NOTE);

  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [selectedColor, setSelectedColor] = useState('yellow');

  const colors = ['yellow', 'red', 'green', 'blue', 'pink'];

  const colorClassMap: Record<string, string> = {
    yellow: 'bg-yellow-100 border-yellow-300',
    red: 'bg-red-100 border-red-300',
    green: 'bg-green-100 border-green-300',
    blue: 'bg-blue-100 border-blue-300',
    pink: 'bg-pink-100 border-pink-300',
  };

  const handleAddNote = async () => {
    if (!newTitle.trim() && !newContent.trim()) return;
    await addNoteMutation({
      variables: {
        input: {
          id: crypto.randomUUID(),
          title: newTitle,
          content: newContent,
          color: selectedColor,
        },
      },
    });
    setNewTitle('');
    setNewContent('');
    refetch();
  };

  const handleUpdateNote = async (
    note: Note,
    title: string,
    content: string,
    color: string
  ) => {
    await updateNoteMutation({
      variables: {
        input: {
          id: note.id,
          title,
          content,
          color,
        },
      },
    });
    refetch();
  };

  const handleDeleteNote = async (note: Note) => {
    await deleteNoteMutation({
      variables: { id: note.id },
    });
    refetch();
  };

  // Local state for editing notes
  const [editingNotes, setEditingNotes] = useState<
    Record<string, { title: string; content: string }>
  >({});

  // When user types, update local state
  const handleEditChange = (
    note: Note,
    field: 'title' | 'content',
    value: string
  ) => {
    setEditingNotes((prev) => ({
      ...prev,
      [note.id]: {
        ...prev[note.id],
        [field]: value,
      },
    }));
  };

  // When Save is clicked, call update mutation
  const handleSaveNote = async (note: Note) => {
    const edited = editingNotes[note.id] || {
      title: note.title,
      content: note.content,
    };
    await handleUpdateNote(note, edited.title, edited.content, note.color);
    setEditingNotes((prev) => {
      const { [note.id]: _, ...rest } = prev;
      return rest;
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading notes.</div>;

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">📝 Sticky Notes</h1>
      {/* Input Section */}
      <div className="mb-4 flex flex-col md:flex-row gap-2">
        <div className="flex flex-col flex-1">
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Note Title"
            className="p-2 border border-gray-300 rounded text-sm mb-2"
          />
          <TextareaAutosize
            minRows={2}
            maxRows={10}
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Note Content"
            className={`p-2 rounded shadow text-sm ${
              colorClassMap[selectedColor] || 'bg-yellow-100 border-yellow-300'
            }`}
          />
        </div>
        <div className="flex flex-col items-stretch">
          <select
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="p-2 rounded border mb-2"
          >
            {colors.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
          <button
            onClick={handleAddNote}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
          >
            Add
          </button>
        </div>
      </div>
      {/* Notes Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.notes.map((note: Note) => {
          const edited = editingNotes[note.id] || {
            title: note.title,
            content: note.content,
          };
          return (
            <div
              key={note.id}
              className={`relative p-4 rounded shadow ${
                colorClassMap[note.color] || 'bg-yellow-100 border-yellow-300'
              }`}
            >
              {/* Color Circles */}
              <div className="flex justify-end mb-3 space-x-1">
                {colors.map((c) => (
                  <button
                    key={c}
                    onClick={() =>
                      handleUpdateNote(note, note.title, note.content, c)
                    }
                    className={`w-5 h-5 gap-1 rounded-full border-2 shadow hover:scale-110 cursor-pointer transition-transform duration-150 ${colorClassMap[c]}`}
                    title={`Change to ${c}`}
                  />
                ))}
              </div>
              <input
                value={edited.title ?? ''}
                onChange={(e) =>
                  handleEditChange(note, 'title', e.target.value)
                }
                className="w-full font-bold bg-transparent text-lg mb-2 outline-none"
                placeholder="Title"
              />
              <TextareaAutosize
                minRows={2}
                maxRows={10}
                value={edited.content ?? ''}
                onChange={(e) =>
                  handleEditChange(note, 'content', e.target.value)
                }
                className="w-full bg-transparent"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleSaveNote(note)}
                  className="text-green-600 text-sm hover:underline"
                >
                  <span role="img" aria-label="save">
                    💾
                  </span>{' '}
                  Save
                </button>
                <button
                  onClick={() => handleDeleteNote(note)}
                  className="text-red-500 text-sm hover:underline"
                >
                  <span role="img" aria-label="delete">
                    🗑️
                  </span>{' '}
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
