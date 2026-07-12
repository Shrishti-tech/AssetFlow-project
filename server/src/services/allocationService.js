import { Allocation } from '../models/Allocation.js'
import { AllocationHistory } from '../models/AllocationHistory.js'
import { Asset } from '../models/Asset.js'
import { TransferRequest } from '../models/TransferRequest.js'
import { User } from '../../models/User.js'
import { Notification } from '../models/Notification.js'
import notificationService, { activityLogService } from './notificationService.js'

const problem = (message, status = 400) => Object.assign(new Error(message), { status })
const populateAllocation = (query) => query.populate('asset', 'name assetTag status department').populate('assignedTo', 'fullName email department').populate('assignedBy', 'fullName email')
const history = (allocation, action, user, details = {}) => AllocationHistory.create({ allocation, action, performedBy: user?._id || user || null, details })
const asObject = (allocation) => {
  const item = allocation.toObject ? allocation.toObject() : allocation
  const overdue = item.status === 'active' && item.expectedReturnDate && new Date(item.expectedReturnDate) < new Date()
  return { ...item, isOverdue: Boolean(overdue), displayStatus: overdue ? 'overdue' : item.status }
}

async function createOverdueNotifications() {
  const overdue = await Allocation.find({ status: 'active', expectedReturnDate: { $lt: new Date() } }).populate('asset', 'name assetTag').populate('assignedTo', 'fullName')
  await Promise.all(overdue.map((item) => Notification.updateOne(
    { relatedModule: 'Allocation', relatedId: item._id, title: 'Asset Return Overdue' },
    { $setOnInsert: { user: item.assignedTo?._id, relatedModule: 'Allocation', relatedId: item._id, title: 'Asset Return Overdue', message: `${item.asset?.name || 'An asset'} (${item.asset?.assetTag || ''}) is overdue for return.`, type: 'Asset', priority: 'High' } },
    { upsert: true },
  )))
}

