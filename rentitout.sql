-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 20, 2024 at 05:39 PM
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
(1, 1, 1, '2024-10-03 09:27:50');

-- --------------------------------------------------------

--
-- Table structure for table `item`
--

CREATE TABLE `item` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  `price_per_day` decimal(10,2) NOT NULL,
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
(1, 1, 'Updated Lawn Mower', 'An updated powerful lawn mower.', 'Gardening', 12.00, 55.00, 160.00, 1250.00, '2024-10-01', '2024-12-31', 'available', '2024-10-03 08:01:51', '2024-10-19 19:27:14', 11),
(4, 1, 'Item Name', 'Description of the item', 'Category Name', 10.00, 60.00, 200.00, 800.00, '2024-10-15', '2024-11-15', 'available', '2024-10-10 21:11:28', '2024-10-10 21:11:28', 1),
(5, 3, 'Item Name', 'Item Description', 'Category', 10.00, 60.00, 200.00, 1000.00, '2024-10-10', '2024-12-31', 'available', '2024-10-10 21:53:57', '2024-10-10 21:53:57', 2);

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
(1, 1, 'Palestine Nablus Rafidia', 1);

--
-- Triggers `pickup_points`
--
DELIMITER $$
CREATE TRIGGER `before_insert_pickup_points` BEFORE INSERT ON `pickup_points` FOR EACH ROW BEGIN
  SET NEW.serial_number = (SELECT IFNULL(MAX(serial_number), 0) + 1 FROM pickup_points);
