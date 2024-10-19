// services/cronJob.js

const cron = require('node-cron');
const pool = require('../config/database'); // Correct path to the database
const { sendEmailNotification } = require('./sendEmail'); // Correct path to the sendEmail file

// Define your cron job
cron.schedule('* * * * *', () => {
    console.log('Checking for items that have not been returned...');

    const query = `
        SELECT 
            r.id AS rental_id, 
            r.start_date, 
            r.end_date, 
            r.item_id, 
            r.renter_id, 
            u.email AS owner_email, 
            i.name AS item_name, 
            u.name AS renter_name
        FROM 
            rental r
        JOIN 
            item i ON r.item_id = i.id
        JOIN 
            users u ON r.owner_id = u.userID
        WHERE 
            r.status = 'rented' AND r.end_date < NOW();
    `;

    pool.query(query, (err, results) => {
        if (err) {
            console.error('Error querying overdue rentals:', err);
            return;
        }

        console.log('Overdue rentals found:', results);

        results.forEach(rental => {
            console.log(`Sending email to: ${rental.owner_email}, Item: ${rental.item_name}, Renter: ${rental.renter_name}`);
            sendEmailNotification(rental.owner_email, rental.item_name, rental.renter_name, false);
        });

        console.log(`Checked ${results.length} items for overdue rentals.`);
    });
});
