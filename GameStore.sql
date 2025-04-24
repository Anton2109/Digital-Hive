-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: game_store
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
-- Table structure for table `game_info`
--

DROP TABLE IF EXISTS `game_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_info` (
  `id` int NOT NULL AUTO_INCREMENT,
  `game_id` int NOT NULL,
  `img` varchar(255) NOT NULL,
  `description` varchar(1100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `REL_af405995dcd8f8a7beeb65bb00` (`game_id`),
  CONSTRAINT `FK_af405995dcd8f8a7beeb65bb003` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_info`
--

LOCK TABLES `game_info` WRITE;
/*!40000 ALTER TABLE `game_info` DISABLE KEYS */;
INSERT INTO `game_info` VALUES (1,1,'fallout4.jpg','Fallout 4 – новая, более усовершенствованная часть легендарной игры, которая снова окунешься тебя в опасный мир, который пережил самый настоящий апокалипсис. Ты станешь одним из немногих выживших после ожесточенных военных действий. Выжить тебе удалось только потому, что все это время ты находился в защищённом бункере, а твой номер 111. Четвертая часть данной игры собрала воедино все самое лучшее из предыдущих частей, а также стала более усовершенствованная как в плане графического аспекта, так и в плане основного игрового процесса. Прошлая часть была основана на сюжетной линии, а в этой части, тебе представится возможность самостоятельно выбирать для себя задания для выполнения. Разработчики порадовали поклонников проекта разнообразием интересных миссий, где ты раскроешь массу тайн. Все вокруг было создано с целью определенного эксперимента, о котором ты сможешь узнать вследствие прохождения.'),(2,2,'forza5.jpg','Forza Horizon 5 – гоночное аркадное приключение, которое вновь готово порадовать нас уже пятой частью серии, с массой нововведений и интересных событий. Первым делом стоит отметить точно проработанную графику, которая позволит нам с головой окунуться в красочный, реалистичный мир и в полной мере почувствовать себя на месте главного героя. Порадует также и наличие огромного выбора автомобилей, каждый из которых поддается модификации и из каждого ты сумеешь сделать что-то совершенно уникальное. Принимай участие во всевозможных гоночных состязаниях, проявляй смекалку и хитрость на трассе, а также сделай всё, чтобы оппонент остался позади. По мере продвижения к успеху удели особое внимание развитию собственных навыков и профессиональных способностей, что позволит преодолеть более сложные испытания и победить более коварного противника. Возможностей для достижения поставленной цели игра предоставляет массу, главное суметь или правильно воспользоваться, и тогда тебя точно ожидает слава на весь мир.'),(3,3,'demn.jpeg','Deus Ex: Mankind Divided – крутой и динамичный игровой проект в жанре шутера по совместительству с РПГ, где все действия будут происходить с видом от первого лица. Игра является ничем иным, как продолжением серии игр Dear ex. Тебе представится возможность сыграть за уже хорошо известных героев и вместе ч ними отправится на сражение за восстановление справедливости. В прошлой части наш главный герой принял очень важное решение, от которого напрямую зависит его дальнейшая жизнь и жизнь всего человечества на земле. По истечении двухлетнего срока времени наш персонаж понимает, что очень сильно ошибся в своём выборе, отчем очень сильно пожалел. Во всем мире стали создаваться подпольные организации, которые противоречили закону. Все эти организации приравниваются к террористическим и очень плохо влияют на население Земли. Адам решает незамедлительно исправить все свои ошибки, а с этим ему поможет работа в Интерполе.'),(4,4,'forza4.jpg','Forza Horizon 4 – аркадные гоночные сопротивления, которые отправят тебя в красочный мир, чтобы ты достиг нереальных высот и стал настоящим профессиональным гонщиком. Основа игрового процесса заключается именно на сражениях между игроками в режиме мультиплеера, где ты здорово проведешь время в компании своих друзей. Ещё одной особенностью является графическая составляющая, которая позволяет ощутить себя в реальном мире. У тебя будет возможность собрать собственную уникальную коллекцию автомобилей, всячески улучшая и усовершенствуя каждую особенную модель. Игровых режимов разработчики предоставили более чем достаточно, поэтому скучать у тебя просто не будет времени и возможности. Динамика игрового процесса зашкаливает, а также данная часть наделена массой преимуществ.');
/*!40000 ALTER TABLE `game_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game_slider`
--

DROP TABLE IF EXISTS `game_slider`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_slider` (
  `id` int NOT NULL AUTO_INCREMENT,
  `game_id` int NOT NULL,
  `img_url` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `game_slider_ibfk_1` (`game_id`),
  CONSTRAINT `game_slider_ibfk_1` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_slider`
--

LOCK TABLES `game_slider` WRITE;
/*!40000 ALTER TABLE `game_slider` DISABLE KEYS */;
INSERT INTO `game_slider` VALUES (1,1,'http://localhost:4200/img/sliderImage/Fallout4/fal41.webp,\nhttp://localhost:4200/img/sliderImage/Fallout4/fal42.webp,\nhttp://localhost:4200/img/sliderImage/Fallout4/fal43.jpg,\nhttp://localhost:4200/img/sliderImage/Fallout4/fal44.webp,\nhttp://localhost:4200/img/sliderImage/Fallout4/fal45.jpg,\nhttp://localhost:4200/img/sliderImage/Fallout4/fal46.jpg,\nhttp://localhost:4200/img/sliderImage/Fallout4/fal47.jpg,'),(2,2,'http://localhost:4200/img/sliderImage/ForzaHor5/f51.jpg,\nhttp://localhost:4200/img/sliderImage/ForzaHor5/f52.jpg,\nhttp://localhost:4200/img/sliderImage/ForzaHor5/f53.jpg,\nhttp://localhost:4200/img/sliderImage/ForzaHor5/f54.webp,\nhttp://localhost:4200/img/sliderImage/ForzaHor5/f55.webp,\nhttp://localhost:4200/img/sliderImage/ForzaHor5/f56.jpg,\nhttp://localhost:4200/img/sliderImage/ForzaHor5/f57.jpg,\nhttp://localhost:4200/img/sliderImage/ForzaHor5/f58.jpg');
/*!40000 ALTER TABLE `game_slider` ENABLE KEYS */;
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
INSERT INTO `games` VALUES (1,'Fallout 4','fallout4.jpg',1299),(2,'Forza Horizon 5','forza5.jpg',3899),(3,'Deus Ex: Manking Divided','demn.jpeg',1399),(4,'Forza Horizon 4','forza4.jpg',1499),(5,'Battlefield 2042','battlefield2042.webp',4199),(6,'Ghost of Tsushima','tsushima.jpg',4299),(7,'Mortal Combat 11','mk11.jpg',499),(8,'Red Dead Redemption 2','rdr2.jpg',3499),(9,'The Crew Motorfest','crew.jpeg',2199),(10,'Lies of P','p.jpeg',4599),(11,'Sea of Thieves','sea.jpg',2599),(12,'Elden Ring','elden.avif',3999),(13,'Helldivers 2','hell.webp',2999),(14,'Star Wars: Battlefront II','starWarsBattlefront2.png',999);
/*!40000 ALTER TABLE `games` ENABLE KEYS */;
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
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password_hash` char(60) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'test@yandex.ru','nikname','$2b$10$epgzD0IrDpTZoRJXjWb0Jem2Zo7rJAaAe1XMP2dxXy4y0vjT1FEH.','2025-02-16 12:12:31');
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

-- Dump completed on 2025-04-24 10:41:46
