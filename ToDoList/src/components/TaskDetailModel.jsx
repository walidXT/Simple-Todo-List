import React from 'react';
import { Modal, Box, Typography } from '@mui/material';

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

export default function TaskDetailsModal({ open, onClose, task }) {
  if (!task) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" component="h2" gutterBottom>
          Task Details
        </Typography>
        <Typography><strong>Code:</strong> {task.code}</Typography>
        <Typography><strong>Description:</strong> {task.description}</Typography>
        <Typography><strong>Task Time:</strong> {task.tasktime}</Typography>
        <Typography><strong>Project:</strong> {task.project}</Typography>
        <Typography><strong>Complete Date:</strong> {task.completeDate}</Typography>
        <Typography><strong>Status:</strong> {task.isDone ? 'Completed' : 'Active'}</Typography>
      </Box>
    </Modal>
  );
}