import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String },
  content: { type: String },
  color: { type: String, default: 'yellow' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Note || mongoose.model('Note', NoteSchema);
