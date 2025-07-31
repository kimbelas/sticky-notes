// app/api/resolvers.js
import Note from '../../models/Note';
import Room from '../../models/Room';

export const resolvers = {
  Query: {
    notes: async () => {
      return await Note.find({}).sort({ createdAt: -1 });
    },
    roomNotes: async (_, { roomCode }) => {
      if (!roomCode || !/^[A-Z0-9]{6}$/.test(roomCode)) {
        throw new Error('Invalid room code format');
      }
      
      // Update room activity if room exists
      const room = await Room.findOne({ code: roomCode.toUpperCase() });
      if (room) {
        await room.updateActivity();
      }
      
      return await Note.find({ roomCode: roomCode.toUpperCase() }).sort({ createdAt: -1 });
    },
    validateRoom: async (_, { code }) => {
      if (!code || !/^[A-Z0-9]{6}$/.test(code)) {
        throw new Error('Invalid room code format');
      }
      
      const room = await Room.findOne({ code: code.toUpperCase() });
      if (!room) {
        throw new Error('Room not found');
      }
      
      await room.updateActivity();
      return room;
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
    addRoomNote: async (_, { roomCode, input }) => {
      if (!roomCode || !/^[A-Z0-9]{6}$/.test(roomCode)) {
        throw new Error('Invalid room code format');
      }

      const upperRoomCode = roomCode.toUpperCase();
      
      // Create room if it doesn't exist
      let room = await Room.findOne({ code: upperRoomCode });
      if (!room) {
        room = new Room({ 
          code: upperRoomCode,
          createdAt: new Date(),
          lastActivity: new Date()
        });
        await room.save();
      } else {
        await room.updateActivity();
      }

      const note = new Note({
        id: crypto.randomUUID(),
        roomCode: upperRoomCode,
        title: input.title || '',
        content: input.content || '',
        x: input.x || 0,
        y: input.y || 0,
        color: input.color || 'yellow',
        createdAt: new Date()
      });
      
      await note.save();
      return note;
    },
    updateRoomNote: async (_, { roomCode, noteId, input }) => {
      if (!roomCode || !/^[A-Z0-9]{6}$/.test(roomCode)) {
        throw new Error('Invalid room code format');
      }

      const upperRoomCode = roomCode.toUpperCase();
      
      // Update room activity
      const room = await Room.findOne({ code: upperRoomCode });
      if (room) {
        await room.updateActivity();
      }

      const note = await Note.findOneAndUpdate(
        { id: noteId, roomCode: upperRoomCode }, 
        input, 
        { new: true }
      );
      
      if (!note) {
        throw new Error('Note not found in this room');
      }
      
      return note;
    },
    deleteRoomNote: async (_, { roomCode, noteId }) => {
      if (!roomCode || !/^[A-Z0-9]{6}$/.test(roomCode)) {
        throw new Error('Invalid room code format');
      }

      const upperRoomCode = roomCode.toUpperCase();
      
      // Update room activity
      const room = await Room.findOne({ code: upperRoomCode });
      if (room) {
        await room.updateActivity();
      }

      const result = await Note.deleteOne({ id: noteId, roomCode: upperRoomCode });
      return result.deletedCount > 0;
    },
    createRoom: async (_, { code }) => {
      let roomCode = code;
      
      // Generate code if not provided
      if (!roomCode) {
        do {
          roomCode = '';
          const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
          for (let i = 0; i < 6; i++) {
            roomCode += chars.charAt(Math.floor(Math.random() * chars.length));
          }
        } while (await Room.findOne({ code: roomCode }));
      } else {
        if (!/^[A-Z0-9]{6}$/.test(roomCode)) {
          throw new Error('Invalid room code format');
        }
        roomCode = roomCode.toUpperCase();
        
        // Check if room already exists
        const existing = await Room.findOne({ code: roomCode });
        if (existing) {
          throw new Error('Room already exists');
        }
      }

      const room = new Room({ 
        code: roomCode,
        createdAt: new Date(),
        lastActivity: new Date()
      });
      
      await room.save();
      return room;
    },
  },
};
