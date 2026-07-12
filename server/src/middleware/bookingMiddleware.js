export const validateBookingPayload = (req, _res, next) => {
  const { resource, employee, bookingDate, startTime, endTime } = req.body;

  if (!resource || !employee || !bookingDate || !startTime || !endTime) {
    return next(new Error("Missing required booking fields."));
  }

  next();
};

export const requireBookingAccess = (_req, _res, next) => {
  next();
};

export default {
  validateBookingPayload,
  requireBookingAccess,
};
