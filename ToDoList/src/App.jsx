import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CssBaseline, Container, Typography, Box } from '@mui/material';
import TodoList from './components/TodoList';

function App() {
  return (
    <Router>
      <CssBaseline />
      <Box 
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#333',
          color: 'white',
          py: 3,
          mb: 3,
          textAlign: 'center'
        }}
      >
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom 
          sx={{
            fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
            fontWeight: 600,
            textTransform: 'uppercase',
          }}
        >
          Todo List
        </Typography>
      </Box>
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 4 }, py: { xs: 2, sm: 4 } }}>
        <Routes>
          <Route path="/" element={<TodoList />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
