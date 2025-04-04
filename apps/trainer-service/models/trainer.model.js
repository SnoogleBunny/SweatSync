const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.Mixed, // We will use ObjectID once we get a UserSchema
    ref: 'User', 
    required: true 
  },
  specialties: { 
    type: [String], 
    default: [] 
  },
  hourlyRate: { 
    type: Number, 
    min: 0 
  },
  availability: [{
    day: { 
      type: String, 
      enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] 
    },
    slots: [String] // e.g., ["09:00", "10:00"]
  }]
}, { timestamps: true });

module.exports = mongoose.model('Trainer', trainerSchema);