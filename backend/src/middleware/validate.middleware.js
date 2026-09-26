const { ZodError } = require('zod');
const { ApiError } = require('../utils/ApiError');

const validate = (schema) => {
  return async (req, res, next) => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params
      });
      // Assign parsed/sanitized values back
      req.body = parsed.body || req.body;
      req.query = parsed.query || req.query;
      req.params = parsed.params || req.params;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.slice(1).join('.'),
          message: err.message
        }));
        next(ApiError.badRequest(formattedErrors[0]?.message || 'Validation failed', formattedErrors));
      } else {
        next(error);
      }
    }
  };
};

module.exports = { validate };
