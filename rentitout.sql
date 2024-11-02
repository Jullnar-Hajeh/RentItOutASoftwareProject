-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 26, 2024 at 11:02 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `rentitout`
--

-- --------------------------------------------------------

--
-- Table structure for table `favorites`
--

CREATE TABLE `favorites` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `favorites`
--

INSERT INTO `favorites` (`id`, `user_id`, `item_id`, `created_at`) VALUES
(1, 1, 1, '2024-10-03 06:27:50');

-- --------------------------------------------------------

--
-- Table structure for table `item`
--

CREATE TABLE `item` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `price_per_day` decimal(10,2) DEFAULT NULL,
  `price_per_week` decimal(10,2) DEFAULT NULL,
  `price_per_month` decimal(10,2) DEFAULT NULL,
  `price_per_year` decimal(10,2) DEFAULT NULL,
  `available_from` date DEFAULT NULL,
  `available_until` date DEFAULT NULL,
  `status` varchar(20) DEFAULT 'available',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `serial_number` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `item`
--

INSERT INTO `item` (`id`, `user_id`, `name`, `description`, `category`, `price_per_day`, `price_per_week`, `price_per_month`, `price_per_year`, `available_from`, `available_until`, `status`, `created_at`, `updated_at`, `serial_number`) VALUES
(1, 1, 'Updated Lawn Mower', 'An updated powerful lawn mower.', 'Gardening', 12.00, 55.00, 160.00, 1250.00, '2024-10-01', '2024-12-31', 'available', '2024-10-03 05:01:51', '2024-10-25 14:59:43', 1),
(4, 1, 'Item Name', 'Description of the item', 'Category Name', 10.00, 60.00, 200.00, 800.00, '2024-10-15', '2024-11-15', 'available', '2024-10-10 18:11:28', '2024-10-10 18:11:28', 2),
(5, 3, 'Item Name', 'Item Description', 'Category', 10.00, 60.00, 200.00, 1000.00, '2024-10-10', '2024-12-31', 'available', '2024-10-10 18:53:57', '2024-10-10 18:53:57', 3);

--
-- Triggers `item`
--
DELIMITER $$
CREATE TRIGGER `before_insert_item` BEFORE INSERT ON `item` FOR EACH ROW BEGIN
    SET NEW.serial_number = (SELECT IFNULL(MAX(serial_number), 0) + 1 FROM item);
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `item_id` int(11) DEFAULT NULL,
  `renter_id` int(11) DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `status` enum('unread','read') DEFAULT 'unread'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

