import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Adjust the path as needed

function AdminDashboard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', assignedTo: '', dueDate: '' });
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);
  const { logout } = useAuth();

  useEffect(() => {
    fetchTasks();
    fetchEmployees();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:4400/api/v1/tasks', {
        withCredentials: true
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to fetch tasks. Please try again later.');
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:4400/api/v1/employees', {
        withCredentials: true
      });
      console.log('Fetched employees:', response.data);
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setError('Failed to fetch employees. Please try again later.');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4400/api/v1/tasks', newTask, {
        withCredentials: true
      });
      setNewTask({ title: '', description: '', assignedTo: '', dueDate: '' });
      fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
      setError('Failed to create task. Please try again.');
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Logout
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Create New Task</h2>
        <form onSubmit={handleCreateTask} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            placeholder="Description"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            className="w-full p-2 border rounded"
            required
          ></textarea>
          <select
            value={newTask.assignedTo}
            onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Assign to</option>
            {employees.length > 0 ? (
              employees.map((employee) => (
                <option key={employee._id} value={employee._id}>
                  {employee.username}
                </option>
              ))
            ) : (
              <option disabled>No employees available</option>
            )}
          </select>
          <input
            type="date"
            value={newTask.dueDate}
            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Create Task
          </button>
        </form>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">All Tasks</h2>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task._id} className="bg-white p-4 rounded shadow">
              <h3 className="font-bold">{task.title}</h3>
              <p>{task.description}</p>
              <p>Assigned to: {task.assignedTo ? task.assignedTo.username : 'Unassigned'}</p>
              <p>Due date: {new Date(task.dueDate).toLocaleDateString()}</p>
              <p>Status: {task.status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;