import mongoose from 'mongoose'

const supportTicketSchema = new mongoose.Schema({
  type: { type: String, enum: ['issue', 'contact'], default: 'issue' },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  subject: { type: String, required: true, trim: true, maxlength: 150 },
  description: { type: String, required: true, trim: true, maxlength: 2000 },
  module: { type: String, trim: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  screenshotName: { type: String, trim: true },
  status: { type: String, enum: ['Open', 'In Progress', 'Resolved'], default: 'Open' },
  raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true })

export const SupportTicket = mongoose.models.SupportTicket || mongoose.model('SupportTicket', supportTicketSchema)