END
$$
DELIMITER ;

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
(8, 5, 3, '2024-10-15', '2024-10-20', 'returned', '2024-10-11 00:21:54', 3, NULL, 0.00, 0, NULL),
(10, 5, 3, '2024-08-01', '2024-08-02', 'rented', '2024-10-11 20:07:30', 3, 50.00, 0.00, 0, NULL),
(11, 5, 3, '2024-12-31', '2025-11-12', 'returned', '2024-10-11 20:28:17', 3, 2320.00, 0.00, 1, '2024-10-11 23:31:01'),
(12, 5, 3, '2024-10-01', '2024-10-02', 'returned', '2024-10-11 20:28:27', 3, 55.00, 45.00, 2, '2024-10-11 23:31:22');

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
  `pickup_id` int(11) DEFAULT NULL,
  `geographical_location` varchar(500) DEFAULT NULL,
  `serial_number` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rental_request`
--

INSERT INTO `rental_request` (`id`, `item_id`, `owner_id`, `renter_id`, `status`, `request_date`, `start_date`, `end_date`, `total_cost`, `pickup_id`, `geographical_location`, `serial_number`) VALUES
(2, 4, 1, 3, 'pending', '2024-10-11', '2024-10-15', '2024-10-20', NULL, NULL, NULL, NULL),
(3, 5, 3, 3, 'declined', '2024-10-11', '2024-10-15', '2024-10-20', 50.00, NULL, NULL, NULL),
(4, 4, 1, 3, 'pending', '2024-10-11', '2024-10-15', '2024-12-16', 600.00, NULL, NULL, NULL),
(20, 4, 1, 3, 'pending', '2024-10-11', '2024-10-15', '2024-10-20', 50.00, NULL, NULL, 1),
(21, 4, 1, 3, 'pending', '2024-10-11', '2024-10-15', '2024-10-20', 50.00, NULL, NULL, 2),
(22, 4, 1, 3, 'pending', '2024-10-11', '2024-10-15', '2024-10-20', 50.00, NULL, NULL, 3),
(23, 4, 1, 3, 'pending', '2024-10-11', '2024-10-15', '2024-10-20', 50.00, NULL, NULL, 4),
(24, 5, 3, 3, 'approved', '2024-10-11', '2024-10-15', '2024-10-20', 50.00, NULL, NULL, 5),
(25, 5, 3, 3, 'pending', '2024-10-11', '2024-10-15', '2024-10-20', 50.00, NULL, NULL, 6),
(26, 5, 3, 3, 'approved', '2024-10-11', '2024-12-31', '2025-11-12', 2320.00, NULL, NULL, 7),
(27, 5, 3, 3, 'approved', '2024-10-11', '2024-10-01', '2024-10-02', 10.00, NULL, NULL, 8),
(30, 1, 1, 4, 'pending', '2024-10-19', '2024-10-05', '2024-11-05', 196.00, NULL, NULL, 12);

--
-- Triggers `rental_request`
--
DELIMITER $$
CREATE TRIGGER `before_insert_rental_request` BEFORE INSERT ON `rental_request` FOR EACH ROW BEGIN
    SET NEW.serial_number = (SELECT IFNULL(MAX(serial_number), 0) + 1 FROM rental_request);
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `before_insert_rentalreq` BEFORE INSERT ON `rental_request` FOR EACH ROW BEGIN
    SET NEW.serial_number = (SELECT IFNULL(MAX(serial_number), 0) + 1 FROM item);
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `address` varchar(255) NOT NULL,
  `userID` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `telephone` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`address`, `userID`, `name`, `password`, `email`, `telephone`) VALUES
('123 Main St', 1, 'John Doe', '$2a$10$TW2sbPwWIArS0lRBEH6KWucdsRuhZUBas6j.fOWCiMsFA2QLcsZr6', 'john.doe@example.com', '1234567890'),
('123 Main St', 2, 'John Doe', '$2a$10$rMu3qw/C99KuFK0lGDWBme6teiwR2vrHMblnCAr8hQmUG2xG3sYE6', 'jullnar@example.com', '1234567890'),
('123 Main St, Anytown, USA', 3, 'jullanr haje', '$2a$10$PpLhqLZj1viwmIJebbBXcOt6bRqeCOjkYdIVA61T.eSmnjv7IYibO', 'hajar.ihab@gmail.com', '1234567890'),
('Nablus', 4, 'Shahd', '$2a$10$7J6rtDQrBvZTFXefh3IPqOQYLt/YALhny5V8WUShUjdzMKYS46Nyu', 'shahd@gmail.com', '0599299172');

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
  ADD KEY `fk_pickup_id` (`pickup_id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pickup_points`
--
ALTER TABLE `pickup_points`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `rental`
--
ALTER TABLE `rental`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `rental_request`
--
ALTER TABLE `rental_request`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`userID`),
  ADD CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `item` (`id`);

--
-- Constraints for table `item`
--
ALTER TABLE `item`
  ADD CONSTRAINT `item_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`userID`);

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `item` (`id`),
  ADD CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`renter_id`) REFERENCES `users` (`userID`);

--
-- Constraints for table `pickup_points`
--
ALTER TABLE `pickup_points`
  ADD CONSTRAINT `pickup_points_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`userID`);

--
-- Constraints for table `rental`
--
ALTER TABLE `rental`
  ADD CONSTRAINT `fk_item_id` FOREIGN KEY (`item_id`) REFERENCES `item` (`id`),
  ADD CONSTRAINT `fk_owner` FOREIGN KEY (`owner_id`) REFERENCES `users` (`userID`),
  ADD CONSTRAINT `fk_renter_id` FOREIGN KEY (`renter_id`) REFERENCES `users` (`userID`);

--
-- Constraints for table `rental_request`
--
ALTER TABLE `rental_request`
  ADD CONSTRAINT `rental_request_ibfk4` FOREIGN KEY (`pickup_id`) REFERENCES `pickup_points` (`id`),
  ADD CONSTRAINT `rental_request_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `item` (`id`),
  ADD CONSTRAINT `rental_request_ibfk_2` FOREIGN KEY (`owner_id`) REFERENCES `users` (`userID`),
  ADD CONSTRAINT `rental_request_ibfk_3` FOREIGN KEY (`renter_id`) REFERENCES `users` (`userID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
