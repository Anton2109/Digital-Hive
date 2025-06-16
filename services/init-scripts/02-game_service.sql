-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: game_service
-- ------------------------------------------------------
-- Server version	8.0.42

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
INSERT INTO `categories` VALUES (1,'Шутер','fh4.jpg'),(2,'Гонки','fh4.jpg'),(3,'Спорт','fh4.jpg'),(4,'Аркада','fh4.jpg'),(5,'Хоррор','fh4.jpg'),(6,'Приключения','fh4.jpg'),(7,'Ролевые игры','fh4.jpg'),(8,'Стратегии','fh4.jpg'),(9,'Симулятор','fh4.jpg'),(11,'RPG','fh4.jpg'),(12,'Экшн','fh4.jpg');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

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
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `fk_game_discounts_game_id` (`game_id`),
  CONSTRAINT `fk_game_discounts_game_id` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_discounts`
--

LOCK TABLES `game_discounts` WRITE;
/*!40000 ALTER TABLE `game_discounts` DISABLE KEYS */;
INSERT INTO `game_discounts` VALUES (1,1,20,'2025-06-01 00:00:00','2025-06-30 23:59:59',1),(2,2,15,'2025-06-01 00:00:00','2025-06-30 23:59:59',1),(3,3,25,'2025-06-01 00:00:00','2025-06-30 23:59:59',1),(4,4,10,'2025-06-01 00:00:00','2025-06-30 23:59:59',1),(5,5,30,'2025-06-01 00:00:00','2025-06-30 23:59:59',1);
/*!40000 ALTER TABLE `game_discounts` ENABLE KEYS */;
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
INSERT INTO `game_genre` VALUES (5,1),(14,1),(15,1),(17,1),(22,1),(2,2),(4,2),(9,2),(25,3),(26,3),(27,3),(27,4),(28,4),(29,4),(30,4),(31,5),(32,5),(33,5),(8,6),(10,6),(11,6),(16,6),(17,6),(19,6),(21,6),(24,6),(29,6),(10,7),(12,7),(15,7),(16,7),(20,7),(23,7),(34,8),(35,8),(36,8),(19,9),(30,9),(1,11),(3,11),(15,11),(16,11),(20,11),(23,11),(1,12),(3,12),(6,12),(7,12),(8,12),(10,12),(11,12),(12,12),(13,12),(15,12),(16,12),(17,12),(21,12),(22,12),(23,12),(24,12),(28,12),(29,12),(31,12),(32,12);
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
  `description` text NOT NULL,
  `release_date` date DEFAULT NULL,
  `developer` varchar(255) NOT NULL,
  `publisher` varchar(255) NOT NULL,
  `rating` decimal(3,1) DEFAULT NULL,
  `img` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `game_id` (`game_id`),
  CONSTRAINT `fk_game_info_game_id` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_info`
--

