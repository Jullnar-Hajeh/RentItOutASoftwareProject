# RentItOut API

RentItOut isa platform where users can rent out everyday items they own but don't use frequently, such as tools, sports equipment, electronics,party supplies, and more. The goal is to create a circular economy that encourages sharing and
reduces the need for people to purchase items they only need occasionally.


## Table of Contents
- [Technologies Used](#technologies-used)
- [External Api and libraries](#external-api-and-libraries)
- [Folders](#folders)
- [Features](#features)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Vision](#vision)

---

## Technologies Used
- **Node.js**: Backend runtime for handling asynchronous requests.
- **Express.js**: Simplifies REST API creation.
- **MySQL (MariaDB)**: Database for use CRUD operations.
- **Postman**: API building,testing and documintation tool.
- **Git**:Version Control System.
  
## External Api and libraries:
- **Vonage**: Used for sending SMS notifications.
- **pdfkit**: for creating pdf document.
- **Nodemailer**: to send mails.
- **PayPal**: to execute payment by paypal.
- **The IPGeolocation API**: provides geographical details, including latitude and longitude, based on an IP address. This enables calculations of the distance between two locations and allows for visualization of these locations on a map.

## Folders
  ![Screenshot 2024-11-02 193330](https://github.com/user-attachments/assets/a7298605-4b34-4e75-9a98-11baad8e1ec9)


## Features
- **User Management**: Register, update profiles,delete profile,search, and manage roles (Admin/User).
- **User Privacy and Data Security**: Implement stringent privacy and security measures to protect users' data.
- **Admin Management**: the admin can delete users,search for user by name,retrieve all users,and show the dashboard.
- **item**:enables users to manage rental items efficiently. Users can retrieve all items, search for specific rentals, and perform CRUD operations adding, editing, or deleting items securely with authentication. 
  The feature also allows users to check item availability and access reviews, including filtering by rating, helping renters make informed decisions.
- **favorites**:The Favorites feature allows users to manage their preferred items conveniently. Users can add items to their favorites for easy access later, remove items they no longer wish to keep as favorites, and retrieve a list of all their favorite items. This feature enhances the user experience by enabling quick access to preferred rentals, making it easier to revisit or book items of interest.
- **Rental**: The rental feature of the RentItOut API facilitates seamless rental management for both renters and owners. It allows authenticated users to request rentals, view their rental requests as owner and renter, and manage incoming requests as owners, including approving or declining them.Additionally, renters can return rented items, while owners can track rented items. This structured approach enhances the overall rental experience, ensuring clear communication and efficient management between parties.
- **Damage Reporting**: Renters can report item damages, which notifies the owner.
- **Pdf**:when the owner approve the rental request the platform will send a pdf file by email to renter has details about the rental.
- **Notifications**: Real-time notifications for owners and renters,including SMS updates to notify the owner by damge report,and Email to notify renter and owner for overdue rentals.
- **Discount and Loyalty Management**: Offers discounts based on user loyalty, with a two-tier system (silver and gold) based on rental frequency.
- **Payment**:payment feature enables users and administrators to manage and track financial transactions efficiently. Key routes allow users to view pending payments, execute individual or bulk payments (payAll), and check received payments. Administrators can track platform revenue, while integration with PayPal supports secure payment processing, with options to capture, cancel, and finalize transactions. Additionally, the feature includes a route to view pending
- **Logistics: Delivery and Pickup**:The delivery method allows users to request the delivery of items directly to their specified location,The pickup method enables users to arrange for items to be collected from designated pickup points. Users can view available pickup locations, and nearest pickup points, add new points, and manage existing ones. This functionality empowers users to choose convenient locations for item retrieval, enhancing flexibility and efficiency in the rental process.
- **ChatBot**:The Chatbot feature utilizes Dialogflow to provide users with instant answers to common questions regarding the rental process,and another many processes.
- **Review**:The Reviews feature allows users to add reviews for rental items and view existing reviews based on the item’s serial number.

  ## Getting Started
  To get started with CommuniCraft API, follow these steps:
   -  1- Clone the repository:https://github.com/Jullnar-Hajeh/RentItOutASoftwareProject.git.
   -  2- Install dependencies: npm install.
   - 3- Configure environment variables.
   - 4- Run the application: npm start.

## API Documentation
[Postman_Documentation](https://documenter.getpostman.com/view/38698558/2sAY52bKCK)

## Vision
The vision for the RentItOut API is to facilitate a sustainable sharing economy where users can easily rent everyday items they seldom use. We aim to enhance resource sharing, reduce waste, and create a seamless rental experience that prioritizes user engagement and security. Through innovative features and loyalty incentives, we empower users to make informed decisions, fostering a community that values convenience and sustainability.