CREATE TABLE `payment` (
  `payment_id` int(11) NOT NULL,
  `amount` float NOT NULL,
  `status` enum('pending','completed') NOT NULL DEFAULT 'pending',
  `method` enum('paypal','COD','Reflect') DEFAULT 'Reflect',
  `renter_id` int(11) NOT NULL,
  `owner_id` int(11) NOT NULL,
  `payment_type` varchar(45) NOT NULL DEFAULT 'basic',
  `rental_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pickup_points`
--

CREATE TABLE `pickup_points` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `location` varchar(255) NOT NULL,
  `serial_number` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pickup_points`
--

INSERT INTO `pickup_points` (`id`, `user_id`, `location`, `serial_number`) VALUES
(1, 1, '32.226326 35.228836', 1),
(2, 1, '32.220544 35.264976', 2),
(3, 1, '32.217996 35.260458', 3);

-- --------------------------------------------------------

--
-- Table structure for table `rental`
--

CREATE TABLE `rental` (
  `id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `renter_id` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` varchar(20) DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `owner_id` int(11) DEFAULT NULL,
  `total_cost` decimal(10,2) DEFAULT NULL,
  `late_fee` decimal(10,2) DEFAULT 0.00,
  `serial_number` int(11) NOT NULL,
  `return_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rental`
--

INSERT INTO `rental` (`id`, `item_id`, `renter_id`, `start_date`, `end_date`, `status`, `created_at`, `owner_id`, `total_cost`, `late_fee`, `serial_number`, `return_date`) VALUES
(8, 5, 3, '2024-10-15', '2024-10-20', 'returned', '2024-10-10 21:21:54', 3, NULL, 0.00, 1, NULL),
(10, 5, 3, '2024-08-01', '2024-08-02', 'rented', '2024-10-11 17:07:30', 3, 50.00, 0.00, 2, NULL),
(11, 5, 3, '2024-12-31', '2025-11-12', 'returned', '2024-10-11 17:28:17', 3, 2320.00, 0.00, 3, '2024-10-11 23:31:01'),
(12, 5, 3, '2024-10-01', '2024-10-02', 'returned', '2024-10-11 17:28:27', 3, 55.00, 45.00, 4, '2024-10-11 23:31:22');

--
-- Triggers `rental`
--
DELIMITER $$
CREATE TRIGGER `before_insert_rental` BEFORE INSERT ON `rental` FOR EACH ROW BEGIN
    SET NEW.serial_number = (SELECT IFNULL(MAX(serial_number), 0) + 1 FROM rental);
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `rental_request`
--

CREATE TABLE `rental_request` (
  `id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `owner_id` int(11) NOT NULL,
  `renter_id` int(11) NOT NULL,
  `status` enum('pending','approved','declined') DEFAULT 'pending',
  `request_date` date DEFAULT curdate(),
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `total_cost` decimal(10,2) DEFAULT NULL,
  `serial_number` int(11) DEFAULT NULL,
  `pickup_id` int(11) DEFAULT NULL,
  `geographical_location` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rental_request`
--

INSERT INTO `rental_request` (`id`, `item_id`, `owner_id`, `renter_id`, `status`, `request_date`, `start_date`, `end_date`, `total_cost`, `serial_number`, `pickup_id`, `geographical_location`) VALUES
(2, 4, 1, 3, 'pending', '2024-10-11', '2024-10-15', '2024-10-20', NULL, 1, NULL, NULL),
(3, 5, 3, 3, 'declined', '2024-10-11', '2024-10-15', '2024-10-20', 50.00, 2, NULL, NULL),
(4, 4, 1, 3, 'pending', '2024-10-11', '2024-10-15', '2024-12-16', 600.00, 3, NULL, NULL),
(20, 4, 1, 3, 'pending', '2024-10-11', '2024-10-15', '2024-10-20', 50.00, 4, NULL, NULL),
(21, 4, 1, 3, 'pending', '2024-10-11', '2024-10-15', '2024-10-20', 50.00, 5, NULL, NULL),
(22, 4, 1, 3, 'pending', '2024-10-11', '2024-10-15', '2024-10-20', 50.00, 6, NULL, NULL),
(23, 4, 1, 3, 'pending', '2024-10-11', '2024-10-15', '2024-10-20', 50.00, 7, NULL, NULL),
(24, 5, 3, 3, 'approved', '2024-10-11', '2024-10-15', '2024-10-20', 50.00, 8, NULL, NULL),
(25, 5, 3, 3, 'pending', '2024-10-11', '2024-10-15', '2024-10-20', 50.00, 9, NULL, NULL),
(26, 5, 3, 3, 'approved', '2024-10-11', '2024-12-31', '2025-11-12', 2320.00, 10, NULL, NULL),
(27, 5, 3, 3, 'approved', '2024-10-11', '2024-10-01', '2024-10-02', 10.00, 11, NULL, NULL),
(148, 1, 1, 4, 'pending', '2024-10-27', '2024-11-22', '2024-12-24', 208.00, 12, 3, NULL);

--
-- Triggers `rental_request`
--
DELIMITER $$
CREATE TRIGGER `before_insert_rental_request` BEFORE INSERT ON `rental_request` FOR EACH ROW BEGIN
    SET NEW.serial_number = (SELECT IFNULL(MAX(serial_number), 0) + 1 FROM rental_request);
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `transaction_id` int(11) NOT NULL,
  `payment_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `type` enum('platform_fee','owner_payment') DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userID` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `telephone` varchar(15) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `role` enum('Admin','User') DEFAULT 'User',
  `loyalty_card` enum('none','silver','gold') DEFAULT 'none',
  `loyalty_card_expiry` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userID`, `name`, `password`, `email`, `telephone`, `address`, `role`, `loyalty_card`, `loyalty_card_expiry`) VALUES
