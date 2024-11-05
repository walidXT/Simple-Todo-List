import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Box, TextField, Button, Typography, FormControl ,InputLabel ,Select ,MenuItem ,Grid ,IconButton } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

const ApiUrl = 'http://localhost:5000/api';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default function TaskModal({ open, onClose, onSave, task, projects, onAddProject, onDeleteProject }) {
  const [currentTask, setCurrentTask] = useState({
    code: '',
    description: '',
    tasktime: '',
    hours: '',
    minutes: '',
    project: '',
    completeDate: '',
    isDone: false,
  });
  const [newProject, setNewProject] = useState('');

  useEffect(() => {
    if (task) {
      const [hours, minutes] = task.tasktime ? task.tasktime.split(':') : ['', ''];
      setCurrentTask({
        ...task,
        hours: hours || '',
        minutes: minutes || '',
      });
    } else {
      setCurrentTask({
        code: '',
        description: '',
        tasktime: '',
        hours: '',
        minutes: '',
        project: '',
        completeDate: '',
        isDone: false,
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentTask({ ...currentTask, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const hours = parseInt(currentTask.hours) || 0;
    const minutes = parseInt(currentTask.minutes) || 0;
    const tasktime = hours || minutes ? `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}` : '';
    onSave({ ...currentTask, tasktime });
  };

  const handleAddProject = async () => {
    if (newProject.trim()) {
      try {
        const response = await axios.post(`${ApiUrl}/projects`, { name: newProject });
        onAddProject(response.data);
        setNewProject('');
      } catch (error) {
        console.error('Error adding new project:', error);
      }
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await axios.delete(`${ApiUrl}/projects/${projectId}`);
      onDeleteProject(projectId);
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" component="h2">
          {task ? 'Edit Task' : 'Add New Task'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Task Code"
            name="code"
            value={currentTask.code}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={currentTask.description}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={5}
            required
          />
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Hours"
                name="hours"
                type="number"
                value={currentTask.hours}
                onChange={handleChange}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Minutes"
                name="minutes"
                type="number"
                value={currentTask.minutes}
                onChange={handleChange}
                inputProps={{ min: 0, max: 59 }}
              />
            </Grid>
          </Grid>
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Project</InputLabel>
            <Select
              name="project"
              value={currentTask.project}
              onChange={handleChange}
            >
              {projects.map((project) => (
                <MenuItem key={project._id} value={project.name}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  {project.name}
                  <IconButton
                    color="error"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProject(project._id);
                    }}
                    sx={{ ml: 1 }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={8}>
              <TextField
                fullWidth
                label="New Project"
                value={newProject}
                onChange={(e) => setNewProject(e.target.value)}
              />
            </Grid>
            <Grid item xs={4}>
              <Button onClick={handleAddProject} variant="outlined" fullWidth>
                Add Project
              </Button>
            </Grid>
          </Grid>
          <TextField
            fullWidth
            label="Complete Date"
            name="completeDate"
            type="date"
            value={currentTask.completeDate}
            onChange={handleChange}
            margin="normal"
            required
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Button type="submit" variant="contained" style={{ marginTop: '20px' }}>
            {task ? 'Save' : 'Add Task'}
          </Button>
        </form>
      </Box>
    </Modal>
  );
}