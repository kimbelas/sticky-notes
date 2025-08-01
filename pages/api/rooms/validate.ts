import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import Room from '../../../models/Room';

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI || !MONGO_URI.startsWith('mongodb')) {
  throw new Error('Invalid MONGO_URI in .env.local');
}

if (!mongoose.connections[0].readyState) {
  mongoose.connect(MONGO_URI, {
    dbName: 'NoteSpace',
  });
}

// Utility function to generate a random room code
const generateRoomCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Utility function to validate room code format
const isValidRoomCodeFormat = (code: string): boolean => {
  return /^[A-Z0-9]{6}$/.test(code);
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { code, createIfNotExists } = req.body;

    // Validate code format
    if (!code || !isValidRoomCodeFormat(code)) {
      return res.status(400).json({ 
        valid: false, 
        error: 'Room code must be 6 alphanumeric characters' 
      });
    }

    try {
      // Check if room exists
      let room = await Room.findOne({ code: code.toUpperCase() });

      if (!room && createIfNotExists) {
        // Create new room
        room = new Room({ 
          code: code.toUpperCase(),
          createdAt: new Date(),
          lastActivity: new Date()
        });
        await room.save();
      }

      if (room) {
        // Update room activity
        await room.updateActivity();
        return res.status(200).json({ 
          valid: true, 
          room: {
            code: room.code,
            name: room.name,
            createdAt: room.createdAt
          }
        });
      } else {
        return res.status(404).json({ 
          valid: false, 
          error: 'Room not found' 
        });
      }
    } catch (error) {
      console.error('Room validation error:', error);
      return res.status(500).json({ 
        valid: false, 
        error: 'Server error' 
      });
    }
  } else if (req.method === 'GET') {
    // Generate a new room code
    try {
      let newCode;
      let attempts = 0;
      
      do {
        newCode = generateRoomCode();
        const existing = await Room.findOne({ code: newCode });
        if (!existing) break;
        attempts++;
      } while (attempts < 10);

      if (attempts >= 10) {
        return res.status(500).json({ error: 'Unable to generate unique room code' });
      }

      return res.status(200).json({ code: newCode });
    } catch (error) {
      console.error('Room code generation error:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}