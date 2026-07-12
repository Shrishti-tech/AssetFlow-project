import mongoose from 'mongoose'

const assetTag = () => `AF-${Date.now().toString().slice(-8)}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`

const assetSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 150 },
  category: { type: String, required: true, trim: true, maxlength: 100 },
  assetTag: { type: String, required: true, unique: true, immutable: true, default: assetTag, uppercase: true, trim: true },
  serialNumber: { type: String, trim: true, maxlength: 150, unique: true, sparse: true },
  acquisitionDate: { type: Date },
  acquisitionCost: { type: Number, min: 0 },
  condition: { type: String, enum: ['Excellent', 'Good', 'Fair', 'Needs repair'], default: 'Good' },
  location: { type: String, required: true, trim: true, maxlength: 150 },
  department: { type: String, required: true, trim: true, maxlength: 100 },
  image: { type: String, default: '' },
  documents: [{ type: String, trim: true }],
  shared: { type: Boolean, default: false },
  status: { type: String, enum: ['available', 'allocated', 'unassigned', 'maintenance', 'retired', 'disposed', 'lost'], default: 'unassigned' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true })

assetSchema.index({ name: 'text', assetTag: 'text', serialNumber: 'text', department: 'text' })

export const Asset = mongoose.models.Asset || mongoose.model('Asset', assetSchema)
