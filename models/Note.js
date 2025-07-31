import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  roomCode: { 
    type: String, 
    required: true,
    length: 6,
    uppercase: true,
    match: /^[A-Z0-9]{6}$/
  },
  title: { type: String },
  content: { type: String },
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
  color: { type: String, default: 'yellow' },
  createdAt: { type: Date, default: Date.now },
});

// Compound index for efficient room-based queries
NoteSchema.index({ roomCode: 1, createdAt: -1 });

export default mongoose.models.Note || mongoose.model('Note', NoteSchema);
