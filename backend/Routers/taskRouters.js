const express = require('express');
const router = express.Router();
const { getTasks, getAllTasks ,createTask ,updateTaskStatus , getEmployees} = require('../Controlers/taskController' );
const {user , isAuthenticated } = require('../middleware/authMiddleware');
const  {login ,signup}= require('../Controlers/authControllers');


router.post('/signup', signup);
router.post('/login',login);

//Protected Router
router.get('/GETTASK', isAuthenticated , user , getTasks);

router.get('/employee',isAuthenticated , user,  getEmployees); // test Api api is working

// Route for admin to create a new task
router.post('/tasks', isAuthenticated, user, createTask);

// Route for admin to get all tasks
router.get('/all', isAuthenticated, user, getAllTasks); 

// Route for employees to update task status
router.put('/:id', isAuthenticated, updateTaskStatus);


module.exports = router;