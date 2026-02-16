const { projectService } = require('../../services/project.service');

const projectController = {
  async create(req, res, next) {
    try {
      const project = await projectService.create(req.body);
      res.status(201).json(project);
    } catch (error) {
      next(error);
    }
  },

  async list(req, res, next) {
    try {
      const result = await projectService.list(req.query);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const project = await projectService.getById(req.params.id);
      res.status(200).json(project);
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const project = await projectService.update(req.params.id, req.body);
      res.status(200).json(project);
    } catch (error) {
      next(error);
    }
  },

  async remove(req, res, next) {
    try {
      await projectService.remove(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
};

module.exports = projectController;