(1, 'John Doe', '$2a$10$TW2sbPwWIArS0lRBEH6KWucdsRuhZUBas6j.fOWCiMsFA2QLcsZr6', 'john.doe@example.com', '1234567890', 'Nablus (32.216663, 35.259006)', 'User', 'none', '2024-10-31'),
(2, 'John Doe', '$2a$10$rMu3qw/C99KuFK0lGDWBme6teiwR2vrHMblnCAr8hQmUG2xG3sYE6', 'jullnar@example.com', '1234567890', 'Ramallah (31.90376, 35.20342)', 'User', 'gold', '2024-11-20'),
(3, 'jullanr haje', '$2a$10$PpLhqLZj1viwmIJebbBXcOt6bRqeCOjkYdIVA61T.eSmnjv7IYibO', 'hajar.ihab@gmail.com', '1234567890', 'Ramallah (31.90376, 35.20342)', 'User', 'none', NULL),
(4, 'Shahd', '$2a$10$7J6rtDQrBvZTFXefh3IPqOQYLt/YALhny5V8WUShUjdzMKYS46Nyu', 'shahd@gmail.com', '0599299172', 'Ramallah (31.90376, 35.20342)', 'User', 'none', NULL),
(5, 'Ahmad Ali', '$2a$10$MtysrjMkRm4tOiOsoEvnXu0Sz6rpOM9urKb7Oz1bCLS2zJi525RAS', 'ahmadali@gmail.com', '0599887766', 'Ramallah (31.90376, 35.20342)', 'User', 'none', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `item_id` (`item_id`);

--
-- Indexes for table `item`
--
ALTER TABLE `item`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `serial_number` (`serial_number`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `item_id` (`item_id`),
  ADD KEY `renter_id` (`renter_id`);

--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`payment_id`),
  ADD KEY `fk_payment_1_idx` (`renter_id`),
  ADD KEY `fk_payment_owner_idx` (`owner_id`),
  ADD KEY `fk_payment_rental_idx` (`rental_id`);

--
-- Indexes for table `pickup_points`
--
ALTER TABLE `pickup_points`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `serial_number` (`serial_number`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `rental`
--
ALTER TABLE `rental`
  ADD PRIMARY KEY (`id`),
  ADD KEY `item_id_idx` (`item_id`),
  ADD KEY `renter_id_idx` (`renter_id`),
  ADD KEY `fk_owner` (`owner_id`);

--
-- Indexes for table `rental_request`
--
ALTER TABLE `rental_request`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `serial_number` (`serial_number`),
  ADD KEY `item_id` (`item_id`),
  ADD KEY `owner_id` (`owner_id`),
  ADD KEY `renter_id` (`renter_id`),
  ADD KEY `fk_rental_request_pickup_idx` (`pickup_id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`transaction_id`),
  ADD KEY `payment_id` (`payment_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userID`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `favorites`
--
ALTER TABLE `favorites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `item`
--
ALTER TABLE `item`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `pickup_points`
--
ALTER TABLE `pickup_points`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `rental`
--
ALTER TABLE `rental`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=70;

--
-- AUTO_INCREMENT for table `rental_request`
--
ALTER TABLE `rental_request`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=149;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `transaction_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `item` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `item`
--
ALTER TABLE `item`
  ADD CONSTRAINT `item_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `item` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`renter_id`) REFERENCES `users` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `payment`
--
ALTER TABLE `payment`
  ADD CONSTRAINT `fk_payment_owner` FOREIGN KEY (`owner_id`) REFERENCES `users` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_payment_rental` FOREIGN KEY (`rental_id`) REFERENCES `rental` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_payment_renter` FOREIGN KEY (`renter_id`) REFERENCES `users` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `pickup_points`
--
ALTER TABLE `pickup_points`
  ADD CONSTRAINT `fk_pickup_points_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `rental`
--
ALTER TABLE `rental`
  ADD CONSTRAINT `fk_item_id` FOREIGN KEY (`item_id`) REFERENCES `item` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_owner` FOREIGN KEY (`owner_id`) REFERENCES `users` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_renter_id` FOREIGN KEY (`renter_id`) REFERENCES `users` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `rental_request`
--
ALTER TABLE `rental_request`
  ADD CONSTRAINT `fk_rental_request_pickup` FOREIGN KEY (`pickup_id`) REFERENCES `pickup_points` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `rental_request_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `item` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `rental_request_ibfk_2` FOREIGN KEY (`owner_id`) REFERENCES `users` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `rental_request_ibfk_3` FOREIGN KEY (`renter_id`) REFERENCES `users` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`payment_id`) REFERENCES `payment` (`payment_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
