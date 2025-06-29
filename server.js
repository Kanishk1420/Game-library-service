const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Import routes
const gameRoutes = require('./routes/gameRoutes');
const { swaggerUi, swaggerSpec } = require('./swagger');

// Use routes
app.use('/api/games', gameRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Simple test route
app.get('/', (req, res) => {
  res.send('Video Game API is running');
});

// Set default response type to application/json
app.use((req, res, next) => {
  res.type('application/json');
  next();
});
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};

// Start server if not being imported for testing
if (process.env.NODE_ENV !== 'test') {
  // Connect to DB and start server when running normally
  connectDB().then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  });
}

// Export for testing
module.exports = { app, connectDB };



