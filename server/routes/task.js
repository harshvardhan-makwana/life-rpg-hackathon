const express = require('express');
const { createTask, getTasks, completeTask } = require('../controller/taskController');
const auth = require('../middleware/auth');
const router = express.Router();

// All routes are protected
router.post('/', auth, createTask);
router.get('/', auth, getTasks);
router.put('/:id/complete', auth, completeTask);

module.exports = router;