const express = require('express');
const projectController = require('../controllers/project.controller');
const validateRequest = require('../middlewares/validateRequest');
const { projectSchema } = require('../validators');

const router = express.Router();

router.post('/', validateRequest(projectSchema.create), projectController.create);
router.get('/', validateRequest(projectSchema.list), projectController.list);
router.get('/:id', validateRequest(projectSchema.getById), projectController.getById);
router.patch('/:id', validateRequest(projectSchema.update), projectController.update);
router.delete('/:id', validateRequest(projectSchema.remove), projectController.remove);

module.exports = router;
