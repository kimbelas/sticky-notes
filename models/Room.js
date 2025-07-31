import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema({
  code: { 
    type: String, 
    required: true, 
    unique: true,
    length: 6,
    uppercase: true,
    match: /^[A-Z0-9]{6}$/
  },
  name: { type: String },
  createdAt: { type: Date, default: Date.now },
  lastActivity: { type: Date, default: Date.now },
});

// Update lastActivity when room is accessed
RoomSchema.methods.updateActivity = function() {
  this.lastActivity = new Date();
  return this.save();
};

export default mongoose.models.Room || mongoose.model('Room', RoomSchema);