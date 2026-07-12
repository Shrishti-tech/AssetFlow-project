import { Notification } from '../models/Notification.js'

export async function listNotifications(req, res, next) {
  try {
    const filter = req.user.role === 'Admin' ? {} : { user: req.user._id }
    res.json({ notifications: await Notification.find(filter).sort({ createdAt: -1 }).limit(30) })
  } catch (error) { next(error) }
}

export async function markRead(req, res, next) {
  try {
    const filter = req.user.role === 'Admin' ? { _id: req.params.id } : { _id: req.params.id, user: req.user._id }
    const notification = await Notification.findOneAndUpdate(filter, { read: true }, { new: true })
    if (!notification) return res.status(404).json({ message: 'Notification not found.' })
    res.json({ notification })
  } catch (error) { next(error) }
}
