const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes'); // Authentication routes
const itemRoutes = require('./routes/itemRouters'); // Item management routes
const favoritesRoutes = require('./routes/favoritesRoutes');

app.use(express.json()); // Middleware to parse JSON bodies

// Authentication routes
app.use('/api/auth', authRoutes);

// Item management routes
app.use('/api/items', itemRoutes); // New line to include item routes

app.use('/api/favorites', favoritesRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
