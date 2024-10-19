const express = require('express');
const app = express();
const cron = require('node-cron');

const { sendEmailNotification } = require('./services/emailService');
const authRoutes = require('./routes/authRoutes'); // Authentication routes
const itemRoutes = require('./routes/itemRouters'); // Item management routes
const favoritesRoutes = require('./routes/favoritesRoutes');
const rentalRoutes=require('./routes/rentalRoutes');
const pickupPointsRoutes = require('./routes/pickUpPointsRoutes')

app.use(express.json()); // Middleware to parse JSON bodies



// Authentication routes
app.use('/api/auth', authRoutes);

// Item management routes
app.use('/api/items', itemRoutes); // New line to include item routes

app.use('/api/favorites', favoritesRoutes);

app.use('/api/rental', rentalRoutes);

app.use('/api/pickup', pickupPointsRoutes);

const testEmail = 'hajar.ihab@gmail.com'; // Replace with a valid email for testing
const testItemName = 'Sample Item';
const testRenterName = 'John Doe';
//sendEmailNotification(testEmail, testItemName, testRenterName, false);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

});
