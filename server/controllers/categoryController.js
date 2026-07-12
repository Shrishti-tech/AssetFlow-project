import { Category } from '../models/Category.js'

const fields = ['name', 'code', 'description', 'status']
const values = (body) => Object.fromEntries(fields.map((field) => [field, body[field]]))

export async function listCategories(req, res, next) { try { const filter = req.query.search ? { $or: ['name', 'code', 'description'].map((field) => ({ [field]: { $regex: req.query.search, $options: 'i' } })) } : {}; const categories = await Category.find(filter).sort({ name: 1 }); res.json({ categories }) } catch (error) { next(error) } }
export async function getCategory(req, res, next) { try { const category = await Category.findById(req.params.id); if (!category) return res.status(404).json({ message: 'Category not found.' }); res.json({ category }) } catch (error) { next(error) } }
export async function createCategory(req, res, next) { try { const category = await Category.create(values(req.body)); res.status(201).json({ category }) } catch (error) { next(error) } }
export async function updateCategory(req, res, next) { try { const category = await Category.findByIdAndUpdate(req.params.id, values(req.body), { new: true, runValidators: true }); if (!category) return res.status(404).json({ message: 'Category not found.' }); res.json({ category }) } catch (error) { next(error) } }
export async function deleteCategory(req, res, next) { try { const category = await Category.findByIdAndDelete(req.params.id); if (!category) return res.status(404).json({ message: 'Category not found.' }); res.status(204).end() } catch (error) { next(error) } }
