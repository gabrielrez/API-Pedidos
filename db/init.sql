CREATE TABLE IF NOT EXISTS `Order` (
  `orderId` VARCHAR(100) NOT NULL,
  `value` DECIMAL(10, 2) NOT NULL,
  `creationDate` DATETIME NOT NULL,
  PRIMARY KEY (`orderId`)
);

CREATE TABLE IF NOT EXISTS `Items` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `orderId` VARCHAR(100) NOT NULL,
  `productId` INT NOT NULL,
  `quantity` INT NOT NULL,
  `price` DECIMAL(10, 2) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`orderId`) REFERENCES `Order`(`orderId`) ON DELETE CASCADE
);
