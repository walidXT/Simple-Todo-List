const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const taskRoutes = require('./routes/tasks');
const projectRoutes = require('./routes/projects');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/todolist', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Error connecting to MongoDB:', err));

app.use('/api/tasks', taskRoutes);
app.use('/api/projects', projectRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});