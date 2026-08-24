/**
 * Standardized API response wrappers per requirement #34
 */
const sendSuccess = (res, data = {}, message = null, statusCode = 200) => {
  const payload = {
    success: true,
    ...(message && { message }),
    data
  };
  return res.status(statusCode).json(payload);
};

const sendError = (res, message = 'Internal Server Error', statusCode = 500, errors = null) => {
  const payload = {
    success: false,
    message,
    ...(errors && { errors })
  };
  return res.status(statusCode).json(payload);
};

module.exports = {
  sendSuccess,
  sendError
};
