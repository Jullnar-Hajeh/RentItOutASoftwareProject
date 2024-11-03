const express = require('express');
const app = express();
const cron = require('node-cron');
const createInvoice = require('./services/pdf');
const dotenv=require('dotenv');

const router = express.Router();

const ProfileRoutes = require('./routes/profileRoutes'); 
const { sendEmailNotification } = require('./services/emailService');
const authRoutes = require('./routes/authRoutes'); // Authentication routes
const itemRoutes = require('./routes/itemRouters'); // Item management routes
const favoritesRoutes = require('./routes/favoritesRoutes');
const rentalRoutes=require('./routes/rentalRoutes');
const reviewRoutes=require('./routes/reviewRoutes');
const adminRoutes = require('./routes/adminRoutes');
const pickupPointsRoutes = require('./routes/pickupPointsRoutes')
const roleMiddleware = require("./middleware/roleMiddleware");
const isAdmin = require('./middleware/adminMiddleware');
const paymentRoutes = require('./routes/paymentRoutes')
const pool = require('./config/database');
const dialogflowWebhookController = require('./controllers/dialogflowWebhookController');
const notificationRoutes = require('./routes/notificationsRoutes');
app.use(express.json()); // Middleware to parse JSON bodies

app.use('/api/review', reviewRoutes);

// Authentication routes
app.use('/api/auth', authRoutes);

// Item management routes
app.use('/api/items', itemRoutes); // New line to include item routes

app.use('/api/favorites', favoritesRoutes);

app.use('/api/rental', rentalRoutes);
app.use('/api/admin', adminRoutes); 

app.use('/api/pickup', pickupPointsRoutes);

app.use('/api/payment', paymentRoutes);

app.use('/api/notifications', notificationRoutes);
// Profile Routes
app.use('/api/profile', ProfileRoutes);
app.use(router);
// ChatBot Routes
router.post('/api/ChatBot', dialogflowWebhookController);




function checkOverdueRentals() {
  const query = `
      SELECT r.id, r.item_id, r.renter_id, r.owner_id, r.end_date, i.name AS item_name, 
             renter.email AS renter_email, owner.email AS owner_email
      FROM rental r
      JOIN item i ON r.item_id = i.id
      JOIN users renter ON r.renter_id = renter.userID
      JOIN users owner ON r.owner_id = owner.userID
      WHERE r.status = 'rented' AND r.end_date < NOW() AND r.return_date IS NULL
  `;

  pool.query(query, (err, results) => {
      if (err) {
          console.error('Error querying database:', err);
          return;
      }

      // Log the results to check the data returned by the query
      console.log('Overdue Rentals:', results); // Add this to see if rentals are being fetched

      if (results.length === 0) {
          console.log('No overdue rentals found.');
          return; // Exit if no overdue rentals
      }

      results.forEach((rental) => {
          const { item_name, renter_email, owner_email } = rental;
          const renterName = 'Renter'; // Placeholder for renter's name if needed
          
          // Send email to the renter
          console.log(`Sending overdue email for item: ${item_name} to ${renter_email}`);
          sendEmailNotification(renter_email, item_name, renterName, false);

          // Send email to the owner
          console.log(`Sending overdue email to owner of item: ${item_name} to ${owner_email}`);
          sendEmailNotification(owner_email, item_name, renterName, false);
      });
  });
}

// Cron job to run every 24 minutes
cron.schedule('0 15 * * *', () => {
  console.log('Checking for overdue rentals...');
  checkOverdueRentals();
});


const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

});
