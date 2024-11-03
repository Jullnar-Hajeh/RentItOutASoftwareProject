// // const fs = require("fs");
// // const PDFDocument = require("pdfkit");
// // const path = require("path");  // Import path module

// // // Function to create the invoice
// // function createInvoice(invoice, path) {
// //     const doc = new PDFDocument({ size: "A4", margin: 50 });
// //     const writeStream = fs.createWriteStream(path);
// //     doc.pipe(writeStream);

// //     // Call the functions to generate the PDF content
// //     generateHeader(doc, invoice);
// //     generateInvoiceTable(doc, invoice);
// //     generateFooter(doc);

// //     // End the PDF document
// //     doc.end();

// //     // Log on finish or error
// //     writeStream.on('finish', () => {
// //         console.log('PDF created successfully:', path);
// //     });

// //     writeStream.on('error', (err) => {
// //         console.error('Error writing PDF:', err);
// //     });
// // }

// // // Function to generate header with logo, company name, and date
// // function generateHeader(doc, invoice) {
// //     // Current date
// //     const currentDate = new Date().toLocaleDateString();

// //     // Add logo at the top left corner
// //     doc.image(path.resolve(__dirname, "../logo.png"), 50, 45, { width: 100 });

// //     // Company name next to the logo
// //     doc.font("Helvetica-Bold")
// //        .fontSize(20)
// //        .text("Rent It Out Inc.", 140, 75) // Aligning next to logo
// //        .moveDown();

// //     // Date at the top right
// //     doc.font("Helvetica")
// //        .fontSize(10)
// //        .text(`Date: ${currentDate}`, 450, 50, { align: "right" });

// //     // Customer name below the header
// //     doc.font("Helvetica")
// //        .fontSize(12)
// //        .text(`Customer: ${invoice.customerName}`, 50, 130)
// //        .moveDown();
// // }

// // // Function to generate the invoice table
// // function generateInvoiceTable(doc, invoice) {
// //     const tableTop = 170;
// //     const itemHeight = 20;

// //     doc.font("Courier")  // Font for the table header and content
// //        .text("Item Description", 50, tableTop)
// //        .text("Amount", 400, tableTop);

// //     invoice.items.forEach((item, index) => {
// //         const y = tableTop + itemHeight * (index + 1);
// //         doc.text(item.description, 50, y);
// //         doc.text(item.amount.toString(), 400, y);
// //     });

// //     doc.text(`Total: ${invoice.total}`, 50, tableTop + itemHeight * (invoice.items.length + 1));
// // }

// // // Function to generate footer
// // function generateFooter(doc) {
// //     doc.font("Helvetica-Oblique")  // Footer font style
// //        .fontSize(10)
// //        .moveDown()
// //        .text("Thank you for your business!", { align: "center" });
// // }

// // // Export the createInvoice function
// // module.exports = createInvoice;


// const PDFDocument = require("pdfkit");
// const fs = require("fs");
// const path = require("path");
// const nodemailer = require("nodemailer");

// // Function to create the rental PDF
// function createRentalPDF(rentalData, filePath) {
//     const doc = new PDFDocument({ size: "A4", margin: 50 });
//     const writeStream = fs.createWriteStream(filePath);
//     doc.pipe(writeStream);

//     // PDF content
//     doc.fontSize(20).text("Rental Confirmation", { align: "center" });
//     doc.moveDown();

//     doc.fontSize(12)
//        .text(`Item: ${rentalData.itemName}`)
//        .text(`Description: ${rentalData.itemDescription}`)
//        .text(`Owner: ${rentalData.ownerName}`)
//        .text(`Owner Email: ${rentalData.ownerEmail}`)
//        .text(`Total Cost: $${rentalData.totalCost}`)
//        .text(`Rental Start Date: ${rentalData.startDate}`)
//        .text(`Rental End Date: ${rentalData.endDate}`);
    
//     doc.end();

//     return new Promise((resolve, reject) => {
//         writeStream.on("finish", resolve);
//         writeStream.on("error", reject);
//     });
// }

