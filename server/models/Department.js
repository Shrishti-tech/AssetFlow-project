import mongoose from 'mongoose'

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  code: { type: String, required: true, trim: true, uppercase: true, unique: true, maxlength: 12 },
  manager: { type: String, required: true, trim: true, maxlength: 100 },
  parentDepartment: { type: String, trim: true, maxlength: 100, default: '' },
  location: { type: String, required: true, trim: true, maxlength: 100 },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
}, { timestamps: true })

export const Department = mongoose.model('Department', departmentSchema)
