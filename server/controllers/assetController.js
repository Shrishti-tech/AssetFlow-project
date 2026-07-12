import { Asset } from '../models/Asset.js'

const editableFields = ['name', 'category', 'serialNumber', 'acquisitionDate', 'acquisitionCost', 'condition', 'location', 'department', 'image', 'documents', 'shared', 'status']
const pick = (body) => Object.fromEntries(editableFields.filter((field) => body[field] !== undefined).map((field) => [field, field === 'status' && typeof body[field] === 'string' ? body[field].toLowerCase() : body[field]]))
const pagination = (query) => ({ page: Math.max(Number(query.page) || 1, 1), limit: Math.min(Math.max(Number(query.limit) || 20, 1), 100) })

export async function listAssets(req, res, next) {
  try {
    const { search = '', category, department, status } = req.query
    const filter = {}
    if (search) filter.$or = ['name', 'assetTag', 'serialNumber', 'department', 'location'].map((field) => ({ [field]: { $regex: search, $options: 'i' } }))
    if (category) filter.category = category
    if (department) filter.department = department
    if (status) filter.status = status
    const { page, limit } = pagination(req.query)
    const [assets, total] = await Promise.all([Asset.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).populate('createdBy', 'fullName email'), Asset.countDocuments(filter)])
    res.json({ assets, pagination: { page, limit, total, pages: Math.max(1, Math.ceil(total / limit)) } })
  } catch (error) { next(error) }
}

export async function getAsset(req, res, next) {
  try {
    const asset = await Asset.findById(req.params.id).populate('createdBy', 'fullName email')
    if (!asset) return res.status(404).json({ message: 'Asset not found.' })
    res.json({ asset })
  } catch (error) { next(error) }
}

export async function createAsset(req, res, next) {
  try {
    const asset = await Asset.create({ ...pick(req.body), createdBy: req.user._id })
    res.status(201).json({ asset })
  } catch (error) { next(error) }
}

export async function updateAsset(req, res, next) {
  try {
    const asset = await Asset.findByIdAndUpdate(req.params.id, pick(req.body), { new: true, runValidators: true })
    if (!asset) return res.status(404).json({ message: 'Asset not found.' })
    res.json({ asset })
  } catch (error) { next(error) }
}

export async function deleteAsset(req, res, next) {
  try {
    const asset = await Asset.findByIdAndDelete(req.params.id)
    if (!asset) return res.status(404).json({ message: 'Asset not found.' })
    res.status(204).end()
  } catch (error) { next(error) }
}
