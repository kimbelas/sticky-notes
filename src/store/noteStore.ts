import { create } from 'zustand';

export type Note = {
  id: string;
  title: string;
  content: string;
  color: string;
};

type NoteStore = {
  notes: Note[];
  addNote: (note: Note) => void;
  deleteNote: (note: Note) => void;
  updateNote: (
    note: Note,
    newTitle: string,
    newContent: string,
    newColor: string
  ) => void;
};

export const useNoteStore = create<NoteStore>((set) => ({
  notes: [],
  addNote: (note) =>
    set((state) => ({
      notes: [...state.notes, note],
    })),
  deleteNote: (note: Note) =>
    set((state) => ({
      notes: state.notes.filter((n: Note) => n.id !== note.id),
    })),
  updateNote: (note, newTitle, newContent, newColor) =>
    set((state) => ({
      notes: state.notes.map((n) =>
        n.id === note.id
          ? {
              ...n,
              title: newTitle,
              content: newContent,
              color: newColor ?? n.color,
            }
          : n
      ),
    })),
}));