LOCK TABLES `game_info` WRITE;
/*!40000 ALTER TABLE `game_info` DISABLE KEYS */;
INSERT INTO `game_info` VALUES (1,1,'Fallout 4 - это постапокалиптическая ролевая игра, действие которой происходит в Бостоне после ядерной войны. Игроки исследуют открытый мир, выполняют квесты и развивают своего персонажа.','2015-11-10','Bethesda Game Studios','Bethesda Softworks',8.5,'fallout4.jpg'),(2,2,'Forza Horizon 5 - это гоночная игра с открытым миром, действие которой происходит в Мексике. Игроки могут участвовать в гонках, исследовать мир и настраивать свои автомобили.','2021-11-09','Playground Games','Xbox Game Studios',9.2,'forza5.jpg'),(3,3,'Deus Ex: Mankind Divided - это научно-фантастическая ролевая игра с элементами стелс-экшена. Игроки управляют агентом Адамом Дженсеном в мире, где люди с технологическими улучшениями подвергаются дискриминации.','2016-08-23','Eidos Montréal','Square Enix',8.0,'demn.jpeg'),(4,4,'Forza Horizon 4 - это гоночная игра с открытым миром, действие которой происходит в Великобритании. Игроки могут участвовать в гонках, исследовать мир и настраивать свои автомобили.','2018-10-02','Playground Games','Microsoft Studios',9.0,'forza4.jpg'),(5,5,'Battlefield 2042 - это шутер от первого лица, действие которого происходит в недалеком будущем. Игроки сражаются в масштабных сражениях с использованием передовых технологий.','2021-11-19','DICE','Electronic Arts',7.5,'battlefield2042.webp'),(6,6,'Ghost of Tsushima - это приключенческая игра с открытым миром, действие которой происходит в Японии XIII века. Игроки управляют самураем Дзином Сакаем, защищающим остров Цусима от монгольского вторжения.','2020-07-17','Sucker Punch Productions','Sony Interactive Entertainment',9.3,'tsushima.jpg'),(7,7,'Mortal Kombat 11 - это файтинг, в котором игроки сражаются в жестоких поединках с использованием различных персонажей и их уникальных способностей.','2019-04-23','NetherRealm Studios','Warner Bros. Interactive Entertainment',8.5,'mk11.jpg'),(8,8,'Red Dead Redemption 2 - это приключенческая игра с открытым миром, действие которой происходит на Диком Западе. Игроки управляют Артуром Морганом, членом банды Ван дер Линде.','2018-10-26','Rockstar Games','Rockstar Games',9.7,'rdr2.jpg'),(9,9,'The Crew Motorfest - это гоночная игра с открытым миром, действие которой происходит на Гавайях. Игроки могут участвовать в различных гонках и настраивать свои автомобили.','2023-09-14','Ubisoft Ivory Tower','Ubisoft',8.2,'crew.jpeg'),(10,10,'Lies of P - это ролевая игра в стиле душслайк, действие которой происходит в альтернативной версии города Крако. Игроки управляют Пиноккио, который должен найти мистера Джеппетто.','2023-09-19','Neowiz Games','Neowiz',8.8,'p.jpeg'),(11,11,'Sea of Thieves - это приключенческая игра с открытым миром, в которой игроки становятся пиратами и исследуют моря, сражаются с другими пиратами и ищут сокровища.','2018-03-20','Rare','Xbox Game Studios',8.0,'sea.jpg'),(12,12,'Elden Ring - это ролевая игра в жанре душслайк, разработанная в сотрудничестве с Джорджем Р.Р. Мартином. Игроки исследуют открытый мир и сражаются с могущественными противниками.','2022-02-25','FromSoftware','Bandai Namco Entertainment',9.5,'elden.avif'),(13,13,'Helldivers 2 - это кооперативный шутер от третьего лица, в котором игроки сражаются с инопланетными захватчиками на различных планетах.','2024-02-08','Arrowhead Game Studios','Sony Interactive Entertainment',9.0,'hell.webp'),(14,14,'Star Wars: Battlefront II - это шутер от первого и третьего лица, действие которого происходит во вселенной Звездных войн. Игроки могут сражаться на стороне Сопротивления или Первого Ордена.','2017-11-17','DICE','Electronic Arts',8.3,'starWarsBattlefront2.png'),(15,15,'Cyberpunk 2077 — приключенческая ролевая игра, действие которой происходит в мегаполисе Найт-Сити, где власть, роскошь и модификации тела ценятся выше всего.','2020-12-10','CD Projekt Red','CD Projekt',7.9,'cyberpunk.jpg'),(16,16,'Ведьмак 3: Дикая Охота — это история о профессиональном охотнике на чудовищ Геральте из Ривии. Игра завершает сагу, начатую в первых двух частях трилогии.','2015-05-19','CD Projekt Red','CD Projekt',9.8,'witcher3.jpg'),(17,17,'Grand Theft Auto V для PC позволяет игрокам исследовать знаменитый мир Лос-Сантоса и округа Блэйн в разрешении до 4K и с частотой 60 кадров в секунду.','2015-04-14','Rockstar North','Rockstar Games',9.6,'gta5.jpg'),(19,19,'Minecraft — это игра, в которой вы размещаете блоки и создаете невероятные приключения. Исследуйте бесконечные миры и стройте что угодно!','2011-11-18','Mojang Studios','Xbox Game Studios',9.5,'minecraft.jpg'),(20,20,'Baldur\'s Gate 3 — это история о темстве и интригах в мире Forgotten Realms. Соберите свою команду и вернитесь в Забытые Королевства.','2023-08-03','Larian Studios','Larian Studios',9.8,'baldurs.jpg'),(21,21,'The Last of Us Part I — это переосмысление оригинальной игры с улучшенной графикой и геймплеем. История Джоэла и Элли начинается заново.','2022-09-02','Naughty Dog','Sony Interactive Entertainment',9.2,'tlou.jpg'),(22,22,'Call of Duty: Modern Warfare III — это прямое продолжение событий Modern Warfare II. Капитан Прайс и команда 141 возвращаются.','2023-11-10','Sledgehammer Games','Activision',7.8,'cod.jpg'),(23,23,'Hogwarts Legacy — это ролевая игра с открытым миром, действие которой происходит в мире Гарри Поттера. Окунитесь в жизнь студента Хогвартса.','2023-02-10','Avalanche Software','Warner Bros. Games',8.6,'hogwarts.jpg'),(24,24,'God of War — это переосмысление знаменитой франшизы. Кратос вместе со своим сыном Атреем отправляется в опасное путешествие.','2022-01-14','Santa Monica Studio','PlayStation PC LLC',9.4,'gow.jpg'),(25,25,'FIFA 23 - футбольный симулятор с улучшенной физикой, женскими клубами и технологией HyperMotion2.','2022-09-30','EA Vancouver','Electronic Arts',8.0,'fifa23.webp'),(26,26,'NBA 2K24 - баскетбольный симулятор с улучшенной графикой, новыми режимами и легендарными игроками.','2023-09-08','Visual Concepts','2K Sports',7.8,'nba2k24.webp'),(27,27,'Rocket League - футбол на автомобилях-ракетах. Динамичная аркадная игра с элементами спорта.','2015-07-07','Psyonix','Psyonix',9.0,'rocket_league.webp'),(28,28,'Cuphead - классический run and gun с уникальным визуальным стилем 1930-х годов. Сложный и красивый платформер.','2017-09-29','Studio MDHR','Studio MDHR',8.8,'cuphead.webp'),(29,29,'Hollow Knight - исследование огромного подземного королевства, наполненного дружелюбными жуками и жуткими тварями.','2017-02-24','Team Cherry','Team Cherry',9.4,'hollow_knight.webp'),(30,30,'Tetris Effect - культовая игра в тетрис с захватывающими визуальными и звуковыми эффектами.','2018-11-09','Monstars','Enhance Games',9.0,'tetris_effect.webp'),(31,31,'Resident Evil Village - восьмая часть культовой хоррор-серии. Исследуйте мрачную деревню и сражайтесь с ужасами.','2021-05-07','Capcom','Capcom',8.5,'re_village.webp'),(32,32,'Dead by Daylight - асимметричный хоррор, где 4 выживших пытаются убежать от убийцы.','2016-06-14','Behaviour Interactive','Behaviour Interactive',7.5,'dbd.webp'),(33,33,'The Outlast Trials - кооперативный хоррор выживания в условиях жестоких экспериментов Холодной войны.','2023-05-18','Red Barrels','Red Barrels',8.2,'outlast_trials.webp'),(34,34,'Civilization VI - постройте великую империю, которая выдержит испытание временем.','2016-10-21','Firaxis Games','2K',9.0,'civ6.webp'),(35,35,'Stellaris - глобальная космическая стратегия с исследованием галактики, дипломатией и войнами.','2016-05-09','Paradox Development Studio','Paradox Interactive',8.8,'stellaris.webp'),(36,36,'Age of Empires IV - возвращение легендарной серии стратегий в реальном времени с историческими кампаниями.','2021-10-28','Relic Entertainment','Xbox Game Studios',8.7,'aoe4.webp');
/*!40000 ALTER TABLE `game_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game_keys`
--

DROP TABLE IF EXISTS `game_keys`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_keys` (
  `id` int NOT NULL AUTO_INCREMENT,
  `game_id` int NOT NULL,
  `key` varchar(255) NOT NULL,
  `status` enum('available','used','reserved') NOT NULL DEFAULT 'available',
  `used_at` timestamp NULL DEFAULT NULL,
  `order_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `game_id` (`game_id`),
  CONSTRAINT `game_keys_ibfk_1` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=181 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_keys`
--

LOCK TABLES `game_keys` WRITE;
/*!40000 ALTER TABLE `game_keys` DISABLE KEYS */;
INSERT INTO `game_keys` VALUES (1,1,'FO4-XXXX-XXXX-XXXX-1','available',NULL,NULL),(2,1,'FO4-XXXX-XXXX-XXXX-2','available',NULL,NULL),(3,1,'FO4-XXXX-XXXX-XXXX-3','available',NULL,NULL),(4,1,'FO4-XXXX-XXXX-XXXX-4','available',NULL,NULL),(5,1,'FO4-XXXX-XXXX-XXXX-5','available',NULL,NULL),(6,2,'FH5-XXXX-XXXX-XXXX-1','available',NULL,NULL),(7,2,'FH5-XXXX-XXXX-XXXX-2','available',NULL,NULL),(8,2,'FH5-XXXX-XXXX-XXXX-3','available',NULL,NULL),(9,2,'FH5-XXXX-XXXX-XXXX-4','available',NULL,NULL),(10,2,'FH5-XXXX-XXXX-XXXX-5','available',NULL,NULL),(11,3,'DXMD-XXXX-XXXX-XXXX-1','available',NULL,NULL),(12,3,'DXMD-XXXX-XXXX-XXXX-2','available',NULL,NULL),(13,3,'DXMD-XXXX-XXXX-XXXX-3','available',NULL,NULL),(14,3,'DXMD-XXXX-XXXX-XXXX-4','available',NULL,NULL),(15,3,'DXMD-XXXX-XXXX-XXXX-5','available',NULL,NULL),(16,4,'FH4-XXXX-XXXX-XXXX-1','available',NULL,NULL),(17,4,'FH4-XXXX-XXXX-XXXX-2','available',NULL,NULL),(18,4,'FH4-XXXX-XXXX-XXXX-3','available',NULL,NULL),(19,4,'FH4-XXXX-XXXX-XXXX-4','available',NULL,NULL),(20,4,'FH4-XXXX-XXXX-XXXX-5','available',NULL,NULL),(21,5,'BF42-XXXX-XXXX-XXXX-1','available',NULL,NULL),(22,5,'BF42-XXXX-XXXX-XXXX-2','available',NULL,NULL),(23,5,'BF42-XXXX-XXXX-XXXX-3','available',NULL,NULL),(24,5,'BF42-XXXX-XXXX-XXXX-4','available',NULL,NULL),(25,5,'BF42-XXXX-XXXX-XXXX-5','available',NULL,NULL),(26,6,'GOT-XXXX-XXXX-XXXX-1','available',NULL,NULL),(27,6,'GOT-XXXX-XXXX-XXXX-2','available',NULL,NULL),(28,6,'GOT-XXXX-XXXX-XXXX-3','available',NULL,NULL),(29,6,'GOT-XXXX-XXXX-XXXX-4','available',NULL,NULL),(30,6,'GOT-XXXX-XXXX-XXXX-5','available',NULL,NULL),(31,7,'MK11-XXXX-XXXX-XXXX-1','available',NULL,NULL),(32,7,'MK11-XXXX-XXXX-XXXX-2','available',NULL,NULL),(33,7,'MK11-XXXX-XXXX-XXXX-3','available',NULL,NULL),(34,7,'MK11-XXXX-XXXX-XXXX-4','available',NULL,NULL),(35,7,'MK11-XXXX-XXXX-XXXX-5','available',NULL,NULL),(36,8,'RDR2-XXXX-XXXX-XXXX-1','available',NULL,NULL),(37,8,'RDR2-XXXX-XXXX-XXXX-2','available',NULL,NULL),(38,8,'RDR2-XXXX-XXXX-XXXX-3','available',NULL,NULL),(39,8,'RDR2-XXXX-XXXX-XXXX-4','available',NULL,NULL),(40,8,'RDR2-XXXX-XXXX-XXXX-5','available',NULL,NULL),(41,9,'TCM-XXXX-XXXX-XXXX-1','available',NULL,NULL),(42,9,'TCM-XXXX-XXXX-XXXX-2','available',NULL,NULL),(43,9,'TCM-XXXX-XXXX-XXXX-3','available',NULL,NULL),(44,9,'TCM-XXXX-XXXX-XXXX-4','available',NULL,NULL),(45,9,'TCM-XXXX-XXXX-XXXX-5','available',NULL,NULL),(46,10,'LOP-XXXX-XXXX-XXXX-1','available',NULL,NULL),(47,10,'LOP-XXXX-XXXX-XXXX-2','available',NULL,NULL),(48,10,'LOP-XXXX-XXXX-XXXX-3','available',NULL,NULL),(49,10,'LOP-XXXX-XXXX-XXXX-4','available',NULL,NULL),(50,10,'LOP-XXXX-XXXX-XXXX-5','available',NULL,NULL),(51,11,'SOT-XXXX-XXXX-XXXX-1','available',NULL,NULL),(52,11,'SOT-XXXX-XXXX-XXXX-2','available',NULL,NULL),(53,11,'SOT-XXXX-XXXX-XXXX-3','available',NULL,NULL),(54,11,'SOT-XXXX-XXXX-XXXX-4','available',NULL,NULL),(55,11,'SOT-XXXX-XXXX-XXXX-5','available',NULL,NULL),(56,12,'ER-XXXX-XXXX-XXXX-1','available',NULL,NULL),(57,12,'ER-XXXX-XXXX-XXXX-2','available',NULL,NULL),(58,12,'ER-XXXX-XXXX-XXXX-3','available',NULL,NULL),(59,12,'ER-XXXX-XXXX-XXXX-4','available',NULL,NULL),(60,12,'ER-XXXX-XXXX-XXXX-5','available',NULL,NULL),(61,13,'HD2-XXXX-XXXX-XXXX-1','available',NULL,NULL),(62,13,'HD2-XXXX-XXXX-XXXX-2','available',NULL,NULL),(63,13,'HD2-XXXX-XXXX-XXXX-3','available',NULL,NULL),(64,13,'HD2-XXXX-XXXX-XXXX-4','available',NULL,NULL),(65,13,'HD2-XXXX-XXXX-XXXX-5','available',NULL,NULL),(66,14,'SWBF2-XXXX-XXXX-XXXX-1','available',NULL,NULL),(67,14,'SWBF2-XXXX-XXXX-XXXX-2','available',NULL,NULL),(68,14,'SWBF2-XXXX-XXXX-XXXX-3','available',NULL,NULL),(69,14,'SWBF2-XXXX-XXXX-XXXX-4','available',NULL,NULL),(70,14,'SWBF2-XXXX-XXXX-XXXX-5','available',NULL,NULL),(71,15,'CP77-XXXX-XXXX-XXXX-1','available',NULL,NULL),(72,15,'CP77-XXXX-XXXX-XXXX-2','available',NULL,NULL),(73,15,'CP77-XXXX-XXXX-XXXX-3','available',NULL,NULL),(74,15,'CP77-XXXX-XXXX-XXXX-4','available',NULL,NULL),(75,15,'CP77-XXXX-XXXX-XXXX-5','available',NULL,NULL),(76,16,'W3-XXXX-XXXX-XXXX-1','available',NULL,NULL),(77,16,'W3-XXXX-XXXX-XXXX-2','available',NULL,NULL),(78,16,'W3-XXXX-XXXX-XXXX-3','available',NULL,NULL),(79,16,'W3-XXXX-XXXX-XXXX-4','available',NULL,NULL),(80,16,'W3-XXXX-XXXX-XXXX-5','available',NULL,NULL),(81,17,'GTA5-XXXX-XXXX-XXXX-1','available',NULL,NULL),(82,17,'GTA5-XXXX-XXXX-XXXX-2','available',NULL,NULL),(83,17,'GTA5-XXXX-XXXX-XXXX-3','available',NULL,NULL),(84,17,'GTA5-XXXX-XXXX-XXXX-4','available',NULL,NULL),(85,17,'GTA5-XXXX-XXXX-XXXX-5','available',NULL,NULL),(91,19,'MC-XXXX-XXXX-XXXX-1','available',NULL,NULL),(92,19,'MC-XXXX-XXXX-XXXX-2','available',NULL,NULL),(93,19,'MC-XXXX-XXXX-XXXX-3','available',NULL,NULL),(94,19,'MC-XXXX-XXXX-XXXX-4','available',NULL,NULL),(95,19,'MC-XXXX-XXXX-XXXX-5','available',NULL,NULL),(96,20,'BG3-XXXX-XXXX-XXXX-1','available',NULL,NULL),(97,20,'BG3-XXXX-XXXX-XXXX-2','available',NULL,NULL),(98,20,'BG3-XXXX-XXXX-XXXX-3','available',NULL,NULL),(99,20,'BG3-XXXX-XXXX-XXXX-4','available',NULL,NULL),(100,20,'BG3-XXXX-XXXX-XXXX-5','available',NULL,NULL),(101,21,'TLOU-XXXX-XXXX-XXXX-1','available',NULL,NULL),(102,21,'TLOU-XXXX-XXXX-XXXX-2','available',NULL,NULL),(103,21,'TLOU-XXXX-XXXX-XXXX-3','available',NULL,NULL),(104,21,'TLOU-XXXX-XXXX-XXXX-4','available',NULL,NULL),(105,21,'TLOU-XXXX-XXXX-XXXX-5','available',NULL,NULL),(106,22,'MW3-XXXX-XXXX-XXXX-1','available',NULL,NULL),(107,22,'MW3-XXXX-XXXX-XXXX-2','available',NULL,NULL),(108,22,'MW3-XXXX-XXXX-XXXX-3','available',NULL,NULL),(109,22,'MW3-XXXX-XXXX-XXXX-4','available',NULL,NULL),(110,22,'MW3-XXXX-XXXX-XXXX-5','available',NULL,NULL),(111,23,'HL-XXXX-XXXX-XXXX-1','available',NULL,NULL),(112,23,'HL-XXXX-XXXX-XXXX-2','available',NULL,NULL),(113,23,'HL-XXXX-XXXX-XXXX-3','available',NULL,NULL),(114,23,'HL-XXXX-XXXX-XXXX-4','available',NULL,NULL),(115,23,'HL-XXXX-XXXX-XXXX-5','available',NULL,NULL),(116,24,'GOW-XXXX-XXXX-XXXX-1','available',NULL,NULL),(117,24,'GOW-XXXX-XXXX-XXXX-2','available',NULL,NULL),(118,24,'GOW-XXXX-XXXX-XXXX-3','available',NULL,NULL),(119,24,'GOW-XXXX-XXXX-XXXX-4','available',NULL,NULL),(120,24,'GOW-XXXX-XXXX-XXXX-5','available',NULL,NULL),(121,25,'FIFA23-XXXX-XXXX-XXXX-1','available',NULL,NULL),(122,25,'FIFA23-XXXX-XXXX-XXXX-2','available',NULL,NULL),(123,25,'FIFA23-XXXX-XXXX-XXXX-3','available',NULL,NULL),(124,25,'FIFA23-XXXX-XXXX-XXXX-4','available',NULL,NULL),(125,25,'FIFA23-XXXX-XXXX-XXXX-5','available',NULL,NULL),(126,26,'NBA24-XXXX-XXXX-XXXX-1','available',NULL,NULL),(127,26,'NBA24-XXXX-XXXX-XXXX-2','available',NULL,NULL),(128,26,'NBA24-XXXX-XXXX-XXXX-3','available',NULL,NULL),(129,26,'NBA24-XXXX-XXXX-XXXX-4','available',NULL,NULL),(130,26,'NBA24-XXXX-XXXX-XXXX-5','available',NULL,NULL),(131,27,'RL-FREE-XXXX-XXXX-1','available',NULL,NULL),(132,27,'RL-FREE-XXXX-XXXX-2','available',NULL,NULL),(133,27,'RL-FREE-XXXX-XXXX-3','available',NULL,NULL),(134,27,'RL-FREE-XXXX-XXXX-4','available',NULL,NULL),(135,27,'RL-FREE-XXXX-XXXX-5','available',NULL,NULL),(136,28,'CUPH-XXXX-XXXX-XXXX-1','available',NULL,NULL),(137,28,'CUPH-XXXX-XXXX-XXXX-2','available',NULL,NULL),(138,28,'CUPH-XXXX-XXXX-XXXX-3','available',NULL,NULL),(139,28,'CUPH-XXXX-XXXX-XXXX-4','available',NULL,NULL),(140,28,'CUPH-XXXX-XXXX-XXXX-5','available',NULL,NULL),(141,29,'HKNT-XXXX-XXXX-XXXX-1','available',NULL,NULL),(142,29,'HKNT-XXXX-XXXX-XXXX-2','available',NULL,NULL),(143,29,'HKNT-XXXX-XXXX-XXXX-3','available',NULL,NULL),(144,29,'HKNT-XXXX-XXXX-XXXX-4','available',NULL,NULL),(145,29,'HKNT-XXXX-XXXX-XXXX-5','available',NULL,NULL),(146,30,'TETR-XXXX-XXXX-XXXX-1','available',NULL,NULL),(147,30,'TETR-XXXX-XXXX-XXXX-2','available',NULL,NULL),(148,30,'TETR-XXXX-XXXX-XXXX-3','available',NULL,NULL),(149,30,'TETR-XXXX-XXXX-XXXX-4','available',NULL,NULL),(150,30,'TETR-XXXX-XXXX-XXXX-5','available',NULL,NULL),(151,31,'RE8-XXXX-XXXX-XXXX-1','available',NULL,NULL),(152,31,'RE8-XXXX-XXXX-XXXX-2','available',NULL,NULL),(153,31,'RE8-XXXX-XXXX-XXXX-3','available',NULL,NULL),(154,31,'RE8-XXXX-XXXX-XXXX-4','available',NULL,NULL),(155,31,'RE8-XXXX-XXXX-XXXX-5','available',NULL,NULL),(156,32,'DBD-XXXX-XXXX-XXXX-1','available',NULL,NULL),(157,32,'DBD-XXXX-XXXX-XXXX-2','available',NULL,NULL),(158,32,'DBD-XXXX-XXXX-XXXX-3','available',NULL,NULL),(159,32,'DBD-XXXX-XXXX-XXXX-4','available',NULL,NULL),(160,32,'DBD-XXXX-XXXX-XXXX-5','available',NULL,NULL),(161,33,'OUTL-XXXX-XXXX-XXXX-1','available',NULL,NULL),(162,33,'OUTL-XXXX-XXXX-XXXX-2','available',NULL,NULL),(163,33,'OUTL-XXXX-XXXX-XXXX-3','available',NULL,NULL),(164,33,'OUTL-XXXX-XXXX-XXXX-4','available',NULL,NULL),(165,33,'OUTL-XXXX-XXXX-XXXX-5','available',NULL,NULL),(166,34,'CIV6-XXXX-XXXX-XXXX-1','available',NULL,NULL),(167,34,'CIV6-XXXX-XXXX-XXXX-2','available',NULL,NULL),(168,34,'CIV6-XXXX-XXXX-XXXX-3','available',NULL,NULL),(169,34,'CIV6-XXXX-XXXX-XXXX-4','available',NULL,NULL),(170,34,'CIV6-XXXX-XXXX-XXXX-5','available',NULL,NULL),(171,35,'STEL-XXXX-XXXX-XXXX-1','available',NULL,NULL),(172,35,'STEL-XXXX-XXXX-XXXX-2','available',NULL,NULL),(173,35,'STEL-XXXX-XXXX-XXXX-3','available',NULL,NULL),(174,35,'STEL-XXXX-XXXX-XXXX-4','available',NULL,NULL),(175,35,'STEL-XXXX-XXXX-XXXX-5','available',NULL,NULL),(176,36,'AOE4-XXXX-XXXX-XXXX-1','available',NULL,NULL),(177,36,'AOE4-XXXX-XXXX-XXXX-2','available',NULL,NULL),(178,36,'AOE4-XXXX-XXXX-XXXX-3','available',NULL,NULL),(179,36,'AOE4-XXXX-XXXX-XXXX-4','available',NULL,NULL),(180,36,'AOE4-XXXX-XXXX-XXXX-5','available',NULL,NULL);
/*!40000 ALTER TABLE `game_keys` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `games`
--

LOCK TABLES `games` WRITE;
/*!40000 ALTER TABLE `games` DISABLE KEYS */;
INSERT INTO `games` VALUES (1,'Fallout 4','fallout4.jpg',1299),(2,'Forza Horizon 5','forza5.jpg',3899),(3,'Deus Ex: Mankind Divided','demn.jpeg',1399),(4,'Forza Horizon 4','forza4.jpg',1499),(5,'Battlefield 2042','battlefield2042.webp',4199),(6,'Ghost of Tsushima','tsushima.jpg',4299),(7,'Mortal Combat 11','mk11.jpg',499),(8,'Red Dead Redemption 2','rdr2.jpg',3499),(9,'The Crew Motorfest','crew.jpeg',2199),(10,'Lies of P','p.jpeg',4599),(11,'Sea of Thieves','sea.jpg',2599),(12,'Elden Ring','elden.avif',3999),(13,'Helldivers 2','hell.webp',2999),(14,'Star Wars: Battlefront II','starWarsBattlefront2.png',999),(15,'Cyberpunk 2077','cyberpunk.jpg',2499),(16,'The Witcher 3: Wild Hunt','witcher3.jpg',1299),(17,'Grand Theft Auto V','gta5.webp',1499),(19,'Minecraft','minecraft.webp',1999),(20,'Baldur\'s Gate 3','baldurs_gate3.jpg',4599),(21,'The Last of Us Part I','tlou.webp',3999),(22,'Call of Duty: Modern Warfare III','cod.webp',4999),(23,'Hogwarts Legacy','hogwarts_legacy.jpg',4199),(24,'God of War','gow.jpg',3799),(25,'FIFA 23','fifa23.jpg',3499),(26,'NBA 2K24','nba2k24.webp',3999),(27,'Rocket League','rocket_league.jpg',1499),(28,'Cuphead','cuphead.jpg',899),(29,'Hollow Knight','hollow_knight.webp',499),(30,'Tetris Effect','tetris_effect.jpg',1299),(31,'Resident Evil Village','re_village.jpg',2999),(32,'Dead by Daylight','dbd.jpg',699),(33,'The Outlast Trials','outlast_trials.webp',1999),(34,'Civilization VI','civ6.avif',1499),(35,'Stellaris','stellaris.webp',999),(36,'Age of Empires IV','aoe4.webp',2499);
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
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system_req_max`
--

LOCK TABLES `system_req_max` WRITE;
/*!40000 ALTER TABLE `system_req_max` DISABLE KEYS */;
INSERT INTO `system_req_max` VALUES (1,'10','Ryzen 5 1500X или Intel i5-8400','16','Radeon RX 590 или GeForce GTX 1070','12','110 ГБ',2),(2,'10','Intel Core i7 4790 3.6 GHz / AMD FX-9590 4.7 GHz','8','NVIDIA GTX 780 3GB / AMD Radeon R9 290X 4GB','11','30 GB',1),(3,'10','Intel Core i7-3770K 3.5 GHz / AMD FX-8350 4.0 GHz','16','NVIDIA GTX 970 4GB / AMD Radeon RX 480 8GB','12','45 GB',3),(4,'10','Intel i7-3820 3.6 GHz','12','NVIDIA GTX 970 / NVIDIA GTX 1060 6GB / AMD R9 290X / AMD RX 470','12','100 GB',4),(5,'10','AMD Ryzen 7 2700X / Intel Core i7 4790','16','AMD Radeon RX 6600 XT / NVIDIA GeForce RTX 3060','12','100 GB',5),(6,'10','Intel Core i5-8600 / AMD Ryzen 5 3600','16','NVIDIA GeForce RTX 2060 / AMD Radeon RX 5600 XT','12','75 GB',6),(7,'10','Intel Core i5-2300, 2.8 GHz / AMD FX-6300, 3.5 GHz','8','NVIDIA GeForce GTX 780 / AMD Radeon R9 290 / AMD RX 570','11','60 GB',7),(8,'10','Intel Core i7-4770K / AMD Ryzen 5 1500X','12','NVIDIA GeForce GTX 1060 6GB / AMD Radeon RX 480 4GB','12','150 GB',8),(9,'10','Intel Core i7-4790 / AMD Ryzen 5 1600','16','NVIDIA GeForce GTX 1070 / AMD Radeon RX 5700','12','50 GB',9),(10,'10','Intel Core i7-8700 / AMD Ryzen 5 3600','16','NVIDIA GeForce GTX 1660 Ti / AMD Radeon RX 5700','12','50 GB',10),(11,'10','Intel i5 4690 3.5GHz / AMD FX-8150 3.6 GHz','8','NVIDIA GeForce GTX 770 / AMD Radeon R9 380x','11','50 GB',11),(12,'10','Intel Core i7-8700K / AMD Ryzen 5 3600X','16','NVIDIA GeForce GTX 1070 8GB / AMD Radeon RX Vega 56 8GB','12','60 GB',12),(13,'10','Intel Core i7-4770K / AMD Ryzen 5 1500X','16','NVIDIA GeForce GTX 1060 6GB / AMD Radeon RX 580','12','50 GB',13),(15,'10','Intel Core i7 6700 / AMD Ryzen 7 1700','16','NVIDIA GeForce GTX 1060 3GB / AMD Radeon RX 480 4GB','11','15 GB',14),(16,'10','Intel Core i7-4790 / AMD Ryzen 3 3200G','16','NVIDIA GTX 1060 / AMD Radeon RX 590','12','70 GB',15),(17,'10','Intel Core i7-3770 / AMD FX-8350','8','NVIDIA GTX 770 / AMD Radeon RX 480','11','40 GB',16),(20,'10','Intel Core i5-4690 / AMD A10-7800','8','NVIDIA GeForce 700 / AMD Radeon Rx 200','11','4 GB',19),(21,'10','Intel i7-8700K / AMD r5 3600','16','NVIDIA RTX 2060 / AMD RX 5700','12','150 GB',20),(22,'10','Intel Core i7-8700K / AMD Ryzen 5 3600X','16','NVIDIA RTX 2070 / AMD RX 5700 XT','12','100 GB',21),(23,'10','Intel Core i7-6700K / AMD Ryzen 5 1600X','16','NVIDIA GTX 1080 / AMD RX Vega 64','12','125 GB',22),(24,'10','Intel Core i7-8700 / AMD Ryzen 5 3600','16','NVIDIA 1080 Ti / AMD RX 5700 XT','12','85 GB',23),(25,'10','Intel i7-4770k / AMD Ryzen 5 1500X','8','NVIDIA GTX 1060 / AMD RX 580','11','70 GB',24),(26,'10','Intel Core i7-6700 / AMD Ryzen 7 2700X','12','NVIDIA GTX 1660 / AMD RX 5600 XT','12','100 GB',25),(27,'10','Intel Core i5-4430 / AMD FX-8370','8','NVIDIA GTX 1060 / AMD RX 580','12','110 GB',26),(28,'10','Intel Core i5-2300 / AMD FX-6300','4','NVIDIA GTX 660 / AMD HD 7950','11','20 GB',27),(29,'10','Intel Core i5-2300 / AMD FX-6300','4','NVIDIA GTX 960 / AMD Radeon HD 7950','11','4 GB',28),(30,'10','Intel Core i5','8','NVIDIA GTX 560 / AMD HD 6850','11','9 GB',29),(31,'10','Intel Core i7-7700K / AMD Ryzen 7 1700X','8','NVIDIA GTX 1070 / AMD RX Vega 56','12','20 GB',30),(32,'10','Intel Core i7-8700 / AMD Ryzen 5 3600','16','NVIDIA RTX 2070 / AMD RX 5700 XT','12','36 GB',31),(33,'10','Intel Core i5-8400 / AMD Ryzen 5 2600X','8','NVIDIA GTX 1070 / AMD Radeon RX 590','11','30 GB',32),(34,'10','Intel Core i7-9700K / AMD Ryzen 7 3700X','16','NVIDIA RTX 3060 / AMD Radeon RX 5700 XT','12','26 GB',33),(35,'10','Intel Core i5 / AMD Ryzen 5','8','NVIDIA GTX 770 / AMD Radeon R9 380','11','16 GB',34),(36,'10','Intel Core i5-3570K / AMD Ryzen 5 2400G','8','NVIDIA GTX 560 Ti / AMD Radeon R7 370','11','10 GB',35),(37,'10','Intel Core i5-6300U / AMD Ryzen 5 2400G','16','NVIDIA GTX 970 / AMD Radeon R9 390','11','50 GB',36),(38,'10','Intel Core i5 3470 / AMD X8 FX-8350','8','NVIDIA GTX 660 / AMD HD 7870','11','72 GB',17);
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
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system_req_min`
--

