const createError = require('http-errors');

module.exports = function handle404(req, res, next) {
  return next(createError(404, 'The requested resource could not be found'))
}

module.exports = function logErrors(error, req, res, next) {
  if (process.env.NODE_ENV === 'development') {
    console.error(error.stack)
  }
  return next(error)
}

module.exports = function handleErrors(error, req, res, next) {
  const statusCode = error.status || 500
  const statusMessage = error.message || 'Internal server error'
  res.status(statusCode).json({ statusCode, statusMessage })
}