import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Adjust the path as needed

function EmployeeDashboard() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const { logout } = useAuth();

  useEffect(() => {
    fetchTasks();
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

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await axios.put(`http://localhost:4400/api/v1/tasks/${taskId}`, { status: newStatus }, {
        withCredentials: true
      });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
      setError('Failed to update task status. Please try again.');
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Employee Dashboard</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Logout
      </button>
      
      {error && <p className="text-red-500 mt-4">{error}</p>}

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Your Tasks</h2>
        {tasks.length === 0 ? (
          <p className="text-xl">Enjoy your day! No tasks assigned.</p>
        ) : (
          <div className="space-y-4">
            {tasks.map(task => (
              <div key={task._id} className="bg-white p-4 rounded shadow">
                <h3 className="font-bold">{task.title}</h3>
                <p>{task.description}</p>
                <p>Due date: {new Date(task.dueDate).toLocaleDateString()}</p>
                <p>Status: {task.status}</p>
                <div className="mt-2">
                  <select
                    value={task.status}
                    onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                    className="p-2 border rounded"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default EmployeeDashboard;