export const allocationService = {
  async getOptions() {
    const [assets, employees] = await Promise.all([
      Asset.find({ status: { $in: ['available', 'allocated'] } }).select('name assetTag status department location').sort({ name: 1 }),
      User.find({ status: 'Active' }).select('fullName email department').sort({ fullName: 1 }),
    ])
    return { assets, employees, departments: [...new Set(employees.map((employee) => employee.department).filter(Boolean))].sort() }
  },

  async list(query = {}) {
    await createOverdueNotifications()
    const filter = {}
    if (query.department) filter.department = query.department
    if (query.status && query.status !== 'overdue') filter.status = query.status
    if (query.status === 'overdue') filter.expectedReturnDate = { $lt: new Date() }
    if (query.allocationDate) filter.allocatedAt = { $gte: new Date(`${query.allocationDate}T00:00:00`), $lt: new Date(`${query.allocationDate}T23:59:59.999`) }
    if (query.returnDate) filter.expectedReturnDate = { $gte: new Date(`${query.returnDate}T00:00:00`), $lt: new Date(`${query.returnDate}T23:59:59.999`) }
    const records = await populateAllocation(Allocation.find(filter).sort({ createdAt: -1 }))
    const search = String(query.search || '').trim().toLowerCase()
    return records.map(asObject).filter((item) => !search || [item.asset?.assetTag, item.asset?.name, item.assignedTo?.fullName].some((value) => String(value || '').toLowerCase().includes(search)))
  },

  async getById(id) {
    const item = await populateAllocation(Allocation.findById(id))
    return item ? asObject(item) : null
  },

  async create(data, user, ipAddress) {
    const [asset, employee] = await Promise.all([Asset.findById(data.asset), User.findById(data.assignedTo)])
    if (!asset) throw problem('Asset not found.', 404)
    if (!employee || employee.status !== 'Active') throw problem('Select an active employee.')
    const activeAllocation = await Allocation.findOne({ asset: asset._id, status: 'active' }).populate('assignedTo', 'fullName')
    if (activeAllocation) {
      const holder = activeAllocation.assignedTo?.fullName || 'another employee'
      const error = problem(`${asset.name} (${asset.assetTag}) is currently held by ${holder}.`, 409)
      error.conflict = { allocationId: activeAllocation._id, assetTag: asset.assetTag, assetName: asset.name, currentHolder: holder }
      throw error
    }
    if (asset.status !== 'available') throw problem('This asset is not available for allocation.')
    const allocation = await Allocation.create({ asset: asset._id, assignedTo: employee._id, assignedBy: user._id, department: data.department || employee.department, location: data.location || asset.location, expectedReturnDate: data.expectedReturnDate, notes: data.notes, status: 'active' })
    asset.status = 'allocated'
    await asset.save()
    await history(allocation._id, 'allocated', user, { assetTag: asset.assetTag, employee: employee.fullName, expectedReturnDate: allocation.expectedReturnDate })
    await notificationService.create({ user: employee._id, title: 'Asset Assigned', message: `${asset.name} (${asset.assetTag}) has been assigned to you.`, type: 'Asset', priority: 'Medium', relatedModule: 'Allocation', relatedId: allocation._id })
    await activityLogService.log({ user: user._id, action: 'Asset Allocated', module: 'Allocation', resourceId: allocation._id, description: `Allocated ${asset.name} (${asset.assetTag}) to ${employee.fullName}.`, ipAddress })
    return this.getById(allocation._id)
  },

  async update(id, data, user) {
    const allowed = ['expectedReturnDate', 'department', 'location', 'notes']
    const changes = Object.fromEntries(allowed.filter((key) => data[key] !== undefined).map((key) => [key, data[key]]))
    const allocation = await Allocation.findByIdAndUpdate(id, changes, { new: true, runValidators: true })
    if (allocation) await history(allocation._id, 'updated', user, changes)
    return allocation ? this.getById(allocation._id) : null
  },

  async remove(id) {
    const allocation = await Allocation.findByIdAndDelete(id)
    if (allocation) await AllocationHistory.deleteMany({ allocation: allocation._id })
    return allocation
  },

  async returnAllocation(id, data, user, ipAddress) {
    const allocation = await Allocation.findById(id)
    if (!allocation) return null
    if (allocation.status === 'returned') throw problem('This allocation has already been returned.')
    allocation.status = 'returned'
    allocation.returnedAt = data.returnDate || new Date()
    allocation.returnCondition = data.returnCondition
    allocation.damageNotes = data.damageNotes || ''
    await allocation.save()
    const asset = await Asset.findByIdAndUpdate(allocation.asset, { status: 'available' })
    await history(allocation._id, 'returned', user, { returnDate: allocation.returnedAt, condition: allocation.returnCondition, damageNotes: allocation.damageNotes })
    await notificationService.create({ user: allocation.assignedTo, title: 'Asset Returned', message: `${asset?.name || 'The asset'} (${asset?.assetTag || ''}) return has been recorded.`, type: 'Asset', priority: 'Low', relatedModule: 'Allocation', relatedId: allocation._id })
    await activityLogService.log({ user: user._id, action: 'Asset Returned', module: 'Allocation', resourceId: allocation._id, description: `${asset?.name || 'Asset'} (${asset?.assetTag || ''}) was returned.`, ipAddress })
    return this.getById(allocation._id)
  },

  async requestTransfer(data, user, ipAddress) {
    const allocation = await Allocation.findById(data.allocation)
    if (!allocation || allocation.status !== 'active') throw problem('Select an active allocation.')
    if (allocation.assignedTo.toString() === data.toUser) throw problem('The new holder must be different from the current holder.')
    const newHolder = await User.findById(data.toUser)
    if (!newHolder || newHolder.status !== 'Active') throw problem('Select an active new holder.')
    if (await TransferRequest.exists({ asset: allocation.asset, status: 'requested' })) throw problem('A transfer request is already awaiting approval.')
    const request = await TransferRequest.create({ asset: allocation.asset, requestedBy: user._id, fromUser: allocation.assignedTo, toUser: newHolder._id, fromDepartment: allocation.department, toDepartment: data.toDepartment || newHolder.department, reason: data.reason, transferDate: data.transferDate, status: 'requested' })
    await history(allocation._id, 'transfer_requested', user, { transferRequest: request._id, fromUser: allocation.assignedTo, toUser: newHolder._id, reason: data.reason })
    await notificationService.create({ user: newHolder._id, title: 'Transfer Requested', message: `A transfer request was raised to assign an asset to you.`, type: 'Asset', priority: 'Medium', relatedModule: 'TransferRequest', relatedId: request._id })
    await activityLogService.log({ user: user._id, action: 'Transfer Requested', module: 'Allocation', resourceId: request._id, description: `Transfer requested to ${newHolder.fullName}.`, ipAddress })
    return request
  },

  async approveTransfer(id, _data, user, ipAddress) {
    const request = await TransferRequest.findById(id)
    if (!request) return null
    if (request.status !== 'requested') throw problem('Only requested transfers can be approved.')
    const allocation = await Allocation.findOne({ asset: request.asset, assignedTo: request.fromUser, status: 'active' })
    if (!allocation) throw problem('The current holder no longer has this active allocation.')
    request.status = 'approved'
    request.reviewedAt = new Date()
    await request.save()
    await history(allocation._id, 'transfer_approved', user, { transferRequest: request._id })
    allocation.assignedTo = request.toUser
    allocation.department = request.toDepartment || allocation.department
    await allocation.save()
    request.status = 'completed'
    await request.save()
    await history(allocation._id, 'transferred', user, { transferRequest: request._id, toUser: request.toUser })
    await notificationService.create({ user: request.toUser, title: 'Transfer Approved', message: `Your asset transfer has been approved.`, type: 'Asset', priority: 'Medium', relatedModule: 'TransferRequest', relatedId: request._id })
    await activityLogService.log({ user: user._id, action: 'Transfer Approved', module: 'Allocation', resourceId: request._id, description: `Transfer of asset to a new holder approved.`, ipAddress })
    return request
  },

  async rejectTransfer(id, _data, user, ipAddress) {
    const request = await TransferRequest.findById(id)
    if (!request) return null
    if (request.status !== 'requested') throw problem('Only requested transfers can be rejected.')
    request.status = 'rejected'
    request.reviewedAt = new Date()
    await request.save()
    const allocation = await Allocation.findOne({ asset: request.asset, status: 'active' })
    if (allocation) await history(allocation._id, 'transfer_rejected', user, { transferRequest: request._id })
    await notificationService.create({ user: request.requestedBy, title: 'Transfer Rejected', message: `Your asset transfer request was rejected.`, type: 'Asset', priority: 'Medium', relatedModule: 'TransferRequest', relatedId: request._id })
    await activityLogService.log({ user: user._id, action: 'Transfer Rejected', module: 'Allocation', resourceId: request._id, description: `Transfer request rejected.`, ipAddress })
    return request
  },

  async listTransfers() {
    return TransferRequest.find().populate('asset', 'name assetTag').populate('fromUser toUser requestedBy', 'fullName email').sort({ createdAt: -1 })
  },

  async getHistory(allocationId) {
    const filter = allocationId ? { allocation: allocationId } : {}
    return AllocationHistory.find(filter).populate('performedBy', 'fullName email').populate({ path: 'allocation', populate: { path: 'asset', select: 'name assetTag' } }).sort({ createdAt: -1 })
  },

  async getDashboardSummary() {
    await createOverdueNotifications()
    const now = new Date(); const upcoming = new Date(); upcoming.setDate(now.getDate() + 7)
    const [assetsAvailable, assetsAllocated, pendingTransfers, upcomingReturns, overdueReturns] = await Promise.all([
      Asset.countDocuments({ status: 'available' }), Asset.countDocuments({ status: 'allocated' }), TransferRequest.countDocuments({ status: 'requested' }), Allocation.countDocuments({ status: 'active', expectedReturnDate: { $gte: now, $lte: upcoming } }), Allocation.countDocuments({ status: 'active', expectedReturnDate: { $lt: now } }),
    ])
    return { assetsAvailable, assetsAllocated, pendingTransfers, upcomingReturns, overdueReturns }
  },
}

export default allocationService
