import { Department } from '../models/Department.js'
import { User } from '../models/User.js'

const fields = ['name', 'code', 'manager', 'parentDepartment', 'location', 'status']
const values = (body) => Object.fromEntries(fields.map((field) => [field, body[field]]))

export async function listDepartments(req, res, next) {
  try {
    const filter = req.query.search ? { $or: ['name', 'code', 'manager', 'location'].map((field) => ({ [field]: { $regex: req.query.search, $options: 'i' } })) } : {}
    const departments = await Department.find(filter).sort({ name: 1 }).lean()
    const memberCounts = await User.aggregate([{ $match: { department: { $in: departments.map((item) => item.name) } } }, { $group: { _id: '$department', count: { $sum: 1 } } }])
    const counts = Object.fromEntries(memberCounts.map((item) => [item._id, item.count]))
    res.json({ departments: departments.map((item) => ({ ...item, members: counts[item.name] || 0 })) })
  } catch (error) { next(error) }
}
export async function getDepartment(req, res, next) { try { const department = await Department.findById(req.params.id); if (!department) return res.status(404).json({ message: 'Department not found.' }); res.json({ department }) } catch (error) { next(error) } }
export async function createDepartment(req, res, next) { try { const department = await Department.create(values(req.body)); res.status(201).json({ department }) } catch (error) { next(error) } }
export async function updateDepartment(req, res, next) { try { const department = await Department.findByIdAndUpdate(req.params.id, values(req.body), { new: true, runValidators: true }); if (!department) return res.status(404).json({ message: 'Department not found.' }); res.json({ department }) } catch (error) { next(error) } }
export async function deleteDepartment(req, res, next) { try { const department = await Department.findByIdAndDelete(req.params.id); if (!department) return res.status(404).json({ message: 'Department not found.' }); res.status(204).end() } catch (error) { next(error) } }
