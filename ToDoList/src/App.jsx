import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CssBaseline, Container, Typography } from '@mui/material';
import TodoList from './components/TodoList';

function App() {
  return (
    <Router>
      <CssBaseline />
      <Container sx={{display:'grid',bgcolor:'#000',marginBottom:'15px'}}>
        <Typography variant="h2" component="h1" gutterBottom style={{color:'white' ,marginTop: '20px',display:'flex',justifyContent:'center' }}>
          Todo List 
        </Typography>
      </Container>
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={<TodoList />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;