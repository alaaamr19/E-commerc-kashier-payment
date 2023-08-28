module.exports = function makeError(name, message, statusCode) {
  const error = new Error(message);
  error.name = name || "ServerError"; // Default to 'ServerError' if name is not provided
  error.statusCode = statusCode || 500;
  return error;
};
