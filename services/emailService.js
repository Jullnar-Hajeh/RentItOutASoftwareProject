const nodemailer = require('nodemailer');

// Function to send email notifications
function sendEmailNotification(ownerEmail, itemName, renterName, isReturned) {
    console.log(`Preparing to send email to: ${ownerEmail}`);
    const transporter = nodemailer.createTransport({
        service: 'Gmail', // You can change this to your email service provider
        auth: {
            user: 'jullnarihab61@gmail.com', // Your email
            pass: 'tmff mcyf bpxs jvbg', // Your email password or an app password
        },
    });

    const subject = isReturned ? 'Item Returned Notification' : 'Item Not Returned Notification';
    const text = isReturned 
        ? `The item "${itemName}" has been returned by ${renterName}.`
        : `The item "${itemName}" has not been returned yet.`;

    const mailOptions = {
        from: 'jullnarihab61@gmail.com',
        to: ownerEmail,
        subject: subject,
        text: text,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.error('Error sending email:', error);
        }
        console.log('Email sent:', info.response);
    });
}

module.exports = { sendEmailNotification };
