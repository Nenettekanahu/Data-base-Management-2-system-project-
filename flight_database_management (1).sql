-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : sam. 20 déc. 2025 à 20:32
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `flight_database_management`
--

-- --------------------------------------------------------

--
-- Structure de la table `airports`
--

CREATE TABLE `airports` (
  `airportID` int(11) NOT NULL,
  `airport_code` varchar(10) NOT NULL,
  `airport_name` varchar(150) NOT NULL,
  `city` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `airports`
--

INSERT INTO `airports` (`airportID`, `airport_code`, `airport_name`, `city`, `country`) VALUES
(1, 'LAX', 'Los Angeles International Airport', 'Los Angeles', 'USA'),
(2, 'JFK', 'John F. Kennedy International Airport', 'New York', 'USA'),
(3, 'DXB', 'Dubai International Airport', 'Dubai', 'UAE'),
(4, 'CDG', 'Charles de Gaulle Airport', 'Paris', 'France'),
(5, 'IST', 'Istanbul Airport', 'Istanbul', 'Türkiye');

-- --------------------------------------------------------

--
-- Structure de la table `bookings`
--

CREATE TABLE `bookings` (
  `bookingID` int(11) NOT NULL,
  `passengerID` int(11) NOT NULL,
  `airportID` int(11) NOT NULL,
  `flightID` int(11) NOT NULL,
  `booking_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `total_amount` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `bookings`
--

INSERT INTO `bookings` (`bookingID`, `passengerID`, `airportID`, `flightID`, `booking_date`, `total_amount`) VALUES
(8, 2, 1, 1, '2025-11-20 10:00:00', 450.00),
(9, 3, 3, 2, '2025-12-01 07:30:00', 520.00);

-- --------------------------------------------------------

--
-- Structure de la table `crew`
--

CREATE TABLE `crew` (
  `crewID` int(11) NOT NULL,
  `userID` int(11) DEFAULT NULL,
  `job_title` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `crew`
--

INSERT INTO `crew` (`crewID`, `userID`, `job_title`) VALUES
(2, 3, 'Pilot'),
(3, 4, 'Flight Attendant');

-- --------------------------------------------------------

--
-- Structure de la table `flightcrew`
--

CREATE TABLE `flightcrew` (
  `flightID` int(11) NOT NULL,
  `crewID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `flightcrew`
--

INSERT INTO `flightcrew` (`flightID`, `crewID`) VALUES
(1, 2),
(1, 3),
(2, 2),
(3, 3);

-- --------------------------------------------------------

--
-- Structure de la table `flights`
--

CREATE TABLE `flights` (
  `flightID` int(11) NOT NULL,
  `flight_number` varchar(50) NOT NULL,
  `origin_airportID` int(11) NOT NULL,
  `destination_airportID` int(11) NOT NULL,
  `departure_time` datetime NOT NULL,
  `arrival_time` datetime NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `flights`
--

INSERT INTO `flights` (`flightID`, `flight_number`, `origin_airportID`, `destination_airportID`, `departure_time`, `arrival_time`, `price`) VALUES
(1, 'FL100', 1, 2, '2025-12-05 08:00:00', '2025-12-05 16:00:00', 450.00),
(2, 'FL200', 3, 5, '2025-12-10 22:00:00', '2025-12-11 03:00:00', 520.00),
(3, 'FL300', 5, 4, '2025-12-15 14:00:00', '2025-12-15 18:30:00', 380.00);

-- --------------------------------------------------------

--
-- Structure de la table `passengers`
--

CREATE TABLE `passengers` (
  `passengerID` int(11) NOT NULL,
  `userID` int(11) DEFAULT NULL,
  `passport_number` varchar(50) NOT NULL,
  `nationality` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `passengers`
--

INSERT INTO `passengers` (`passengerID`, `userID`, `passport_number`, `nationality`) VALUES
(2, 1, 'P1234567', 'american'),
(3, 2, 'P9876543', 'british'),
(4, 26, 'OP012345', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `payments`
--

CREATE TABLE `payments` (
  `paymentID` int(11) NOT NULL,
  `bookingID` int(11) NOT NULL,
  `payment_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `payment_method` enum('credit_card','cash','bank_transfer') NOT NULL,
  `payment_status` enum('pending','completed','failed') DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `payments`
--

INSERT INTO `payments` (`paymentID`, `bookingID`, `payment_date`, `payment_method`, `payment_status`) VALUES
(17, 8, '2025-12-05 10:36:56', 'credit_card', 'completed'),
(18, 8, '2025-12-05 10:36:56', 'credit_card', 'completed'),
(19, 9, '2025-12-05 10:36:56', 'bank_transfer', 'pending');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `userID` int(11) NOT NULL,
  `flightID` int(11) DEFAULT NULL,
  `username` varchar(100) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `role` enum('admin','passenger','crew') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `gender` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`userID`, `flightID`, `username`, `first_name`, `last_name`, `password`, `phone`, `email`, `role`, `created_at`, `gender`) VALUES
(1, NULL, 'john_doe', 'John', 'Doe', 'pass123', '555-1111', 'john@example.com', 'passenger', '2025-12-04 21:27:32', 'male'),
(2, NULL, 'sarah_smith', 'Sarah', 'Smith', 'pass123', '555-2222', 'sarah@example.com', 'passenger', '2025-12-04 21:27:32', 'female'),
(3, NULL, 'capt_miller', 'Tom', 'Miller', 'pass123', '555-3333', 'miller@example.com', 'crew', '2025-12-04 21:27:32', 'male'),
(4, NULL, 'crew_anna', 'Anna', 'Brown', 'pass123', '555-4444', 'anna@example.com', 'crew', '2025-12-04 21:27:32', 'female'),
(5, NULL, 'admin1', 'Nathan', 'Ngoyi', 'admin123', '555-9999', 'admin@example.com', 'admin', '2025-12-04 21:27:32', 'male'),
(21, NULL, 'john_doe', 'John', 'Doe', 'pass123', '555-1111', 'jon@example.com', 'passenger', '2025-12-05 10:43:47', 'male'),
(22, NULL, 'sarah_smith', 'Sarah', 'Smith', 'pass123', '555-2222', 'sara@example.com', 'passenger', '2025-12-05 10:43:47', 'female'),
(23, NULL, 'capt_miller', 'Tom', 'Miller', 'pass123', '555-3333', 'mille@example.com', 'crew', '2025-12-05 10:43:47', 'male'),
(24, NULL, 'crew_anna', 'Anna', 'Brown', 'pass123', '555-4444', 'annaa@example.com', 'crew', '2025-12-05 10:43:47', 'female'),
(25, NULL, 'admin1', 'Nathan', 'Ngoyi', 'admin123', '555-9999', 'admi@example.com', 'admin', '2025-12-05 10:43:47', 'male'),
(26, NULL, 'messi', 'lionnel', 'andre', '12345', '444-4444', 'lionellemessi@gmail.com', 'passenger', '2025-12-19 21:00:05', 'male');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `airports`
--
ALTER TABLE `airports`
  ADD PRIMARY KEY (`airportID`),
  ADD UNIQUE KEY `airport_code` (`airport_code`);

--
-- Index pour la table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`bookingID`),
  ADD KEY `passengerID` (`passengerID`),
  ADD KEY `airportID` (`airportID`),
  ADD KEY `flightID` (`flightID`);

--
-- Index pour la table `crew`
--
ALTER TABLE `crew`
  ADD PRIMARY KEY (`crewID`),
  ADD UNIQUE KEY `userID` (`userID`);

--
-- Index pour la table `flightcrew`
--
ALTER TABLE `flightcrew`
  ADD PRIMARY KEY (`flightID`,`crewID`),
  ADD KEY `crewID` (`crewID`);

--
-- Index pour la table `flights`
--
ALTER TABLE `flights`
  ADD PRIMARY KEY (`flightID`),
  ADD UNIQUE KEY `flight_number` (`flight_number`),
  ADD KEY `origin_airportID` (`origin_airportID`),
  ADD KEY `destination_airportID` (`destination_airportID`);

--
-- Index pour la table `passengers`
--
ALTER TABLE `passengers`
  ADD PRIMARY KEY (`passengerID`),
  ADD UNIQUE KEY `passport_number` (`passport_number`),
  ADD UNIQUE KEY `userID` (`userID`);

--
-- Index pour la table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`paymentID`),
  ADD KEY `bookingID` (`bookingID`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userID`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `airports`
--
ALTER TABLE `airports`
  MODIFY `airportID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `bookingID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `crew`
--
ALTER TABLE `crew`
  MODIFY `crewID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `flights`
--
ALTER TABLE `flights`
  MODIFY `flightID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `passengers`
--
ALTER TABLE `passengers`
  MODIFY `passengerID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `payments`
--
ALTER TABLE `payments`
  MODIFY `paymentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `userID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`passengerID`) REFERENCES `passengers` (`passengerID`),
  ADD CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`airportID`) REFERENCES `airports` (`airportID`),
  ADD CONSTRAINT `bookings_ibfk_3` FOREIGN KEY (`flightID`) REFERENCES `flights` (`flightID`);

--
-- Contraintes pour la table `crew`
--
ALTER TABLE `crew`
  ADD CONSTRAINT `crew_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`);

--
-- Contraintes pour la table `flightcrew`
--
ALTER TABLE `flightcrew`
  ADD CONSTRAINT `flightcrew_ibfk_1` FOREIGN KEY (`flightID`) REFERENCES `flights` (`flightID`),
  ADD CONSTRAINT `flightcrew_ibfk_2` FOREIGN KEY (`crewID`) REFERENCES `crew` (`crewID`);

--
-- Contraintes pour la table `flights`
--
ALTER TABLE `flights`
  ADD CONSTRAINT `flights_ibfk_1` FOREIGN KEY (`origin_airportID`) REFERENCES `airports` (`airportID`),
  ADD CONSTRAINT `flights_ibfk_2` FOREIGN KEY (`destination_airportID`) REFERENCES `airports` (`airportID`);

--
-- Contraintes pour la table `passengers`
--
ALTER TABLE `passengers`
  ADD CONSTRAINT `passengers_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`);

--
-- Contraintes pour la table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`bookingID`) REFERENCES `bookings` (`bookingID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
