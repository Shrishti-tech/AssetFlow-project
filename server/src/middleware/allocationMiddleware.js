export const validateAllocationPayload = (_req, _res, next) => {
  next();
};

export const requireAllocationAccess = (_req, _res, next) => {
  next();
};

export default {
  validateAllocationPayload,
  requireAllocationAccess,
};
