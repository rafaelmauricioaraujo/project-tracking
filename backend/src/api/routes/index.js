const express = require('express');
const projectRoutes = require('./project.routes');

const router = express.Router();

router.use('/projects', projectRoutes);

module.exports = router;
