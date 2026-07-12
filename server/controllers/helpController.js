import { SupportTicket } from '../models/SupportTicket.js'

const faqs = [
  { id: 'register-asset', question: 'How do I register an asset?', answer: 'Go to Assets → Register Asset, fill in the asset details (name, category, tag, location) and save. The asset becomes available for allocation immediately.' },
  { id: 'book-resource', question: 'How do I book a shared resource?', answer: 'Open Bookings → Book Resource, pick the resource and a time slot, then confirm. It will appear under Booking History.' },
  { id: 'return-asset', question: 'How do I return an allocated asset?', answer: 'Go to Allocation → Returns, select the active allocation, record the return condition and any damage notes, then submit.' },
  { id: 'raise-maintenance', question: 'How can I raise a maintenance request?', answer: 'Open Maintenance → Raise Request, describe the issue and set a priority, then submit. Track its progress from the Maintenance list.' },
  { id: 'approve-transfer', question: 'Who can approve transfers?', answer: 'Any user with allocation management access can review a transfer request under Allocation → Transfers and approve or reject it.' },
  { id: 'overdue-return', question: 'What happens when a return is overdue?', answer: 'AssetFlow automatically raises an overdue notification for the asset holder until the item is returned.' },
]

const guides = [
  { id: 'getting-started', title: 'Getting Started', icon: '📘', summary: 'A quick tour of the AssetFlow workspace.', steps: ['Sign in with your employee account', 'Use the sidebar to move between Assets, Allocation, Bookings, Maintenance and Reports', 'Check the dashboard for KPIs, notifications and recent activity'] },
  { id: 'asset-registration', title: 'Asset Registration', icon: '🗂️', summary: 'Add new assets to the inventory.', steps: ['Go to Assets → Register Asset', 'Fill in name, category, tag and location', 'Save to make it available for allocation'] },
  { id: 'asset-allocation', title: 'Asset Allocation', icon: '🔁', summary: 'Assign assets to employees.', steps: ['Go to Allocation → Allocate Asset', 'Choose an available asset and an active employee', 'Set an expected return date and confirm'] },
  { id: 'resource-booking', title: 'Resource Booking', icon: '📅', summary: 'Reserve shared resources for a time slot.', steps: ['Select Book Resource', 'Choose the resource and a time window', 'Confirm to add it to Booking History'] },
  { id: 'maintenance', title: 'Maintenance', icon: '🛠️', summary: 'Report and track asset issues.', steps: ['Click Raise Maintenance Request', 'Describe the problem and set a priority', 'Track progress from the Maintenance list'] },
  { id: 'audit-cycle', title: 'Audit Cycle', icon: '🧾', summary: 'Verify inventory accuracy.', steps: ['Go to Audit Cycle', "Confirm each asset's location and condition", 'Review the discrepancy report once complete'] },
  { id: 'reports', title: 'Reports', icon: '📊', summary: 'Analyze utilization and trends.', steps: ['Open Reports → Analytics', 'Filter by department, category or date range', 'Export the report for sharing'] },
]

const matches = (text, search) => !search || text.toLowerCase().includes(search)

export async function listFaqs(req, res, next) {
  try {
    const search = String(req.query.search || '').trim().toLowerCase()
    res.json({ faqs: faqs.filter((item) => matches(`${item.question} ${item.answer}`, search)) })
  } catch (error) { next(error) }
}

export async function listGuides(req, res, next) {
  try {
    const search = String(req.query.search || '').trim().toLowerCase()
    res.json({ guides: guides.filter((item) => matches(`${item.title} ${item.summary}`, search)) })
  } catch (error) { next(error) }
}

export async function createSupportTicket(req, res, next) {
  try {
    const { type, name, email, subject, description, module, priority, screenshotName } = req.body
    if (!name || !email || !subject || !description) return res.status(400).json({ message: 'Name, email, subject and description are required.' })
    const ticket = await SupportTicket.create({ type, name, email, subject, description, module, priority, screenshotName, raisedBy: req.user?._id })
    res.status(201).json({ ticket })
  } catch (error) { next(error) }
}
