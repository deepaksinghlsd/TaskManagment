const User = require("../models/Use");
const jwt = require("jsonwebtoken");
const Task = require("../models/Task");
const bcrypt = require("bcryptjs");
require("dotenv").config();


exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id });
    if (tasks.length === 0) {
      return res.json({ message: "Enjoy your day! No tasks assigned." });
    }
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo", "username");
    res.json(tasks);

   
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, dueDate ,  } = req.body;

    // Validate request body
    if (!title || !description || !assignedTo || !dueDate) {
      return res.status(400).json({ message: "Invalid request body" });
    }

    const newTask = new Task({
      title,
      description,
      assignedTo,
      createdBy:req.user.id,
      dueDate,
    });

    try {
      await newTask.validate();
    } catch (error) {
      console.error(error);
      const validationErrors = error.errors;
      const errorMessage = Object.keys(validationErrors)
        .map((key) => {
          return `${key} ${validationErrors[key].message}`;
        })
        .join(", ");
      return res
        .status(400)
        .json({ message: `Task validation failed: ${errorMessage}` });
    }

    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
