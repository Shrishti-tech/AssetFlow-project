import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 8, select: false },
  role: { type: String, enum: ['Admin', 'Asset Manager', 'Department Head', 'Employee'], default: 'Employee' },
  department: { type: String, trim: true, maxlength: 100, default: '' },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  passwordResetToken: { type: String, select: false },
  passwordResetExpires: { type: Date, select: false },
}, { timestamps: true })

export const User = mongoose.model('User', userSchema)
