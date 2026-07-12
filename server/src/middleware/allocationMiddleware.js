const fail = (res, message) => res.status(400).json({ message })
const isPastDate = (value) => {
  if (!value) return false
  const date = new Date(value)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Number.isNaN(date.getTime()) || date < today
}

export const validateAllocationPayload = (req, res, next) => {
  const { asset, assignedTo, expectedReturnDate } = req.body
  if (!asset || !assignedTo) return fail(res, 'Select both an asset and an employee.')
  if (isPastDate(expectedReturnDate)) return fail(res, 'Expected return date cannot be before today.')
  next()
}

export const validateTransferPayload = (req, res, next) => {
  const { allocation, toUser, reason, transferDate } = req.body
  if (!allocation || !toUser || !reason?.trim()) return fail(res, 'Select an allocation and new holder, and enter a reason.')
  if (isPastDate(transferDate)) return fail(res, 'Transfer date cannot be before today.')
  next()
}

export const validateReturnPayload = (req, res, next) => {
  const { returnDate, returnCondition } = req.body
  if (!returnDate || !returnCondition) return fail(res, 'Return date and asset condition are required.')
  if (Number.isNaN(new Date(returnDate).getTime())) return fail(res, 'Enter a valid return date.')
  next()
}

export const requireAllocationAccess = (_req, _res, next) => next()

export default {
  validateAllocationPayload,
  validateTransferPayload,
  validateReturnPayload,
  requireAllocationAccess,
};
