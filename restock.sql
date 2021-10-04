-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 04, 2021 at 09:42 AM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 8.0.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `restock`
--

-- --------------------------------------------------------

--
-- Table structure for table `discount`
--

CREATE TABLE `discount` (
  `discountID` int(16) NOT NULL,
  `percentageDate` float(5,2) DEFAULT NULL,
  `startDate` date DEFAULT NULL,
  `finishDate` date DEFAULT NULL,
  `percentagePrice` float(5,2) DEFAULT NULL,
  `startPrice` float(16,2) DEFAULT NULL,
  `percentagePcs` float(5,2) DEFAULT NULL,
  `pcsStart` int(16) DEFAULT NULL,
  `active` tinyint(1) DEFAULT 1,
  `supplierID` int(16) DEFAULT NULL,
  `productID` int(16) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `discount`
--

INSERT INTO `discount` (`discountID`, `percentageDate`, `startDate`, `finishDate`, `percentagePrice`, `startPrice`, `percentagePcs`, `pcsStart`, `active`, `supplierID`, `productID`) VALUES
(8, 2.00, '2021-09-01', '2021-09-30', 5.00, 500.00, 10.00, 10, 1, 1, 1),
(10, NULL, NULL, NULL, 10.00, 500.00, NULL, NULL, 1, 1, 6),
(11, NULL, NULL, NULL, 6.00, 10000.00, NULL, NULL, 1, 1, 2),
(12, 2.00, '2021-09-16', '2021-10-12', 5.00, 1000.00, 2.00, 10, 1, 1, 4),
(13, NULL, NULL, NULL, 3.00, 600.00, 2.00, 10, 0, 1, 4),
(14, NULL, NULL, NULL, 5.00, 500.00, NULL, NULL, 1, 2, 4),
(15, NULL, NULL, NULL, NULL, NULL, 5.00, 10, 1, 2, 1),
(17, NULL, NULL, NULL, 5.00, 1000.00, NULL, NULL, 1, 3, 1),
(18, 2.00, '2021-09-15', '2021-10-08', NULL, NULL, 3.00, 5, 1, 3, 5),
(19, 10.00, '2021-09-01', '2021-10-15', 2.00, 15000.00, NULL, NULL, 1, 1, 3),
(20, NULL, NULL, NULL, NULL, NULL, 2.00, 8, 1, 1, 5),
(21, NULL, NULL, NULL, 2.00, 15000.00, NULL, NULL, 1, 2, 2),
(22, 6.00, '2021-09-28', '2021-10-17', NULL, NULL, 3.00, 6, 1, 2, 6),
(23, NULL, NULL, NULL, 10.00, 64000.00, 6.00, 42, 1, 3, 2),
(24, NULL, NULL, NULL, NULL, NULL, 16.00, 24, 1, 3, 6),
(25, NULL, NULL, NULL, 13.00, 2000.00, NULL, NULL, 1, 4, 1),
(26, 3.00, '2021-09-24', '2021-10-23', NULL, NULL, NULL, NULL, 1, 4, 2),
(27, NULL, NULL, NULL, 4.00, 1600.00, 15.00, 60, 1, 4, 5);

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `productID` int(16) NOT NULL,
  `productName` varchar(128) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`productID`, `productName`) VALUES
(1, 'Philips monitor 17”'),
(2, 'RTX 3090'),
(3, 'RTX 3080'),
(4, 'Razer DeathAdder Elite'),
(5, 'Logitech Keyboard'),
(6, 'Office Chair');

-- --------------------------------------------------------

--
-- Table structure for table `stock`
--

CREATE TABLE `stock` (
  `supplierID` int(16) NOT NULL,
  `productID` int(16) NOT NULL,
  `pcs` int(16) DEFAULT NULL,
  `price` float(16,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `stock`
--

INSERT INTO `stock` (`supplierID`, `productID`, `pcs`, `price`) VALUES
(1, 1, 8, 120.00),
(1, 2, 24, 2400.00),
(1, 3, 30, 1500.00),
(1, 4, 30, 49.99),
(1, 5, 8, 71.59),
(1, 6, 40, 119.99),
(2, 1, 15, 128.00),
(2, 2, 24, 3000.00),
(2, 3, 10, 1700.00),
(2, 4, 24, 39.99),
(2, 5, 32, 68.59),
(2, 6, 6, 106.49),
(3, 1, 23, 129.00),
(3, 2, 46, 2149.85),
(3, 3, 12, 1300.00),
(3, 4, 60, 59.99),
(3, 5, 20, 65.99),
(3, 6, 25, 142.34),
(4, 1, 37, 129.99),
(4, 2, 5, 3400.00),
(4, 3, 11, 1800.00),
(4, 4, 50, 29.99),
(4, 5, 63, 55.59),
(4, 6, 26, 116.00);

-- --------------------------------------------------------

--
-- Table structure for table `supplier`
--

CREATE TABLE `supplier` (
  `supplierID` int(16) NOT NULL,
  `supplierName` varchar(128) DEFAULT NULL,
  `shipmentDays` int(16) DEFAULT NULL,
  `country` varchar(128) DEFAULT NULL,
  `city` varchar(128) DEFAULT NULL,
  `addressStreet` varchar(128) DEFAULT NULL,
  `addressNumber` int(16) DEFAULT NULL,
  `postCode` int(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `supplier`
--

INSERT INTO `supplier` (`supplierID`, `supplierName`, `shipmentDays`, `country`, `city`, `addressStreet`, `addressNumber`, `postCode`) VALUES
(1, 'Mercatone', 5, 'Italy', 'Milan', 'Via Verdi', 54, 20198),
(2, 'TechnoBuy', 7, 'France', 'Paris', 'Baguette Street', 48, 48954),
(3, 'BricchiMex Inc.™', 4, 'Italy', 'Brescia', 'Oberdan', 64, 25129),
(4, 'MediaWorld', 10, 'Germany', 'Berlin', 'Karl', 14, 43581);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `discount`
--
ALTER TABLE `discount`
  ADD PRIMARY KEY (`discountID`),
  ADD KEY `supplierID` (`supplierID`),
  ADD KEY `productID` (`productID`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`productID`);

--
-- Indexes for table `stock`
--
ALTER TABLE `stock`
  ADD PRIMARY KEY (`supplierID`,`productID`),
  ADD KEY `productID` (`productID`);

--
-- Indexes for table `supplier`
--
ALTER TABLE `supplier`
  ADD PRIMARY KEY (`supplierID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `discount`
--
ALTER TABLE `discount`
  MODIFY `discountID` int(16) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `productID` int(16) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `supplier`
--
ALTER TABLE `supplier`
  MODIFY `supplierID` int(16) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `discount`
--
ALTER TABLE `discount`
  ADD CONSTRAINT `discount_ibfk_1` FOREIGN KEY (`supplierID`) REFERENCES `supplier` (`supplierID`) ON DELETE CASCADE,
  ADD CONSTRAINT `discount_ibfk_2` FOREIGN KEY (`productID`) REFERENCES `product` (`productID`) ON DELETE CASCADE;

--
-- Constraints for table `stock`
--
ALTER TABLE `stock`
  ADD CONSTRAINT `stock_ibfk_1` FOREIGN KEY (`supplierID`) REFERENCES `supplier` (`supplierID`) ON DELETE CASCADE,
  ADD CONSTRAINT `stock_ibfk_2` FOREIGN KEY (`productID`) REFERENCES `product` (`productID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
