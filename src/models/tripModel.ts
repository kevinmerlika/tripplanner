import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  origin: String,
  destination: String,
  cost: Number,
  duration: Number,
  type: String,
  display_name: String,
});

export const TripModel = mongoose.model('Trip', tripSchema);
