const express = require('express');
const router = express.Router();
const taskService = require('../services/taskService');

router.get('/', (req, res) => {
  res.json(taskService.getAllTasks());
});

router.post('/', (req, res) => {
  try {
    const { title } = req.body;
    const task = taskService.createTask(title);
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