LOCK TABLES `system_req_min` WRITE;
/*!40000 ALTER TABLE `system_req_min` DISABLE KEYS */;
INSERT INTO `system_req_min` VALUES (1,'10','Intel Core i5-4460 или AMD Ryzen 3 1200','8','NVIDIA GeForce GTX 970 или AMD Radeon RX 470','12','110',2),(2,'7','Intel Core i5-2300 2.8 GHz / AMD Phenom II X4 945 3.0 GHz','8','NVIDIA GTX 550 Ti 2GB / AMD Radeon HD 7870 2GB','11','30 GB',1),(3,'7','Intel Core i3-2100T 2.5 GHz / AMD Phenom II X4 940 3.0 GHz','8','NVIDIA GTX 660 2GB / AMD Radeon HD 7870 2GB','11','45 GB',3),(4,'10','Intel i3-4170 3.7 GHz / Intel i5 750 2.67 GHz','8','NVIDIA GTX 650 Ti / AMD R7 250X','12','80 GB',4),(5,'10','AMD Ryzen 5 1600 / Intel Core i5 6600K','8','AMD Radeon RX 560 / NVIDIA GeForce GTX 1050 Ti','12','100 GB',5),(6,'10','Intel Core i3-7100 / AMD Ryzen 3 1200','8','NVIDIA GeForce GTX 960 / AMD Radeon RX 5500 XT','12','75 GB',6),(7,'7','Intel Core i5-750, 2.67 GHz / AMD Phenom II X4 965, 3.4 GHz','8','NVIDIA GeForce GTX 670 / NVIDIA GeForce GTX 1050 / AMD Radeon HD 7950','11','60 GB',7),(8,'7','Intel Core i5-2500K / AMD FX-6300','8','NVIDIA GeForce GTX 770 2GB / AMD Radeon R9 280 3GB','12','150 GB',8),(9,'10','Intel Core i5-4460 / AMD Ryzen 3 1200','8','NVIDIA GeForce GTX 960 / AMD Radeon RX 470','12','50 GB',9),(10,'10','Intel Core i5-7500 / AMD Ryzen 3 1200','8','NVIDIA GeForce GTX 1050 Ti / AMD Radeon RX 560','12','50 GB',10),(11,'10','Intel Q9450 2.6GHz / AMD Phenom II X6 3.3 GHz','4','NVIDIA GeForce GTX 650 / AMD Radeon 7750','11','50 GB',11),(12,'10','Intel Core i5-8400 / AMD Ryzen 3 3300X','12','NVIDIA GeForce GTX 1060 3GB / AMD Radeon RX 580 4GB','12','60 GB',12),(13,'10','Intel Core i5-6600 / AMD Ryzen 3 1200','8','NVIDIA GeForce GTX 1050 Ti / AMD Radeon RX 560','12','50 GB',13),(15,'7','Intel Core i5 6600K / AMD FX-6350','8','NVIDIA GeForce GTX 660 2GB / AMD Radeon HD 7850 2GB','11','15 GB',14),(16,'10','Intel Core i5-3570K / AMD FX-8310','8','NVIDIA GTX 780 / AMD Radeon RX 470','12','70 GB',15),(17,'7','Intel Core i5-2500K / AMD FX-6300','6','NVIDIA GTX 660 / AMD HD 7870','11','40 GB',16),(20,'10','Intel Core i3-3210 / AMD A8-7600','4','Intel HD Graphics 4000 / AMD Radeon R5','11','1 GB',19),(21,'10','Intel i5-4690 / AMD RX 1500X','8','NVIDIA GTX 970 / AMD RX 480','11','150 GB',20),(22,'10','Intel Core i7-4770K / AMD Ryzen 5 1500X','16','NVIDIA GTX 970 / AMD Radeon RX 470','12','100 GB',21),(23,'10','Intel Core i5-6600 / AMD Ryzen 5 1400','8','NVIDIA GTX 960 / AMD Radeon RX 470','12','125 GB',22),(24,'10','Intel Core i5-6600 / AMD Ryzen 5 1400','16','NVIDIA GTX 960 / AMD Radeon RX 470','12','85 GB',23),(25,'10','Intel i5-2500k / AMD Ryzen 3 1200','8','NVIDIA GTX 960 / AMD R9 290X','11','70 GB',24),(26,'10','Intel Core i5-6600K / AMD Ryzen 5 1600','8','NVIDIA GTX 1050 Ti / AMD RX 570','12','100 GB',25),(27,'10','Intel Core i3-6100 / AMD FX-4350','8','NVIDIA GTX 660 2GB / AMD HD 7850 2GB','11','110 GB',26),(28,'7','Intel Core 2 Duo E4600 / AMD Athlon 64 X2','2','NVIDIA 8800 GT / AMD HD 2900 PRO','9','7 GB',27),(29,'7','Intel Core2 Duo E8400 / AMD Athlon 64 X2 6000+','2','GeForce 9600 GT / AMD HD 3870','9','4 GB',28),(30,'7','Intel Core 2 Duo E5200','4','GeForce 9800GTX+ / AMD HD 3470','10','9 GB',29),(31,'10','Intel Core i5-7500 / AMD Ryzen 3 1200','8','NVIDIA GTX 1050 Ti / AMD RX 560','12','20 GB',30),(32,'10','Intel Core i5-7500 / AMD Ryzen 3 1200','8','NVIDIA GTX 1050 Ti / AMD Radeon RX 560','12','36 GB',31),(33,'10','Intel Core i3-6100 / AMD FX-4350','8','NVIDIA GTX 760 / AMD Radeon HD 7950','11','30 GB',32),(34,'10','Intel Core i3-4160 / AMD Ryzen 3 1200','8','NVIDIA GTX 950 / AMD Radeon R9 270','11','26 GB',33),(35,'7','Intel Core i3 2.5 GHz / AMD Phenom II 2.6 GHz','4','1 GB DirectX 11 Video Card','11','12 GB',34),(36,'10','Intel Core i3-530 / AMD FX-4100','4','NVIDIA GeForce GTX 460 / AMD Radeon HD 5870','11','10 GB',35),(37,'10','Intel Core i5-6300U / AMD Ryzen 5 2400G','8','Intel HD 520 / AMD Radeon RX Vega 11','11','50 GB',36),(38,'7','Intel Core 2 Quad CPU Q6600 / AMD Phenom 9850','4','NVIDIA 9800 GT / AMD HD 4870','10','72 GB',17);
/*!40000 ALTER TABLE `system_req_min` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_games`
--

DROP TABLE IF EXISTS `user_games`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_games` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `game_id` int NOT NULL,
  `purchase_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `key_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `game_id` (`game_id`),
  KEY `key_id` (`key_id`),
  KEY `idx_email` (`email`),
  CONSTRAINT `user_games_ibfk_1` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_games_ibfk_2` FOREIGN KEY (`key_id`) REFERENCES `game_keys` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_games`
--

LOCK TABLES `user_games` WRITE;
/*!40000 ALTER TABLE `user_games` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_games` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-16 21:40:10
