const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
const authRoutes = require('./routes/authRoutes');
<<<<<<< Updated upstream
const courseRoutes = require('./routes/courseRoutes');
const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const questionRoutes = require('./routes/questionRoutes');
const connectionRoutes = require('./routes/connectionRoutes');
=======
const chatRoutes = require('./routes/chatRoutes');
const voiceRoutes = require('./routes/voiceRoutes');
>>>>>>> Stashed changes

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

<<<<<<< Updated upstream
// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
=======
// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173', // Update this to match your frontend port
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

>>>>>>> Stashed changes
app.use(express.json());

// Mount routes
app.use('/api/auth', authRoutes);
<<<<<<< Updated upstream
app.use('/api/courses', courseRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/questions', questionRoutes);
=======
app.use('/api/chat', chatRoutes);
app.use('/api/voice', voiceRoutes);
>>>>>>> Stashed changes

// Basic route
app.get('/', (req, res) => {
    res.send('API is running...');
});

<<<<<<< Updated upstream
// Error handler middleware (should be last)
app.use(errorHandler);
=======
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});
>>>>>>> Stashed changes

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 