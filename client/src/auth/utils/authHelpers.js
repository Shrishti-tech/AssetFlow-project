export const getErrorMessage = (error) => error.response?.data?.message || 'Unable to complete your request. Please try again.'
export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
