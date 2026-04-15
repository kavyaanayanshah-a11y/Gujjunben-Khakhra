import mongoose from 'mongoose';

const categorySchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  icon: { type: String, default: '📁' },
  description: { type: String, default: '' },
}, { timestamps: true });

// Force collection name to 'categories' (plural)
export default mongoose.model('Category', categorySchema, 'categories');