CREATE DATABASE  IF NOT EXISTS `rentitoutschema` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `rentitoutschema`;
-- MySQL dump 10.13  Distrib 8.0.39, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: rentitoutschema
-- ------------------------------------------------------
-- Server version	8.0.39-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `favorites`
--

DROP TABLE IF EXISTS `favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorites` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `item_id` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `item_id` (`item_id`),
  CONSTRAINT `fk_favorites_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`userID`),
  CONSTRAINT `fk_favorites_2` FOREIGN KEY (`item_id`) REFERENCES `item` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorites`
--

LOCK TABLES `favorites` WRITE;
/*!40000 ALTER TABLE `favorites` DISABLE KEYS */;
INSERT INTO `favorites` VALUES (1,1,1,'2024-10-03 09:27:50');
/*!40000 ALTER TABLE `favorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `item`
--

DROP TABLE IF EXISTS `item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `category` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `price_per_day` decimal(10,2) NOT NULL,
  `price_per_week` decimal(10,2) DEFAULT NULL,
  `price_per_month` decimal(10,2) DEFAULT NULL,
  `price_per_year` decimal(10,2) DEFAULT NULL,
  `available_from` date DEFAULT NULL,
  `available_until` date DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_general_ci DEFAULT 'available',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `serial_number` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `serial_number` (`serial_number`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `fk_item_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`userID`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item`
--

LOCK TABLES `item` WRITE;
/*!40000 ALTER TABLE `item` DISABLE KEYS */;
INSERT INTO `item` VALUES (1,1,'Updated Lawn Mower','An updated powerful lawn mower.','Gardening',12.00,55.00,160.00,1250.00,'2024-10-01','2024-12-31','available','2024-10-03 08:01:51','2024-10-19 19:27:14',11),(4,1,'Item Name','Description of the item','Category Name',10.00,60.00,200.00,800.00,'2024-10-15','2024-11-15','available','2024-10-10 21:11:28','2024-10-10 21:11:28',1),(5,3,'Item Name','Item Description','Category',10.00,60.00,200.00,1000.00,'2024-10-10','2024-12-31','available','2024-10-10 21:53:57','2024-10-10 21:53:57',2),(6,5,'Lawn Mower','A powerful lawn mower for all your gardening needs.','Gardening',15.00,70.00,200.00,1000.00,'2024-11-01','2024-12-31','available','2024-10-23 17:09:55','2024-10-23 17:09:55',12),(7,5,'HyperX Cloud II Gaming Headset','A high-quality gaming headset with 7.1 surround sound and noise-canceling microphone.','Gaming',8.00,45.00,120.00,800.00,'2024-11-05','2025-01-10','available','2024-10-23 17:20:55','2024-10-23 17:20:55',13),(8,5,'GoPro HERO9 Black 4K Action Camera','Waterproof 4K action camera with HyperSmooth stabilization and 20MP photo capture.','Cameras & Photography',12.00,65.00,180.00,900.00,'2024-12-01','2025-02-28','available','2024-10-23 17:21:16','2024-10-23 17:21:16',14),(9,6,'GoPro HERO9 Black 4K Action Camera','Waterproof 4K action camera with HyperSmooth stabilization and 20MP photo capture.','Cameras & Photography',12.00,65.00,180.00,900.00,'2024-12-01','2025-02-28','available','2024-10-23 18:38:32','2024-10-23 18:38:32',15),(10,6,'Gaming Chair','Ergonomic gaming chair with lumbar support and adjustable armrests.','Furniture',10.00,50.00,150.00,800.00,'2024-11-15','2025-02-15','available','2024-10-23 19:21:13','2024-10-23 19:21:13',16),(11,6,'Mountain Bike','A durable mountain bike with 21-speed gears and dual suspension, perfect for off-road adventures.','Sports',20.00,100.00,300.00,1200.00,'2024-11-10','2025-05-10','available','2024-10-23 19:22:17','2024-10-23 19:22:17',17),(12,5,'Barbie doll house','Huge barbie dream house limited edition.','Toys',10.00,50.00,100.00,500.00,'2024-11-10','2025-05-10','available','2024-10-24 08:32:43','2024-10-24 08:32:43',18),(13,5,'Electric Blender','High-performance blender perfect for smoothies and soups.','Kitchen Appliances',5.00,30.00,100.00,300.00,'2024-11-01','2025-11-01','available','2024-10-24 08:46:26','2024-10-24 08:46:26',19),(14,5,'Camping Tent','Waterproof, lightweight camping tent for 2-3 people.','Outdoor Gear',15.00,70.00,250.00,600.00,'2024-10-30','2025-10-30','available','2024-10-24 08:48:47','2024-10-24 08:48:47',20),(15,5,'Board Game: Settlers of Catan','A fun and strategic board game for family and friends.','Toys',3.00,15.00,40.00,150.00,'2024-11-01','2025-11-01','available','2024-10-24 08:51:29','2024-10-24 15:42:26',21),(16,5,'Sonic Adventure II CD','windows 7 compatible','Gaming',3.00,15.00,40.00,150.00,'2024-11-01','2025-11-01','available','2024-10-24 15:03:09','2024-10-24 15:42:26',22),(17,5,'The Elder Scrolls III: Morrowind CD','Compatible with Windows XP and newer versions','Games',2.50,12.00,35.00,130.00,'2024-11-15','2025-11-15','available','2024-10-25 20:08:56','2024-10-25 20:08:56',23),(18,5,'Canon EOS 5D Camera','Professional DSLR camera with 24-105mm lens, ideal for photography and videography.','Electronics',20.00,100.00,300.00,1000.00,'2024-11-15','2025-11-15','available','2024-10-25 20:29:28','2024-10-25 20:29:28',24);
/*!40000 ALTER TABLE `item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `item_id` int DEFAULT NULL,
  `renter_id` int DEFAULT NULL,
  `message` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `status` enum('unread','read') COLLATE utf8mb4_general_ci DEFAULT 'unread',
  PRIMARY KEY (`id`),
  KEY `item_id` (`item_id`),
  KEY `renter_id` (`renter_id`),
  CONSTRAINT `fk_notifications_1` FOREIGN KEY (`item_id`) REFERENCES `item` (`id`),
  CONSTRAINT `fk_notifications_2` FOREIGN KEY (`renter_id`) REFERENCES `users` (`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `payment_id` int NOT NULL AUTO_INCREMENT,
  `amount` float NOT NULL,
  `status` enum('pending','completed') NOT NULL DEFAULT 'pending',
  `method` enum('paypal','COD','Reflect') DEFAULT 'Reflect',
  `renter_id` int NOT NULL,
  `owner_id` int NOT NULL,
  `payment_type` varchar(45) NOT NULL DEFAULT 'basic',
  `rental_id` int NOT NULL,
  PRIMARY KEY (`payment_id`),
  KEY `fk_payment_1_idx` (`renter_id`),
  KEY `fk_payment_owner_idx` (`owner_id`),
  KEY `fk_payment_rental_idx` (`rental_id`),
  CONSTRAINT `fk_payment_owner` FOREIGN KEY (`owner_id`) REFERENCES `users` (`userID`),
  CONSTRAINT `fk_payment_rental` FOREIGN KEY (`rental_id`) REFERENCES `rental` (`id`),
  CONSTRAINT `fk_payment_renter` FOREIGN KEY (`renter_id`) REFERENCES `users` (`userID`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
INSERT INTO `payment` VALUES (17,210,'completed','paypal',6,5,'basic',13),(18,130,'completed','paypal',6,5,'basic',14),(19,100,'completed','paypal',6,5,'basic',15),(20,45,'completed','paypal',6,5,'basic',16),(21,105,'completed','paypal',6,5,'basic',17),(22,10.5,'completed','paypal',6,5,'basic',18),(23,10.5,'completed','paypal',6,5,'basic',19),(24,28.75,'pending','paypal',6,5,'basic',20),(25,90,'pending','paypal',6,5,'basic',21);
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pickup_points`
--

DROP TABLE IF EXISTS `pickup_points`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pickup_points` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `location` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `serial_number` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `serial_number` (`serial_number`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `fk_pickup_points_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`userID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pickup_points`
--

LOCK TABLES `pickup_points` WRITE;
/*!40000 ALTER TABLE `pickup_points` DISABLE KEYS */;
INSERT INTO `pickup_points` VALUES (1,1,'Palestine Nablus Rafidia',1);
/*!40000 ALTER TABLE `pickup_points` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rental`
--

DROP TABLE IF EXISTS `rental`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rental` (
  `id` int NOT NULL AUTO_INCREMENT,
  `item_id` int NOT NULL,
  `renter_id` int NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_general_ci DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `owner_id` int DEFAULT NULL,
  `total_cost` decimal(10,2) DEFAULT NULL,
  `late_fee` decimal(10,2) DEFAULT '0.00',
  `serial_number` int NOT NULL,
  `return_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id` (`id`),
  KEY `item_id_idx` (`item_id`),
  KEY `renter_id_idx` (`renter_id`),
  KEY `fk_owner` (`owner_id`),
  CONSTRAINT `fk_rental_item` FOREIGN KEY (`item_id`) REFERENCES `item` (`id`),
  CONSTRAINT `fk_rental_owner` FOREIGN KEY (`owner_id`) REFERENCES `users` (`userID`),
  CONSTRAINT `fk_rental_renter` FOREIGN KEY (`renter_id`) REFERENCES `users` (`userID`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rental`
--

LOCK TABLES `rental` WRITE;
/*!40000 ALTER TABLE `rental` DISABLE KEYS */;
INSERT INTO `rental` VALUES (8,5,3,'2024-10-15','2024-10-20','returned','2024-10-11 00:21:54',3,NULL,0.00,0,NULL),(10,5,3,'2024-08-01','2024-08-02','rented','2024-10-11 20:07:30',3,50.00,0.00,0,NULL),(11,5,3,'2024-12-31','2025-11-12','returned','2024-10-11 20:28:17',3,2320.00,0.00,1,'2024-10-11 23:31:01'),(12,5,3,'2024-10-01','2024-10-02','returned','2024-10-11 20:28:27',3,55.00,45.00,2,'2024-10-11 23:31:22'),(13,6,6,'2024-11-21','2024-12-10','rented','2024-10-23 18:53:46',5,210.00,0.00,3,NULL),(14,8,6,'2024-12-30','2025-01-10','rented','2024-10-23 18:54:28',5,130.00,0.00,4,NULL),(15,12,6,'2024-11-21','2024-11-30','rented','2024-10-24 08:45:20',5,100.00,0.00,5,NULL),(16,13,6,'2024-11-21','2024-11-30','rented','2024-10-24 08:50:38',5,45.00,0.00,6,NULL),(17,14,6,'2024-11-21','2024-11-30','rented','2024-10-24 08:50:49',5,105.00,0.00,7,NULL),(18,15,6,'2024-11-21','2024-11-28','rented','2024-10-24 08:52:19',5,10.50,0.00,8,NULL),(19,16,6,'2024-11-21','2024-11-28','rented','2024-10-24 16:02:59',5,10.50,0.00,9,NULL),(20,17,6,'2024-11-21','2024-11-28','rented','2024-10-25 20:31:00',5,28.75,0.00,10,NULL),(21,18,6,'2024-11-21','2024-11-28','rented','2024-10-25 20:31:22',5,90.00,0.00,11,NULL);
/*!40000 ALTER TABLE `rental` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rental_request`
--

DROP TABLE IF EXISTS `rental_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rental_request` (
  `id` int NOT NULL AUTO_INCREMENT,
  `item_id` int NOT NULL,
  `owner_id` int NOT NULL,
  `renter_id` int NOT NULL,
  `status` enum('pending','approved','declined') COLLATE utf8mb4_general_ci DEFAULT 'pending',
  `request_date` date DEFAULT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `total_cost` decimal(10,2) DEFAULT NULL,
  `pickup_id` int DEFAULT NULL,
  `geographical_location` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `serial_number` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `serial_number` (`serial_number`),
  KEY `owner_id` (`owner_id`),
  KEY `renter_id` (`renter_id`),
  KEY `fk_rental_request_item_idx` (`item_id`),
  KEY `fk_rental_request_pickup_idx` (`pickup_id`),
  CONSTRAINT `fk_rental_request_item` FOREIGN KEY (`item_id`) REFERENCES `item` (`id`),
  CONSTRAINT `fk_rental_request_owner` FOREIGN KEY (`owner_id`) REFERENCES `users` (`userID`),
  CONSTRAINT `fk_rental_request_pickup` FOREIGN KEY (`pickup_id`) REFERENCES `pickup_points` (`id`),
  CONSTRAINT `fk_rental_request_renter` FOREIGN KEY (`renter_id`) REFERENCES `users` (`userID`)
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rental_request`
--

LOCK TABLES `rental_request` WRITE;
/*!40000 ALTER TABLE `rental_request` DISABLE KEYS */;
INSERT INTO `rental_request` VALUES (2,4,1,3,'pending','2024-10-11','2024-10-15','2024-10-20',NULL,NULL,NULL,43),(3,5,3,3,'declined','2024-10-11','2024-10-15','2024-10-20',50.00,NULL,NULL,44),(4,4,1,3,'pending','2024-10-11','2024-10-15','2024-12-16',600.00,NULL,NULL,45),(20,4,1,3,'pending','2024-10-11','2024-10-15','2024-10-20',50.00,NULL,NULL,1),(21,4,1,3,'pending','2024-10-11','2024-10-15','2024-10-20',50.00,NULL,NULL,2),(22,4,1,3,'pending','2024-10-11','2024-10-15','2024-10-20',50.00,NULL,NULL,3),(23,4,1,3,'pending','2024-10-11','2024-10-15','2024-10-20',50.00,NULL,NULL,4),(24,5,3,3,'approved','2024-10-11','2024-10-15','2024-10-20',50.00,NULL,NULL,5),(25,5,3,3,'pending','2024-10-11','2024-10-15','2024-10-20',50.00,NULL,NULL,6),(26,5,3,3,'approved','2024-10-11','2024-12-31','2025-11-12',2320.00,NULL,NULL,7),(27,5,3,3,'approved','2024-10-11','2024-10-01','2024-10-02',10.00,NULL,NULL,8),(30,1,1,4,'pending','2024-10-19','2024-10-05','2024-11-05',196.00,NULL,NULL,12),(34,6,5,6,'declined',NULL,'2024-11-21','2024-12-10',210.00,NULL,NULL,13),(35,6,5,6,'approved',NULL,'2024-11-21','2024-12-10',210.00,NULL,NULL,15),(39,8,5,6,'approved',NULL,'2024-12-30','2025-01-10',130.00,NULL,NULL,16),(41,10,6,6,'pending',NULL,'2024-11-21','2024-11-30',100.00,NULL,NULL,18),(68,12,5,6,'approved','2024-10-24','2024-11-21','2024-11-30',100.00,NULL,NULL,19),(69,13,5,6,'approved','2024-10-24','2024-11-21','2024-11-30',45.00,NULL,NULL,20),(70,14,5,6,'approved','2024-10-24','2024-11-21','2024-11-30',105.00,NULL,NULL,21),(71,15,5,6,'approved','2024-10-24','2024-11-21','2024-11-28',10.50,NULL,NULL,22),(72,16,5,6,'approved','2024-10-24','2024-11-21','2024-11-28',10.50,NULL,NULL,23),(73,17,5,6,'approved','2024-10-25','2024-11-21','2024-11-28',28.75,NULL,NULL,24),(74,18,5,6,'approved','2024-10-25','2024-11-21','2024-11-28',90.00,NULL,NULL,25);
/*!40000 ALTER TABLE `rental_request` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `transaction_id` int NOT NULL AUTO_INCREMENT,
  `payment_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `type` enum('platform_fee','owner_payment') DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`transaction_id`),
  KEY `payment_id` (`payment_id`),
  CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`payment_id`) REFERENCES `payment` (`payment_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES (1,17,7,10.50,'platform_fee','2024-10-24 12:28:56'),(2,17,5,199.50,'owner_payment','2024-10-24 12:28:56'),(3,22,7,0.53,'platform_fee','2024-10-24 12:31:04'),(4,22,5,9.97,'owner_payment','2024-10-24 12:31:04'),(5,18,7,6.50,'platform_fee','2024-10-24 14:08:51'),(6,18,5,123.50,'owner_payment','2024-10-24 14:08:51'),(7,19,7,5.00,'platform_fee','2024-10-24 14:08:51'),(8,19,5,95.00,'owner_payment','2024-10-24 14:08:51'),(9,20,7,2.25,'platform_fee','2024-10-24 14:08:51'),(10,20,5,42.75,'owner_payment','2024-10-24 14:08:51'),(11,21,7,5.25,'platform_fee','2024-10-24 14:08:51'),(12,21,5,99.75,'owner_payment','2024-10-24 14:08:51'),(13,23,7,0.53,'platform_fee','2024-10-24 16:04:38'),(14,23,5,9.97,'owner_payment','2024-10-24 16:04:38');
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `address` varchar(255) NOT NULL,
  `userID` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `telephone` varchar(15) NOT NULL,
  `role` varchar(15) DEFAULT 'User',
  `loyalty_card` varchar(15) DEFAULT NULL,
  `loyalty_card_expiry` date DEFAULT NULL,
  PRIMARY KEY (`userID`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('Ramallah (31.90376, 35.20342)',1,'John Doe','$2a$10$TW2sbPwWIArS0lRBEH6KWucdsRuhZUBas6j.fOWCiMsFA2QLcsZr6','john.doe@example.com','1234567890','User',NULL,NULL),('Nablus (32.216663, 35.259006)',2,'John Doe','$2a$10$rMu3qw/C99KuFK0lGDWBme6teiwR2vrHMblnCAr8hQmUG2xG3sYE6','jullnar@example.com','1234567890','User',NULL,NULL),('Ramallah (31.90376, 35.20342)',3,'jullanr haje','$2a$10$PpLhqLZj1viwmIJebbBXcOt6bRqeCOjkYdIVA61T.eSmnjv7IYibO','hajar.ihab@gmail.com','1234567890','User',NULL,NULL),('Ramallah (31.90376, 35.20342)',4,'Shahd','$2a$10$7J6rtDQrBvZTFXefh3IPqOQYLt/YALhny5V8WUShUjdzMKYS46Nyu','shahd@gmail.com','0599299172','User',NULL,NULL),('Nablus (32.216663, 35.259006)',5,'Peter Peterson','$2a$10$GjeGfyBncdtwLOEAyZdsd.ZWwdF2DnSjS1Cb968HSkdYQVIQLVgQS','peterpeterson@gmail.com','+970-594368578','User','none',NULL),('Ramallah (31.90376, 35.20342)',6,'Robin Robinson','$2a$10$7kE2eryo8AiqxaBnTQNtEuEdEexAEqk/zsXS5XS/dtPKdwlmQrTMi','robinrobinson@gmail.com','+970-904366778','User','gold',NULL),('Ramallah (31.90376, 35.20342)',7,'Rent-it-Out','$2a$10$5dufL6nT70DktKZ3CiGLo.x4D.qd5VDvTf6lKlqaviYtxqN6W1FPS','rentitoutplatform@business.com','+970-888888888','Admin',NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-25 23:41:10
