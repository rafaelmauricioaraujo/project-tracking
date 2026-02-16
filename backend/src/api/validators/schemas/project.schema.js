const Joi = require('joi');
const { PROJECT_STATUS, PAGINATION } = require('../../../utils/constants');

const statusValues = Object.values(PROJECT_STATUS);

const projectSchema = {
  create: {
    body: Joi.object({
      name: Joi.string().trim().min(1).max(200).required(),
      clientName: Joi.string().trim().min(1).max(200).required(),
      status: Joi.string()
        .trim()
        .uppercase()
        .valid(...statusValues)
        .default(PROJECT_STATUS.ON_HOLD),
      startDate: Joi.date().iso(),
      endDate: Joi.date().iso()
    })
      .with('endDate', 'startDate')
      .custom((value, helpers) => {
        if (value.startDate && value.endDate && new Date(value.endDate) <= new Date(value.startDate)) {
          return helpers.error('custom.endDateAfterStart');
        }
        return value;
      })
      .messages({
        'custom.endDateAfterStart': '"endDate" must be greater than "startDate"',
        'object.with': '"endDate" requires "startDate" to be provided'
      })
  },

  update: {
    body: Joi.object({
      name: Joi.string().trim().min(1).max(200),
      clientName: Joi.string().trim().min(1).max(200),
      status: Joi.string()
        .trim()
        .uppercase()
        .valid(...statusValues),
      startDate: Joi.date().iso(),
      endDate: Joi.date().iso()
    }).min(1).messages({
      'object.min': 'At least one field must be provided for update'
    }),
    params: Joi.object({
      id: Joi.string().hex().length(24).required().messages({
        'string.hex': 'Invalid project ID format',
        'string.length': 'Invalid project ID format'
      })
    })
  },

  getById: {
    params: Joi.object({
      id: Joi.string().hex().length(24).required().messages({
        'string.hex': 'Invalid project ID format',
        'string.length': 'Invalid project ID format'
      })
    })
  },

  remove: {
    params: Joi.object({
      id: Joi.string().hex().length(24).required().messages({
        'string.hex': 'Invalid project ID format',
        'string.length': 'Invalid project ID format'
      })
    })
  },

  list: {
    query: Joi.object({
      status: Joi.string()
        .trim()
        .uppercase()
        .valid(...statusValues),
      search: Joi.string().trim().min(1),
      page: Joi.number().integer().min(1).default(PAGINATION.DEFAULT_PAGE),
      limit: Joi.number().integer().min(1).max(PAGINATION.MAX_LIMIT).default(PAGINATION.DEFAULT_LIMIT)
    })
  }
};

module.exports = projectSchema;
