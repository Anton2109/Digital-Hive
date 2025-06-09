-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: game_service
-- ------------------------------------------------------
-- Server version	8.0.40

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
-- Table structure for table `categories`
--

USE game_service;

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `categoriesImg` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Шутер','fh4.jpg'),(2,'Гонки','fh4.jpg'),(3,'Спорт','fh4.jpg'),(4,'Аркада','fh4.jpg'),(5,'Хоррор','fh4.jpg'),(6,'Приключения','fh4.jpg'),(7,'Ролевые игры','fh4.jpg'),(8,'Стратегии','fh4.jpg'),(9,'Симулятор','fh4.jpg'),(10,'Платформер','fh4.jpg'),(11,'RPG','fh4.jpg'),(12,'Экшн','fh4.jpg');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game_genre`
--

DROP TABLE IF EXISTS `game_genre`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_genre` (
  `game_id` int NOT NULL,
  `categories_id` int NOT NULL,
  PRIMARY KEY (`game_id`,`categories_id`),
  KEY `genre_id` (`categories_id`),
  CONSTRAINT `game_genre_ibfk_1` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`) ON DELETE CASCADE,
  CONSTRAINT `game_genre_ibfk_2` FOREIGN KEY (`categories_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_genre`
--

LOCK TABLES `game_genre` WRITE;
/*!40000 ALTER TABLE `game_genre` DISABLE KEYS */;
INSERT INTO `game_genre` VALUES (5,1),(14,1),(2,2),(4,2),(9,2),(8,6),(10,6),(11,6),(10,7),(12,7),(1,11),(3,11),(1,12),(3,12),(6,12),(7,12),(8,12),(10,12),(11,12),(12,12),(13,12);
/*!40000 ALTER TABLE `game_genre` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `games`
--

DROP TABLE IF EXISTS `games`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `games` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `img_path` varchar(255) NOT NULL,
  `price` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `games`
--

LOCK TABLES `games` WRITE;
/*!40000 ALTER TABLE `games` DISABLE KEYS */;
INSERT INTO `games` VALUES (1,'Fallout 4','fallout4.jpg',1299),(2,'Forza Horizon 5','forza5.jpg',3899),(3,'Deus Ex: Mankind Divided','demn.jpeg',1399),(4,'Forza Horizon 4','forza4.jpg',1499),(5,'Battlefield 2042','battlefield2042.webp',4199),(6,'Ghost of Tsushima','tsushima.jpg',4299),(7,'Mortal Combat 11','mk11.jpg',499),(8,'Red Dead Redemption 2','rdr2.jpg',3499),(9,'The Crew Motorfest','crew.jpeg',2199),(10,'Lies of P','p.jpeg',4599),(11,'Sea of Thieves','sea.jpg',2599),(12,'Elden Ring','elden.avif',3999),(13,'Helldivers 2','hell.webp',2999),(14,'Star Wars: Battlefront II','starWarsBattlefront2.png',999);
/*!40000 ALTER TABLE `games` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `system_req_min`
--

DROP TABLE IF EXISTS `system_req_min`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `system_req_min` (
  `id` int NOT NULL AUTO_INCREMENT,
  `windows` char(2) NOT NULL,
  `processor` varchar(255) NOT NULL,
  `RAM` char(3) NOT NULL,
  `graphicsCard` varchar(255) NOT NULL,
  `DirectX` char(2) NOT NULL,
  `DiskSpace` varchar(10) NOT NULL,
  `game_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_game_id_min` (`game_id`),
  CONSTRAINT `fk_game_id_min` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system_req_min`
--

LOCK TABLES `system_req_min` WRITE;
/*!40000 ALTER TABLE `system_req_min` DISABLE KEYS */;
INSERT INTO `system_req_min` VALUES (1,'10','Intel Core i5-4460 или AMD Ryzen 3 1200','8','NVIDIA GeForce GTX 970 или AMD Radeon RX 470','12','110',2),(2,'7','Intel Core i5-2300 2.8 GHz / AMD Phenom II X4 945 3.0 GHz','8','NVIDIA GTX 550 Ti 2GB / AMD Radeon HD 7870 2GB','11','30 GB',1),(3,'7','Intel Core i3-2100T 2.5 GHz / AMD Phenom II X4 940 3.0 GHz','8','NVIDIA GTX 660 2GB / AMD Radeon HD 7870 2GB','11','45 GB',3),(4,'10','Intel i3-4170 3.7 GHz / Intel i5 750 2.67 GHz','8','NVIDIA GTX 650 Ti / AMD R7 250X','12','80 GB',4),(5,'10','AMD Ryzen 5 1600 / Intel Core i5 6600K','8','AMD Radeon RX 560 / NVIDIA GeForce GTX 1050 Ti','12','100 GB',5),(6,'10','Intel Core i3-7100 / AMD Ryzen 3 1200','8','NVIDIA GeForce GTX 960 / AMD Radeon RX 5500 XT','12','75 GB',6),(7,'7','Intel Core i5-750, 2.67 GHz / AMD Phenom II X4 965, 3.4 GHz','8','NVIDIA GeForce GTX 670 / NVIDIA GeForce GTX 1050 / AMD Radeon HD 7950','11','60 GB',7),(8,'7','Intel Core i5-2500K / AMD FX-6300','8','NVIDIA GeForce GTX 770 2GB / AMD Radeon R9 280 3GB','12','150 GB',8),(9,'10','Intel Core i5-4460 / AMD Ryzen 3 1200','8','NVIDIA GeForce GTX 960 / AMD Radeon RX 470','12','50 GB',9),(10,'10','Intel Core i5-7500 / AMD Ryzen 3 1200','8','NVIDIA GeForce GTX 1050 Ti / AMD Radeon RX 560','12','50 GB',10),(11,'10','Intel Q9450 2.6GHz / AMD Phenom II X6 3.3 GHz','4','NVIDIA GeForce GTX 650 / AMD Radeon 7750','11','50 GB',11),(12,'10','Intel Core i5-8400 / AMD Ryzen 3 3300X','12','NVIDIA GeForce GTX 1060 3GB / AMD Radeon RX 580 4GB','12','60 GB',12),(13,'10','Intel Core i5-6600 / AMD Ryzen 3 1200','8','NVIDIA GeForce GTX 1050 Ti / AMD Radeon RX 560','12','50 GB',13),(15,'7','Intel Core i5 6600K / AMD FX-6350','8','NVIDIA GeForce GTX 660 2GB / AMD Radeon HD 7850 2GB','11','15 GB',14);
/*!40000 ALTER TABLE `system_req_min` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `system_req_max`
--

DROP TABLE IF EXISTS `system_req_max`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `system_req_max` (
  `id` int NOT NULL AUTO_INCREMENT,
  `windows` char(2) NOT NULL,
  `processor` varchar(255) NOT NULL,
  `RAM` char(3) NOT NULL,
  `graphicsCard` varchar(255) NOT NULL,
  `DirectX` char(2) NOT NULL,
  `DiskSpace` varchar(10) NOT NULL,
  `game_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_game_id_max` (`game_id`),
  CONSTRAINT `fk_game_id_max` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system_req_max`
--

LOCK TABLES `system_req_max` WRITE;
/*!40000 ALTER TABLE `system_req_max` DISABLE KEYS */;
INSERT INTO `system_req_max` VALUES (1,'10','Ryzen 5 1500X или Intel i5-8400','16','Radeon RX 590 или GeForce GTX 1070','12','110 ГБ',2),(2,'10','Intel Core i7 4790 3.6 GHz / AMD FX-9590 4.7 GHz','8','NVIDIA GTX 780 3GB / AMD Radeon R9 290X 4GB','11','30 GB',1),(3,'10','Intel Core i7-3770K 3.5 GHz / AMD FX-8350 4.0 GHz','16','NVIDIA GTX 970 4GB / AMD Radeon RX 480 8GB','12','45 GB',3),(4,'10','Intel i7-3820 3.6 GHz','12','NVIDIA GTX 970 / NVIDIA GTX 1060 6GB / AMD R9 290X / AMD RX 470','12','100 GB',4),(5,'10','AMD Ryzen 7 2700X / Intel Core i7 4790','16','AMD Radeon RX 6600 XT / NVIDIA GeForce RTX 3060','12','100 GB',5),(6,'10','Intel Core i5-8600 / AMD Ryzen 5 3600','16','NVIDIA GeForce RTX 2060 / AMD Radeon RX 5600 XT','12','75 GB',6),(7,'10','Intel Core i5-2300, 2.8 GHz / AMD FX-6300, 3.5 GHz','8','NVIDIA GeForce GTX 780 / AMD Radeon R9 290 / AMD RX 570','11','60 GB',7),(8,'10','Intel Core i7-4770K / AMD Ryzen 5 1500X','12','NVIDIA GeForce GTX 1060 6GB / AMD Radeon RX 480 4GB','12','150 GB',8),(9,'10','Intel Core i7-4790 / AMD Ryzen 5 1600','16','NVIDIA GeForce GTX 1070 / AMD Radeon RX 5700','12','50 GB',9),(10,'10','Intel Core i7-8700 / AMD Ryzen 5 3600','16','NVIDIA GeForce GTX 1660 Ti / AMD Radeon RX 5700','12','50 GB',10),(11,'10','Intel i5 4690 3.5GHz / AMD FX-8150 3.6 GHz','8','NVIDIA GeForce GTX 770 / AMD Radeon R9 380x','11','50 GB',11),(12,'10','Intel Core i7-8700K / AMD Ryzen 5 3600X','16','NVIDIA GeForce GTX 1070 8GB / AMD Radeon RX Vega 56 8GB','12','60 GB',12),(13,'10','Intel Core i7-4770K / AMD Ryzen 5 1500X','16','NVIDIA GeForce GTX 1060 6GB / AMD Radeon RX 580','12','50 GB',13),(15,'10','Intel Core i7 6700 / AMD Ryzen 7 1700','16','NVIDIA GeForce GTX 1060 3GB / AMD Radeon RX 480 4GB','11','15 GB',14);
/*!40000 ALTER TABLE `system_req_max` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game_info`
--

DROP TABLE IF EXISTS `game_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_info` (
  `id` int NOT NULL AUTO_INCREMENT,
  `game_id` int NOT NULL,
  `description` text NOT NULL,
  `release_date` date,
  `developer` varchar(255) NOT NULL,
  `publisher` varchar(255) NOT NULL,
  `rating` decimal(3,1) DEFAULT NULL,
  `img` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `game_id` (`game_id`),
  CONSTRAINT `fk_game_info_game_id` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_info`
--

LOCK TABLES `game_info` WRITE;
/*!40000 ALTER TABLE `game_info` DISABLE KEYS */;
INSERT INTO `game_info` VALUES 
(1, 1, 'Fallout 4 - это постапокалиптическая ролевая игра, действие которой происходит в Бостоне после ядерной войны. Игроки исследуют открытый мир, выполняют квесты и развивают своего персонажа.', '2015-11-10', 'Bethesda Game Studios', 'Bethesda Softworks', 8.5, 'fallout4.jpg'),
(2, 2, 'Forza Horizon 5 - это гоночная игра с открытым миром, действие которой происходит в Мексике. Игроки могут участвовать в гонках, исследовать мир и настраивать свои автомобили.', '2021-11-09', 'Playground Games', 'Xbox Game Studios', 9.2, 'forza5.jpg'),
(3, 3, 'Deus Ex: Mankind Divided - это научно-фантастическая ролевая игра с элементами стелс-экшена. Игроки управляют агентом Адамом Дженсеном в мире, где люди с технологическими улучшениями подвергаются дискриминации.', '2016-08-23', 'Eidos Montréal', 'Square Enix', 8.0, 'demn.jpeg'),
(4, 4, 'Forza Horizon 4 - это гоночная игра с открытым миром, действие которой происходит в Великобритании. Игроки могут участвовать в гонках, исследовать мир и настраивать свои автомобили.', '2018-10-02', 'Playground Games', 'Microsoft Studios', 9.0, 'forza4.jpg'),
(5, 5, 'Battlefield 2042 - это шутер от первого лица, действие которого происходит в недалеком будущем. Игроки сражаются в масштабных сражениях с использованием передовых технологий.', '2021-11-19', 'DICE', 'Electronic Arts', 7.5, 'battlefield2042.webp'),
(6, 6, 'Ghost of Tsushima - это приключенческая игра с открытым миром, действие которой происходит в Японии XIII века. Игроки управляют самураем Дзином Сакаем, защищающим остров Цусима от монгольского вторжения.', '2020-07-17', 'Sucker Punch Productions', 'Sony Interactive Entertainment', 9.3, 'tsushima.jpg'),
(7, 7, 'Mortal Kombat 11 - это файтинг, в котором игроки сражаются в жестоких поединках с использованием различных персонажей и их уникальных способностей.', '2019-04-23', 'NetherRealm Studios', 'Warner Bros. Interactive Entertainment', 8.5, 'mk11.jpg'),
(8, 8, 'Red Dead Redemption 2 - это приключенческая игра с открытым миром, действие которой происходит на Диком Западе. Игроки управляют Артуром Морганом, членом банды Ван дер Линде.', '2018-10-26', 'Rockstar Games', 'Rockstar Games', 9.7, 'rdr2.jpg'),
(9, 9, 'The Crew Motorfest - это гоночная игра с открытым миром, действие которой происходит на Гавайях. Игроки могут участвовать в различных гонках и настраивать свои автомобили.', '2023-09-14', 'Ubisoft Ivory Tower', 'Ubisoft', 8.2, 'crew.jpeg'),
(10, 10, 'Lies of P - это ролевая игра в стиле душслайк, действие которой происходит в альтернативной версии города Крако. Игроки управляют Пиноккио, который должен найти мистера Джеппетто.', '2023-09-19', 'Neowiz Games', 'Neowiz', 8.8, 'p.jpeg'),
(11, 11, 'Sea of Thieves - это приключенческая игра с открытым миром, в которой игроки становятся пиратами и исследуют моря, сражаются с другими пиратами и ищут сокровища.', '2018-03-20', 'Rare', 'Xbox Game Studios', 8.0, 'sea.jpg'),
(12, 12, 'Elden Ring - это ролевая игра в жанре душслайк, разработанная в сотрудничестве с Джорджем Р.Р. Мартином. Игроки исследуют открытый мир и сражаются с могущественными противниками.', '2022-02-25', 'FromSoftware', 'Bandai Namco Entertainment', 9.5, 'elden.avif'),
(13, 13, 'Helldivers 2 - это кооперативный шутер от третьего лица, в котором игроки сражаются с инопланетными захватчиками на различных планетах.', '2024-02-08', 'Arrowhead Game Studios', 'Sony Interactive Entertainment', 9.0, 'hell.webp'),
(14, 14, 'Star Wars: Battlefront II - это шутер от первого и третьего лица, действие которого происходит во вселенной Звездных войн. Игроки могут сражаться на стороне Сопротивления или Первого Ордена.', '2017-11-17', 'DICE', 'Electronic Arts', 8.3, 'starWarsBattlefront2.png');
/*!40000 ALTER TABLE `game_info` ENABLE KEYS */;
UNLOCK TABLES;

DROP TABLE IF EXISTS `game_keys`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_keys` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `game_id` INT NOT NULL,
    `key` VARCHAR(255) NOT NULL,
    `status` ENUM('available', 'used', 'reserved') NOT NULL DEFAULT 'available',
    `used_at` TIMESTAMP NULL,
    `order_id` INT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`game_id`) REFERENCES `games` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_keys`
--

LOCK TABLES `game_keys` WRITE;
/*!40000 ALTER TABLE `game_keys` DISABLE KEYS */;
INSERT INTO `game_keys` (`game_id`, `key`) VALUES
-- Fallout 4
(1, 'FO4-XXXX-XXXX-XXXX-1'),
(1, 'FO4-XXXX-XXXX-XXXX-2'),
(1, 'FO4-XXXX-XXXX-XXXX-3'),
(1, 'FO4-XXXX-XXXX-XXXX-4'),
(1, 'FO4-XXXX-XXXX-XXXX-5'),

-- Forza Horizon 5
(2, 'FH5-XXXX-XXXX-XXXX-1'),
(2, 'FH5-XXXX-XXXX-XXXX-2'),
(2, 'FH5-XXXX-XXXX-XXXX-3'),
(2, 'FH5-XXXX-XXXX-XXXX-4'),
(2, 'FH5-XXXX-XXXX-XXXX-5'),

-- Deus Ex: Mankind Divided
(3, 'DXMD-XXXX-XXXX-XXXX-1'),
(3, 'DXMD-XXXX-XXXX-XXXX-2'),
(3, 'DXMD-XXXX-XXXX-XXXX-3'),
(3, 'DXMD-XXXX-XXXX-XXXX-4'),
(3, 'DXMD-XXXX-XXXX-XXXX-5'),

-- Forza Horizon 4
(4, 'FH4-XXXX-XXXX-XXXX-1'),
(4, 'FH4-XXXX-XXXX-XXXX-2'),
(4, 'FH4-XXXX-XXXX-XXXX-3'),
(4, 'FH4-XXXX-XXXX-XXXX-4'),
(4, 'FH4-XXXX-XXXX-XXXX-5'),

-- Battlefield 2042
(5, 'BF42-XXXX-XXXX-XXXX-1'),
(5, 'BF42-XXXX-XXXX-XXXX-2'),
(5, 'BF42-XXXX-XXXX-XXXX-3'),
(5, 'BF42-XXXX-XXXX-XXXX-4'),
(5, 'BF42-XXXX-XXXX-XXXX-5'),

-- Ghost of Tsushima
(6, 'GOT-XXXX-XXXX-XXXX-1'),
(6, 'GOT-XXXX-XXXX-XXXX-2'),
(6, 'GOT-XXXX-XXXX-XXXX-3'),
(6, 'GOT-XXXX-XXXX-XXXX-4'),
(6, 'GOT-XXXX-XXXX-XXXX-5'),

-- Mortal Kombat 11
(7, 'MK11-XXXX-XXXX-XXXX-1'),
(7, 'MK11-XXXX-XXXX-XXXX-2'),
(7, 'MK11-XXXX-XXXX-XXXX-3'),
(7, 'MK11-XXXX-XXXX-XXXX-4'),
(7, 'MK11-XXXX-XXXX-XXXX-5'),

-- Red Dead Redemption 2
(8, 'RDR2-XXXX-XXXX-XXXX-1'),
(8, 'RDR2-XXXX-XXXX-XXXX-2'),
(8, 'RDR2-XXXX-XXXX-XXXX-3'),
(8, 'RDR2-XXXX-XXXX-XXXX-4'),
(8, 'RDR2-XXXX-XXXX-XXXX-5'),

-- The Crew Motorfest
(9, 'TCM-XXXX-XXXX-XXXX-1'),
(9, 'TCM-XXXX-XXXX-XXXX-2'),
(9, 'TCM-XXXX-XXXX-XXXX-3'),
(9, 'TCM-XXXX-XXXX-XXXX-4'),
(9, 'TCM-XXXX-XXXX-XXXX-5'),

-- Lies of P
(10, 'LOP-XXXX-XXXX-XXXX-1'),
(10, 'LOP-XXXX-XXXX-XXXX-2'),
(10, 'LOP-XXXX-XXXX-XXXX-3'),
(10, 'LOP-XXXX-XXXX-XXXX-4'),
(10, 'LOP-XXXX-XXXX-XXXX-5'),

-- Sea of Thieves
(11, 'SOT-XXXX-XXXX-XXXX-1'),
(11, 'SOT-XXXX-XXXX-XXXX-2'),
(11, 'SOT-XXXX-XXXX-XXXX-3'),
(11, 'SOT-XXXX-XXXX-XXXX-4'),
(11, 'SOT-XXXX-XXXX-XXXX-5'),

-- Elden Ring
(12, 'ER-XXXX-XXXX-XXXX-1'),
(12, 'ER-XXXX-XXXX-XXXX-2'),
(12, 'ER-XXXX-XXXX-XXXX-3'),
(12, 'ER-XXXX-XXXX-XXXX-4'),
(12, 'ER-XXXX-XXXX-XXXX-5'),

-- Helldivers 2
(13, 'HD2-XXXX-XXXX-XXXX-1'),
(13, 'HD2-XXXX-XXXX-XXXX-2'),
(13, 'HD2-XXXX-XXXX-XXXX-3'),
(13, 'HD2-XXXX-XXXX-XXXX-4'),
(13, 'HD2-XXXX-XXXX-XXXX-5'),

-- Star Wars: Battlefront II
(14, 'SWBF2-XXXX-XXXX-XXXX-1'),
(14, 'SWBF2-XXXX-XXXX-XXXX-2'),
(14, 'SWBF2-XXXX-XXXX-XXXX-3'),
(14, 'SWBF2-XXXX-XXXX-XXXX-4'),
(14, 'SWBF2-XXXX-XXXX-XXXX-5');
/*!40000 ALTER TABLE `game_keys` ENABLE KEYS */;
UNLOCK TABLES;

DROP TABLE IF EXISTS `user_games`;
CREATE TABLE `user_games` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `game_id` INT NOT NULL,
    `purchase_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `key_id` INT NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`game_id`) REFERENCES `games` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`key_id`) REFERENCES `game_keys` (`id`) ON DELETE CASCADE,
    INDEX `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Table structure for table `game_discounts`
--

DROP TABLE IF EXISTS `game_discounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_discounts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `game_id` int NOT NULL,
  `discount_percent` int NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `is_active` boolean DEFAULT true,
  PRIMARY KEY (`id`),
  KEY `fk_game_discounts_game_id` (`game_id`),
  CONSTRAINT `fk_game_discounts_game_id` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_discounts`
--

LOCK TABLES `game_discounts` WRITE;
/*!40000 ALTER TABLE `game_discounts` DISABLE KEYS */;
INSERT INTO `game_discounts` (`game_id`, `discount_percent`, `start_date`, `end_date`, `is_active`) VALUES
(1, 20, '2025-06-01 00:00:00', '2025-06-30 23:59:59', true),
(2, 15, '2025-06-01 00:00:00', '2025-06-30 23:59:59', true),
(3, 25, '2025-06-01 00:00:00', '2025-06-30 23:59:59', true),
(4, 10, '2025-06-01 00:00:00', '2025-06-30 23:59:59', true),
(5, 30, '2025-06-01 00:00:00', '2025-06-30 23:59:59', true);
/*!40000 ALTER TABLE `game_discounts` ENABLE KEYS */;
UNLOCK TABLES;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-01 13:47:54
