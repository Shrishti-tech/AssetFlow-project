import bcrypt from 'bcryptjs'
import { User } from '../models/User.js'

const publicUser = (user) => ({ id: user._id, fullName: user.fullName, email: user.email, department: user.department, role: user.role, status: user.status, createdAt: user.createdAt })
const editableFields = ['fullName', 'email', 'department', 'role', 'status']
const roles = ['Admin', 'Asset Manager', 'Department Head', 'Employee']
const pick = (body) => Object.fromEntries(editableFields.filter((field) => body[field] !== undefined).map((field) => [field, field === 'email' ? body[field].toLowerCase() : body[field]]))

export async function listEmployees(req, res, next) {
  try {
    const { search = '', department, role, status, page = 1, limit = 20 } = req.query
    const filter = search ? { $or: [{ fullName: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }, { department: { $regex: search, $options: 'i' } }] } : {}
    if (department) filter.department = department
    if (role) filter.role = role
    if (status) filter.status = status
    const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100)
    const safePage = Math.max(Number(page) || 1, 1)
    const [employees, total] = await Promise.all([User.find(filter).sort({ fullName: 1 }).skip((safePage - 1) * safeLimit).limit(safeLimit), User.countDocuments(filter)])
    res.json({ employees: employees.map(publicUser), pagination: { page: safePage, limit: safeLimit, total, pages: Math.max(1, Math.ceil(total / safeLimit)) } })
  } catch (error) { next(error) }
}
export async function getEmployee(req, res, next) { try { const employee = await User.findById(req.params.id); if (!employee) return res.status(404).json({ message: 'Employee not found.' }); res.json({ employee: publicUser(employee) }) } catch (error) { next(error) } }
export async function createEmployee(req, res, next) { try { const { password } = req.body; if (!password || password.length < 8) return res.status(400).json({ message: 'A temporary password of at least 8 characters is required.' }); const data = pick(req.body); if (!data.fullName || !data.email || !data.department || !roles.includes(data.role || 'Employee')) return res.status(400).json({ message: 'Enter a name, email, department, and valid role.' }); if (await User.exists({ email: data.email })) return res.status(409).json({ message: 'An account with this email already exists.' }); const employee = await User.create({ ...data, password: await bcrypt.hash(password, 12) }); res.status(201).json({ employee: publicUser(employee) }) } catch (error) { next(error) } }
export async function updateEmployee(req, res, next) { try { const data = pick(req.body); if (data.role && !roles.includes(data.role)) return res.status(400).json({ message: 'Invalid role.' }); const employee = await User.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true }); if (!employee) return res.status(404).json({ message: 'Employee not found.' }); res.json({ employee: publicUser(employee) }) } catch (error) { next(error) } }
export async function deleteEmployee(req, res, next) { try { if (req.params.id === req.user._id.toString()) return res.status(400).json({ message: 'You cannot delete your own account.' }); const employee = await User.findByIdAndDelete(req.params.id); if (!employee) return res.status(404).json({ message: 'Employee not found.' }); res.status(204).end() } catch (error) { next(error) } }
