const Project = require('../models/Project');
const { PAGINATION } = require('../utils/constants');

class NotFoundError extends Error {
  constructor(message = 'Project not found') {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

const projectService = {
  async create(data) {
    const project = await Project.create(data);
    return project.toJSON();
  },

  async list(filters) {
    const {
      status,
      search,
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT
    } = filters;

    const query = {};

    if (status) {
      query.status = status.toUpperCase();
    }

    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [{ name: regex }, { clientName: regex }];
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      Project.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Project.countDocuments(query)
    ]);

    return {
      data: data.map((doc) => doc.toJSON()),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  },

  async getById(id) {
    const project = await Project.findById(id);
    if (!project) {
      throw new NotFoundError();
    }
    return project.toJSON();
  },

  async update(id, data) {
    const project = await Project.findById(id);
    if (!project) {
      throw new NotFoundError();
    }

    // Validate endDate against startDate (considering existing values)
    const newStartDate = data.startDate ? new Date(data.startDate) : project.startDate;
    const newEndDate = data.endDate ? new Date(data.endDate) : project.endDate;

    if (newStartDate && newEndDate && newEndDate <= newStartDate) {
      const error = new Error('Validation failed');
      error.name = 'ValidationError';
      error.isJoi = true;
      error.details = [
        {
          path: ['endDate'],
          message: '"endDate" must be greater than "startDate"'
        }
      ];
      throw error;
    }

    Object.assign(project, data);
    await project.save();
    return project.toJSON();
  },

  async remove(id) {
    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      throw new NotFoundError();
    }
  }
};

module.exports = { projectService, NotFoundError };