// // Configure nodemailer for sending the email
// const transporter = nodemailer.createTransport({
//     service: "Gmail",
//     auth: {
//         user: 'jullnarihab61@gmail.com', // Your email
//         pass: 'tmff mcyf bpxs jvbg', // Your email password or an app password
//     }
// });


// const PDFDocument = require('pdfkit');
// const fs = require('fs');
// const nodemailer = require('nodemailer');
// const path = require('path');



// function createInvoice(invoice, path) {
//     let doc = new PDFDocument({ margin: 50 });

//     doc.pipe(fs.createWriteStream(path));

//     doc.fontSize(20).text('Invoice', { align: 'center' });
//     doc.text(`Customer: ${invoice.customerName}`);
//     doc.text(`Total: ${invoice.total}`);

//     // Add more invoice details here
//     invoice.items.forEach(item => {
//         doc.text(`Item: ${item.description}, Amount: ${item.amount}`);
//     });

//     doc.end();
// }

// // Step 1: Add generateAndSendInvoice function to handle PDF generation and email sending
// function generateAndSendInvoice(rentalRequest, renter, item) {
//     // Step 2: Create the invoice object
//     const invoice = {
//         customerName: renter.name,
//         items: [
//             {
//                 description: item.description,
//                 amount: rentalRequest.total_cost
//             }
//         ],
//         total: rentalRequest.total_cost
//     };

//     // Path to store the PDF file temporarily
//     const invoicePath = path.join(__dirname, `../invoices/invoice-${rentalRequest.serial_number}.pdf`);

//     // Step 3: Generate the PDF invoice
//     createInvoice(invoice, invoicePath);

//     // Step 4: Send the email with the invoice PDF attached
//     sendInvoiceEmail(renter.email, invoicePath);
// }

// // Step 5: Function to send the invoice email with the PDF attachment
// function sendInvoiceEmail(renterEmail, invoicePath) {
//     // Create a transporter with Gmail credentials
//     const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//             user: 'jullnarihab61@gmail.com',
//             pass: 'tmff mcyf bpxs jvbg'
//         }
//     });

//     // Define the email options
//     const mailOptions = {
//         from: 'jullnarihab61@gmail.com',
//         to: renterEmail,
//         subject: 'Your Rental Invoice',
//         text: 'Please find attached your rental invoice. Thank you for renting with us!',
//         attachments: [
//             {
//                 filename: path.basename(invoicePath),
//                 path: invoicePath
//             }
//         ]
//     };

//     // Send the email with the PDF attached
//     transporter.sendMail(mailOptions, (err, info) => {
//         if (err) {
//             console.error('Error sending email:', err);
//         } else {
//             console.log('Email sent successfully:', info.response);
//         }
//     });
// }

// module.exports = { generateAndSendInvoice };






// const PDFDocument = require('pdfkit');
// const fs = require('fs');
// const nodemailer = require('nodemailer');
// const path = require('path');

// function createInvoice(invoice, invoicePath) {
//     return new Promise((resolve, reject) => {
//         let doc = new PDFDocument({ margin: 50 });
//         const writeStream = fs.createWriteStream(invoicePath);

//         doc.pipe(writeStream);

//         // Add content to the PDF
//         doc.fontSize(20).text('Invoice', { align: 'center' });
//         doc.text(`Customer: ${invoice.customerName}`);
//         doc.text(`Total: ${invoice.total}`);

//         invoice.items.forEach(item => {
//             doc.text(`Item: ${item.description}, Amount: ${item.amount}`);
//         });

//         // End and save the PDF
//         doc.end();

//         writeStream.on('finish', resolve);  // Resolve when writing is complete
//         writeStream.on('error', reject);    // Reject if an error occurs
//     });
// }

// async function generateAndSendInvoice(rentalRequest, renter, item) {
//     // Check for serial_number
//     if (!rentalRequest.serial_number) {
//         console.error('Error: rentalRequest.serial_number is undefined');
//         return;
//     }

//     // Create the invoice object
//     const invoice = {
//         customerName: renter.name,
//         items: [
//             {
//                 description: item.description,
//                 amount: rentalRequest.total_cost
//             }
//         ],
//         total: rentalRequest.total_cost
//     };

