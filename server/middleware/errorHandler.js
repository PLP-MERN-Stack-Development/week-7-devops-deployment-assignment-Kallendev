export const errorHandler = (error, req, res, next) => {
  console.error(error.stack);

  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(err => err.message);
    return res.status(400).json({
      message: 'Validation Error',
      errors
    });
  }

  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return res.status(400).json({
      message: `${field} already exists`
    });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({
      message: 'Invalid ID format'
    });
  }

  res.status(error.statusCode || 500).json({
    message: error.message || 'Internal Server Error'
  });
};