-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jun 01, 2026 at 10:32 AM
-- Server version: 8.4.3
-- PHP Version: 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bebel_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `office_id` int NOT NULL,
  `office_title` varchar(255) NOT NULL,
  `office_slug` varchar(255) NOT NULL,
  `price` int NOT NULL,
  `status` enum('pending','confirmed','cancelled') NOT NULL DEFAULT 'pending',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `duration` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `user_id`, `office_id`, `office_title`, `office_slug`, `price`, `status`, `created_at`, `updated_at`, `duration`) VALUES
(1, 5, 1, 'Angga Park Central Master Silicon Valley Star Class', 'angga-park-central-master-silicon-valley-star-class', 28560000, 'cancelled', '2026-05-31 20:34:19.476203', '2026-06-01 09:21:31.000000', '20 days'),
(2, 5, 1, 'Angga Park Central Master Silicon Valley Star Class', 'angga-park-central-master-silicon-valley-star-class', 21420000, 'confirmed', '2026-05-31 20:41:05.070910', '2026-06-01 09:21:29.000000', '15 days'),
(3, 5, 1, 'Angga Park Central Master Silicon Valley Star Class', 'angga-park-central-master-silicon-valley-star-class', 42840000, 'confirmed', '2026-05-31 20:47:11.228566', '2026-06-01 09:21:27.000000', '30 days'),
(4, 5, 1, 'Angga Park Central Master Silicon Valley Star Class', 'angga-park-central-master-silicon-valley-star-class', 21420000, 'pending', '2026-06-01 12:59:30.844433', '2026-06-01 12:59:30.844433', '15 days');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `office_id` int NOT NULL,
  `booking_id` int NOT NULL,
  `rating` int NOT NULL,
  `comment` text,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
) ;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user','office_provider') NOT NULL DEFAULT 'user',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`, `updated_at`) VALUES
(1, 'Test User', 'test@gmail.com', '$2b$10$ZFxMAv6CwS.OlvExrapaFueCmyIJeO7aMNxSA0GsG0SJHwn9fRDXC', 'user', '2026-05-10 09:27:00.637972', '2026-05-10 09:27:00.637972'),
(2, 'admin1', 'admin1@gmail.com', '$2b$10$CHRZDzD3ayjMWFhUuF3eX.fH0NhVjda.z7Obp7QhDIWaYoWeVwjke', 'admin', '2026-05-10 09:43:46.101096', '2026-05-10 09:43:46.101096'),
(3, 'officeprov', 'provider@gmail.com', '$2b$10$RFzEHLuzAHof8WOFHQALv.QKlqWS92gVpCE9QabcLD7owk4qiTmWi', 'office_provider', '2026-05-27 14:13:09.619368', '2026-05-27 14:13:09.619368'),
(4, 'belva risma', 'belva@gmail.com', '$2b$10$MC2xwZIZFJHieYcEO6QT9O2zyRQCEj1wcBxpUn.3agTQHqVYAgxji', 'user', '2026-05-31 10:58:34.809657', '2026-05-31 10:58:34.809657'),
(5, 'aku', 'aku@gmail.com', '$2b$10$dwXinP3p6MHb1V1mcOrXiO5cIO7hn2lYgonVN2aPmFGb6z9AeJut6', 'user', '2026-05-31 15:39:51.623807', '2026-05-31 15:39:51.623807');

-- --------------------------------------------------------

--
-- Table structure for table `wishlists`
--

CREATE TABLE `wishlists` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `office_id` int NOT NULL,
  `office_title` varchar(255) NOT NULL,
  `office_slug` varchar(255) NOT NULL,
  `office_image` varchar(255) NOT NULL,
  `office_price` int NOT NULL,
  `office_location` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `wishlists`
--

INSERT INTO `wishlists` (`id`, `user_id`, `office_id`, `office_title`, `office_slug`, `office_image`, `office_price`, `office_location`, `created_at`) VALUES
(1, 5, 2, 'Pondok Pekerja Remote Surabaya', 'pondok-pekerja-remote-surabaya', '/assets/images/thumbnails/thumbnails-3.png', 12000000, 'Surabaya', '2026-06-01 13:12:38.040728');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_64cd97487c5c42806458ab5520c` (`user_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_728447781a30bc3fcfe5c2f1cdf` (`user_id`),
  ADD KEY `FK_bbd6ac6e3e6a8f8c6e0e8692d63` (`booking_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_97672ac88f789774dd47f7c8be` (`email`);

--
-- Indexes for table `wishlists`
--
ALTER TABLE `wishlists`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_b5e6331a1a7d61c25d7a25cab8f` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `wishlists`
--
ALTER TABLE `wishlists`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `FK_64cd97487c5c42806458ab5520c` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `FK_728447781a30bc3fcfe5c2f1cdf` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FK_bbd6ac6e3e6a8f8c6e0e8692d63` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`);

--
-- Constraints for table `wishlists`
--
ALTER TABLE `wishlists`
  ADD CONSTRAINT `FK_b5e6331a1a7d61c25d7a25cab8f` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
