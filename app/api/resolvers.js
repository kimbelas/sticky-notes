// app/api/resolvers.js
import Note from '../../models/Note';

export const resolvers = {
  Query: {
    notes: async () => {
      return await Note.find({}).sort({ createdAt: -1 });
    },
  },
  Mutation: {
    addNote: async (_, { input }) => {
      const note = new Note(input);
      await note.save();
      return note;
    },
    updateNote: async (_, { input }) => {
      const note = await Note.findOneAndUpdate({ id: input.id }, input, {
        new: true,
      });
      return note;
    },
    deleteNote: async (_, { id }) => {
      await Note.deleteOne({ id });
      return true;
    },
  },
};