//     // Define the path for the PDF invoice
//     const invoicePath = path.join(__dirname, `../invoice-${rentalRequest.serial_number}.pdf`);

//     try {
//         // Generate the PDF invoice
//         await createInvoice(invoice, invoicePath);
//         console.log(`Invoice created at ${invoicePath}`);

//         // Send the invoice email
//         await sendInvoiceEmail(renter.email, invoicePath);
//     } catch (error) {
//         console.error('Error generating or sending invoice:', error);
//     }
// }

// function sendInvoiceEmail(renterEmail, invoicePath) {
//     return new Promise((resolve, reject) => {
//         const transporter = nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//                 user: 'jullnarihab61@gmail.com',
//                 pass: 'tmff mcyf bpxs jvbg'  // Note: Consider using environment variables for security
//             }
//         });

//         const mailOptions = {
//             from: 'jullnarihab61@gmail.com',
//             to: renterEmail,
//             subject: 'Your Rental Invoice',
//             text: 'Please find attached your rental invoice. Thank you for renting with us!',
//             attachments: [
//                 {
//                     filename: path.basename(invoicePath),
//                     path: invoicePath
//                 }
//             ]
//         };

//         transporter.sendMail(mailOptions, (err, info) => {
//             if (err) {
//                 console.error('Error sending email:', err);
//                 reject(err);
//             } else {
//                 console.log('Email sent successfully:', info.response);
//                 resolve(info);
//             }
//         });
//     });
// }

// module.exports = { generateAndSendInvoice };


const PDFDocument = require('pdfkit');
const fs = require('fs');
const nodemailer = require('nodemailer');
const path = require('path');



function createInvoice(invoice, invoicePath) {
    return new Promise((resolve, reject) => {
        let doc = new PDFDocument({ margin: 50 });
        const writeStream = fs.createWriteStream(invoicePath);

        doc.pipe(writeStream);

        // Set the font to Times New Roman for main content and Helvetica (or any other) for light text
        doc.font('Helvetica');

        // Add the logo, enlarged to 100 pixels wide
        doc.image(path.join(__dirname, '../logo.png'), 50, 45, { width: 100 });

        // Add the date at the top-right corner
        const today = new Date().toLocaleDateString(); // Format the date as desired
        doc.fontSize(12).text(`Date: ${today}`, 450, 50, { align: 'right' });

        // Add lighter font for company name text under the logo
        doc.font('Times-Roman').fillColor('gray').fontSize(18).text('Rent It Out Company', 160, 100);

        // Reset font and color for main invoice content and add vertical spacing
        doc.font('Courier').fillColor('black').fontSize(16);
        doc.moveDown(1.5); // Add extra vertical space

        // Invoice details section
        doc.text(`Customer: ${invoice.customerName}`, { lineGap: 8 });
        doc.text(`Total: ${invoice.total}`, { lineGap: 8 });

        // Itemized list of invoice items
        invoice.items.forEach(item => {
            doc.text(`Item: ${item.description}`, { lineGap: 8 });
        });

        // Add a thank you statement at the bottom
        doc.moveDown(2); // Add vertical space before the thank you statement
        doc.text('Thank you for your business!', { align: 'center', underline: false });

        // Add Arabic text below the thank you statement
        doc.font('Helvetica').fontSize(16).text('RentItOut.', { align: 'center', lineGap: 8 });

        // End and save the PDF
        doc.end();

        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
    });
}

// function createInvoice(invoice, invoicePath) {
//     return new Promise((resolve, reject) => {
//         let doc = new PDFDocument({ margin: 50 });
//         const writeStream = fs.createWriteStream(invoicePath);

//         doc.pipe(writeStream);

//         // Set the font to Times New Roman for main content and Helvetica (or any other) for light text
//         doc.font('serif');

//         // Add the logo, enlarged to 100 pixels wide
//         doc.image(path.join(__dirname, '../logo.png'), 50, 45, { width: 100 });

//         // Add the date at the top-right corner
//         const today = new Date().toLocaleDateString(); // Format the date as desired
//         doc.fontSize(12).text(`Date: ${today}`, 450, 50, { align: 'right' });

