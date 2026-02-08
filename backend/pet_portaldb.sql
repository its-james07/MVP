-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 04, 2026 at 07:22 AM
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
-- Database: `pet_portaldb`
--

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `oid` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `category` varchar(50) NOT NULL,
  `price` int(11) NOT NULL,
  `stock_quantity` int(11) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `image_url` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `oid`, `name`, `description`, `category`, `price`, `stock_quantity`, `is_active`, `image_url`, `created_at`) VALUES
('3a54f8e4-e8a1-11f0-b8ba-74d4dd46040a', 0, 'Dog Biscuit', 'this is it', 'dog', 45, 2, 1, 'product_69590df94b9649.30571151.png', '2026-01-03 12:39:21');

-- --------------------------------------------------------

--
-- Table structure for table `sellers`
--

CREATE TABLE `sellers` (
  `oid` int(11) NOT NULL,
  `oname` varchar(50) DEFAULT NULL,
  `ocontact` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sellers`
--

INSERT INTO `sellers` (`oid`, `oname`, `ocontact`) VALUES
(1, 'hari bahadur', '9877564827');

-- --------------------------------------------------------

--
-- Table structure for table `shops`
--

CREATE TABLE `shops` (
  `sid` int(11) NOT NULL,
  `sname` varchar(255) NOT NULL,
  `saddress` varchar(255) DEFAULT NULL,
  `stype` enum('all','dog','cat','fish','bird') DEFAULT NULL,
  `oid` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `shops`
--

INSERT INTO `shops` (`sid`, `sname`, `saddress`, `stype`, `oid`) VALUES
(1, 'Rajdhani Pet Store', 'Balaju-6', 'cat', 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `fname` varchar(20) NOT NULL,
  `email` varchar(30) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` varchar(10) DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `fname`, `email`, `password`, `role`) VALUES
(1, 'Raj Kushwaha', 'rajkush@gmail.com', '$2y$10$H/20ZhxCeotCsiwLbpU7Xu4nANxQsFv7ToueotGm0biHA1kzU8S/2', NULL),
(2, 'Balen', 'balen@gmail.com', '$2y$10$kA70hZ0aaT8dshP70y01.eVQlA1ZwhWzdQbYV0V2468pBs2s1jAia', 'user'),
(3, 'manoj', 'manoj@gmail.com', '$2y$10$FnCOZk5DZvW2g9dOJyOrpehK0d5e60E..QjY0ATCtIFbwrxz3bt1q', 'seller'),
(4, 'hari bahadur', 'raju@gmail.com', '$2y$10$chdvJjfTrm3uUkLzY3vxp.JFZOS1sEZsR9pzKHT.ZIJmWHyputmu.', 'pending'),
(5, 'Kp', 'kp@gmail.com', '$2y$10$475e8hKCyyEt/v.DQlaIh.WqLJ6Yt5stt2MVqgsUJGfO7OlaQQHDi', 'user');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sellers`
--
ALTER TABLE `sellers`
  ADD PRIMARY KEY (`oid`);

--
-- Indexes for table `shops`
--
ALTER TABLE `shops`
  ADD PRIMARY KEY (`sid`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `sellers`
--
ALTER TABLE `sellers`
  MODIFY `oid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `shops`
--
ALTER TABLE `shops`
  MODIFY `sid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
