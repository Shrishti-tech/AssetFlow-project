import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  code: { type: String, required: true, trim: true, uppercase: true, unique: true, maxlength: 12 },
  description: { type: String, required: true, trim: true, maxlength: 500 },
  specificFieldValue: { type: String, trim: true, maxlength: 200, default: '' },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
}, { timestamps: true })

export const Category = mongoose.model('Category', categorySchema)
