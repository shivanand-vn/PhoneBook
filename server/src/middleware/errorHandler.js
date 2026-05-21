const errorHandler = (err, req, res, next) => {
  console.error('Error Handler Caught:', err.message, err.stack);

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';

  // Handle specific Mongoose errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(val => val.message).join(', ');
  } else if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value entered';
  } else if (err.name === 'CastError') {
    statusCode = 404;
    message = `Resource not found with id of ${err.value}`;
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

module.exports = errorHandler;