//         // Add lighter font for company name text under the logo
//         doc.font('Helvetica').fillColor('gray').fontSize(18).text('Rent It Out Company', 160, 100);

//         // Reset font and color for main invoice content and add vertical spacing
//         doc.font('Times-Roman').fillColor('black').fontSize(16);
//         doc.moveDown(1.5); // Add extra vertical space

//         // Invoice details section
//         doc.text(`Customer: ${invoice.customerName}`, { lineGap: 8 });
//         doc.text(`Total: ${invoice.total}`, { lineGap: 8 });

//         // Itemized list of invoice items
//         invoice.items.forEach(item => {
//             doc.text(`Item: ${item.description}, Amount: ${item.amount}`, { lineGap: 8 });
//         });

//         // End and save the PDF
//         doc.end();

//         writeStream.on('finish', resolve);
//         writeStream.on('error', reject);
//     });
// }





// function createInvoice(invoice, invoicePath) {
//     return new Promise((resolve, reject) => {
//         let doc = new PDFDocument({ margin: 50 });
//         const writeStream = fs.createWriteStream(invoicePath);

//         doc.pipe(writeStream);

//         // Set fonts
//         const fontPath = path.join(__dirname, 'assets', 'custom-font.ttf');  // Adjust path and font file as needed
//         doc.registerFont('Custom', fontPath);
//         doc.registerFont('Bold', 'Helvetica-Bold');

//         // Add Logo and Company Name
//         const logoPath = path.join(__dirname, '../logo.png');  // Adjust the path as per the new location
//   // Adjust path as needed

//         // Add logo image
//         doc.image(logoPath, 50, 50, { width: 50, height: 50 });
        
//         // Company Name text
//         doc.font('Bold').fontSize(20).text('Rent It Out Company', 120, 60, { align: 'left' });

//         // Add content to the PDF
//         doc.moveDown(2).fontSize(20).text('Invoice', { align: 'center' });
//         doc.font('Custom').fontSize(12);
//         doc.text(`Customer: ${invoice.customerName}`);
//         doc.text(`Total: ${invoice.total}`);

//         // Add items in invoice
//         invoice.items.forEach(item => {
//             doc.text(`Item: ${item.description}, Amount: ${item.amount}`);
//         });

//         // End and save the PDF
//         doc.end();

//         writeStream.on('finish', resolve);  // Resolve when writing is complete
//         writeStream.on('error', reject);    // Reject if an error occurs
//     });
// }

async function generateAndSendInvoice(rentalRequest, renter, item) {
    // Check for serial_number
    if (!rentalRequest.serial_number) {
        console.error('Error: rentalRequest.serial_number is undefined');
        return;
    }

    // Create the invoice object
    const invoice = {
        customerName: renter.name,
        items: [
            {
                description: item.description,
                
            }
        ],
        total: rentalRequest.total_cost
    };

    // Define the path for the PDF invoice
    const invoicePath = path.join(__dirname, `../invoice-${rentalRequest.serial_number}.pdf`);

    try {
        // Generate the PDF invoice
        await createInvoice(invoice, invoicePath);
        console.log(`Invoice created at ${invoicePath}`);

        // Send the invoice email
        await sendInvoiceEmail(renter.email, invoicePath);
    } catch (error) {
        console.error('Error generating or sending invoice:', error);
    }
}

function sendInvoiceEmail(renterEmail, invoicePath) {
    return new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'jullnarihab61@gmail.com',
                pass: 'tmff mcyf bpxs jvbg'  // Note: Consider using environment variables for security
            }
        });

        const mailOptions = {
            from: 'jullnarihab61@gmail.com',
            to: renterEmail,
            subject: 'Your Rental Invoice',
            text: 'Please find attached your rental invoice. Thank you for renting with us!',
            attachments: [
                {
                    filename: path.basename(invoicePath),
                    path: invoicePath
                }
            ]
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error('Error sending email:', err);
                reject(err);
            } else {
                console.log('Email sent successfully:', info.response);
                resolve(info);
            }
        });
    });
}

module.exports = { generateAndSendInvoice };


