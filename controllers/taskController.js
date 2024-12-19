const Task = require('../models/Task');

const createTask = async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;

    // Convert the dueDate to UTC before saving
    const localDueDate = new Date(dueDate);  // Local date received from the frontend
    const utcDueDate = new Date(localDueDate.toISOString());  // Convert to UTC

    const newTask = new Task({ title, description, status, dueDate: utcDueDate });
    const task = await newTask.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();

    // Convert each task's dueDate from UTC to local time zone
    const tasksWithLocalDate = tasks.map(task => {
      task.dueDate = new Date(task.dueDate).toLocaleString();  // Convert to local time
      return task;
    });

    res.status(200).json(tasksWithLocalDate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.dueDate = new Date(task.dueDate).toLocaleString();
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const { title, description, status, dueDate } = req.body;
    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;

   
    if (dueDate) {
      const localDueDate = new Date(dueDate);  
      task.dueDate = new Date(localDueDate.toISOString()); 
    }

    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    await task.deleteOne();
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
