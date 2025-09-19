const express = require('express');
const mongoose = require('mongoose');
const productRouter = require('./router/productRouter');

const app = express();

// Parse JSON bodies (application/json)
app.use(express.json());

// Parse URL-encoded bodies (for form-data)
app.use(express.urlencoded({ extended: true }));

// Serve routes
app.use('/api/product', productRouter);

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB is connected'))
  .catch(err => console.error('❌ MongoDB connection failed', err.message));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
