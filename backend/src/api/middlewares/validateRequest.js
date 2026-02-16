const validateRequest = (schema) => {
  return (req, res, next) => {
    const errors = [];

    for (const [key, joiSchema] of Object.entries(schema)) {
      if (!joiSchema) continue;

      const { error, value } = joiSchema.validate(req[key], {
        abortEarly: false,
        stripUnknown: true
      });

      if (error) {
        errors.push(
          ...error.details.map((detail) => ({
            field: detail.path.join('.'),
            message: detail.message
          }))
        );
      } else {
        req[key] = value;
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        error: {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: errors
        }
      });
    }

    next();
  };
};

module.exports = validateRequest;
