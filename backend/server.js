require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/items', require('./routes/items'));
app.use('/api/contact', require('./routes/contact'));

// Root healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  res.status(err.status || 400).json({ msg: err.message || 'Kuch ghalat ho gaya' });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lostfound';

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server chal raha hai: http://localhost:${PORT} (http://127.0.0.1:${PORT})`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n⚠️ Port ${PORT} pehle se use mein hai (EADDRINUSE).`);
    console.error(`Port ko free karein ya process restart karein.\n`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
  }
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connect ho gaya:', MONGO_URI);
  })
  .catch((err) => {
    console.error('MongoDB connect nahi hua:', err.message);
  });

