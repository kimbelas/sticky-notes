import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import Note from '../../../../models/Note';
import Room from '../../../../models/Room';

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI || !MONGO_URI.startsWith('mongodb')) {
  throw new Error('Invalid MONGO_URI in .env.local');
}

if (!mongoose.connections[0].readyState) {
  mongoose.connect(MONGO_URI, {
    dbName: 'NoteSpace',
  });
}

// Utility function to validate room code format
const isValidRoomCodeFormat = (code: string): boolean => {
  return /^[A-Z0-9]{6}$/.test(code);
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query;
  
  if (!code || typeof code !== 'string' || !isValidRoomCodeFormat(code)) {
    return res.status(400).json({ error: 'Invalid room code format' });
  }

  const roomCode = code.toUpperCase();

  try {
    // Verify room exists (or create if it doesn't for POST requests)
    let room = await Room.findOne({ code: roomCode });
    
    if (req.method === 'GET') {
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }

      // Update room activity
      await room.updateActivity();

      // Get all notes for this room
      const notes = await Note.find({ roomCode }).sort({ createdAt: -1 });
      return res.status(200).json({ notes });

    } else if (req.method === 'POST') {
      const { title, content, color = 'yellow', x = 0, y = 0 } = req.body;

      // Create room if it doesn't exist
      if (!room) {
        room = new Room({ 
          code: roomCode,
          createdAt: new Date(),
          lastActivity: new Date()
        });
        await room.save();
      } else {
        await room.updateActivity();
      }

      // Create new note
      const note = new Note({
        id: crypto.randomUUID(),
        roomCode,
        title: title || '',
        content: content || '',
        color,
        x: Number(x) || 0,
        y: Number(y) || 0,
        createdAt: new Date()
      });

      await note.save();
      return res.status(201).json({ note });

    } else if (req.method === 'PUT') {
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }

      const { noteId, title, content, color, x, y } = req.body;
      
      if (!noteId) {
        return res.status(400).json({ error: 'Note ID is required' });
      }

      // Update room activity
      await room.updateActivity();

      // Update note (only if it belongs to this room)
      const updateData: any = {};
      if (title !== undefined) updateData.title = title;
      if (content !== undefined) updateData.content = content;
      if (color !== undefined) updateData.color = color;
      if (x !== undefined) updateData.x = Number(x);
      if (y !== undefined) updateData.y = Number(y);

      const note = await Note.findOneAndUpdate(
        { id: noteId, roomCode },
        updateData,
        { new: true }
      );

      if (!note) {
        return res.status(404).json({ error: 'Note not found in this room' });
      }

      return res.status(200).json({ note });

    } else if (req.method === 'DELETE') {
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }

      const { noteId } = req.body;
      
      if (!noteId) {
        return res.status(400).json({ error: 'Note ID is required' });
      }

      // Update room activity
      await room.updateActivity();

      // Delete note (only if it belongs to this room)
      const result = await Note.deleteOne({ id: noteId, roomCode });
      
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Note not found in this room' });
      }

      return res.status(200).json({ success: true });

    } else {
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Room notes API error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}