const { NotFoundError } = require('../../services/project.service');

const errorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }

  // Joi validation errors
  if (err.isJoi || (err.name === 'ValidationError' && err.details)) {
    return res.status(400).json({
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: err.details.map((detail) => ({
          field: detail.path ? detail.path.join('.') : '',
          message: detail.message
        }))
      }
    });
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).json({
      error: {
        message: 'Invalid project ID format',
        code: 'INVALID_ID'
      }
    });
  }

  // Mongoose ValidationError
  if (err.name === 'ValidationError' && err.errors) {
    const details = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message
    }));
    return res.status(400).json({
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details
      }
    });
  }

  // Custom NotFoundError
  if (err instanceof NotFoundError || err.statusCode === 404) {
    return res.status(404).json({
      error: {
        message: err.message,
        code: 'NOT_FOUND'
      }
    });
  }

  // Default 500
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message;

  res.status(err.statusCode || 500).json({
    error: {
      message,
      code: 'INTERNAL_ERROR'
    }
  });
};

module.exports = errorHandler;
