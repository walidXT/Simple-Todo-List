import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, TextField, IconButton, Checkbox, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import TaskModal from './TaskModel';

const APIUrl = 'http://localhost:5000/api';

export default function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${APIUrl}/tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${APIUrl}/projects`);
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleAddOrEditTask = async (task) => {
    try {
      if (task._id) {
        await axios.put(`${APIUrl}/tasks/${task._id}`, task);
      } else {
        await axios.post(`${APIUrl}/tasks`, task);
      }
      fetchTasks();
      setOpenModal(false);
      setCurrentTask(null);
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`${APIUrl}/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleToggleTaskStatus = async (task) => {
    try {
      const updatedTask = { ...task, isDone: !task.isDone };
      await axios.put(`${APIUrl}/tasks/${task._id}`, updatedTask);
      fetchTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleAddProject = (newProject) => {
    setProjects([...projects, newProject]);
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await axios.delete(`${APIUrl}/projects/${projectId}`);
      setProjects(projects.filter(project => project._id !== projectId));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const groupTasksByDate = (tasks) => {
    return tasks.reduce((groups, task) => {
      const date = task.completeDate;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(task);
      return groups;
    }, {});
  };

  const filteredTasks = tasks.filter(task => 
    (task.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.completeDate.includes(searchTerm)) &&
    (filter === 'all' || (filter === 'complete' && task.isDone) || (filter === 'active' && !task.isDone))
  );

  const groupedTasks = groupTasksByDate(filteredTasks);

  const formatTaskTime = (tasktime) => {
    if (!tasktime) return '';
    const [hours, minutes] = tasktime.split(':');
    return `${hours}h ${minutes}m`;
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <Button
          sx={{borderRadius:'15px'}}
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setCurrentTask(null);
            setOpenModal(true);
          }}
        >
          Add Task
        </Button>
        <div style={{ display: 'flex', gap: '10px' }}>
          <TextField
            sx={{width:'150px'}}
            label="Search"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search"
          />
          <FormControl variant="outlined" style={{ minWidth: 120 }}>
            <InputLabel>Filter</InputLabel>
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              label="Filter"
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="complete">Complete Tasks</MenuItem>
              <MenuItem value="active">Active Tasks</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>

      {Object.entries(groupedTasks).map(([date, tasks]) => (
        <div key={date} style={{ marginBottom: '20px' }}>
          <Typography variant="h6">{date}</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Code</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Task Time</TableCell>
                  <TableCell>Project</TableCell>
                  <TableCell>Task Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task._id} sx={{ backgroundColor: task.isDone ? '#e8f5e9' : '#ffebee' }}>
                    <TableCell>{task.code}</TableCell>
                    <TableCell>{task.description}</TableCell>
                    <TableCell>{formatTaskTime(task.tasktime)}</TableCell>
                    <TableCell>{task.project}</TableCell>
                    <TableCell>
                      <Checkbox
                        checked={task.isDone}
                        onChange={() => handleToggleTaskStatus(task)}
                        color="primary"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton color="primary" sx={{marginRight:'15px'}} onClick={() => {
                        setCurrentTask(task);
                        setOpenModal(true);
                      }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDeleteTask(task._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      ))}

      <TaskModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setCurrentTask(null);
        }}
        onSave={handleAddOrEditTask}
        onAddProject={handleAddProject}
        onDeleteProject={handleDeleteProject}
        task={currentTask}
        projects={projects}
      />
    </div>
  );
}