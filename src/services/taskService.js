const { v4: uuidv4 } = require('uuid');

let tasks = [];

function getAllTasks() {
  return tasks;
}

function createTask(title) {
  if (!title || title.trim() === '') {
    throw new Error('Title is required');
  }

  const task = {
    id: uuidv4(),
    title,
    completed: false,
    createdAt: new Date()
  };

  tasks.push(task);
  return task;
}

function clearTasks() {
  tasks = [];
}

module.exports = {
  getAllTasks,
  createTask,
  clearTasks
};
