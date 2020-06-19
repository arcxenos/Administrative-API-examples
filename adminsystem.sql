CREATE DATABASE  IF NOT EXISTS `admin_system` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `admin_system`;
-- MySQL dump 10.13  Distrib 8.0.20, for Win64 (x86_64)
--
-- Host: localhost    Database: admin_system
-- ------------------------------------------------------
-- Server version	8.0.20

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
-- Table structure for table `registeration`
--

DROP TABLE IF EXISTS `registeration`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `registeration` (
  `id` int NOT NULL AUTO_INCREMENT,
  `teacher_email` varchar(45) NOT NULL,
  `student_email` varchar(45) NOT NULL,
  `subject_id` int DEFAULT NULL,
  `lesson_schedule` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `teacher_email_idx` (`teacher_email`),
  KEY `student_email_idx` (`student_email`),
  KEY `subject_id_idx` (`subject_id`),
  CONSTRAINT `student_email` FOREIGN KEY (`student_email`) REFERENCES `student` (`STUDENT_EMAIL`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `subject_id` FOREIGN KEY (`subject_id`) REFERENCES `subject` (`subject_id`),
  CONSTRAINT `teacher_email` FOREIGN KEY (`teacher_email`) REFERENCES `teacher` (`TEACHER_EMAIL`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registeration`
--

LOCK TABLES `registeration` WRITE;
/*!40000 ALTER TABLE `registeration` DISABLE KEYS */;
INSERT INTO `registeration` VALUES (1,'teacherken@gmail.com','studentjon@example.com',NULL,NULL),(2,'teacherken@gmail.com','studenthon@example.com',NULL,NULL),(3,'teacherken@gmail.com','studentjon@example.com',NULL,NULL),(4,'teacherken@gmail.com','studenthon@example.com',NULL,NULL),(5,'teacherken@gmail.com','studentjon@example.com',NULL,NULL),(6,'teacherken@gmail.com','studenthon@example.com',NULL,NULL),(7,'teacherken@gmail.com','studentjon@example.com',NULL,NULL),(8,'teacherken@gmail.com','studenthon@example.com',NULL,NULL),(9,'teacherken@gmail.com','studentjon@example.com',NULL,NULL),(10,'teacherken@gmail.com','studenthon@example.com',NULL,NULL),(11,'teacherken@gmail.com','studentjon@example.com',NULL,NULL),(12,'teacherken@gmail.com','studenthon@example.com',NULL,NULL),(13,'teacherken@gmail.com','studenthon@example.com',NULL,NULL),(14,'teacherken@gmail.com','studentjon@example.com',NULL,NULL),(15,'teacherken@gmail.com','studentjon@example.com',NULL,NULL),(16,'teacherken@gmail.com','studenthon@example.com',NULL,NULL),(17,'teacherken@gmail.com','studentjon@example.com',NULL,NULL),(18,'teacherken@gmail.com','studenthon@example.com',NULL,NULL),(19,'teacherken@gmail.com','studentjon@example.com',NULL,NULL),(20,'teacherken@gmail.com','studenthon@example.com',NULL,NULL),(23,'teacherjim@gmail.com','studentjon@example.com',NULL,NULL),(24,'teacherjim@gmail.com','studenthon@example.com',NULL,NULL),(25,'teacherlam@gmail.com','studenthon@example.com',NULL,NULL),(26,'teacherlam@gmail.com','studentjack@example.com',NULL,NULL),(27,'teacherjim@gmail.com','studentjack@example.com',NULL,NULL),(28,'teacherjim@gmail.com','studenthon@example.com',NULL,NULL),(29,'teacherjim@gmail.com','studentjill@example.com',NULL,NULL),(30,'teacherjim@gmail.com','studentnell@example.com',NULL,NULL),(31,'teacherjim@gmail.com','studentnell@example.com',NULL,NULL),(33,'teacherken@gmail.com','student_only_under_teacher_ken@gmail.com',NULL,NULL),(35,'teacherken@gmail.com','student_only_under_teacher_ken@gmail.com',NULL,NULL),(36,'teacherken@gmail.com','studentjon@example.com',NULL,NULL),(37,'teacherken@gmail.com','student_only_under_teacher_ken@gmail.com',NULL,NULL),(39,'teacherken@gmail.com','student_only_under_teacher_ken@gmail.com',NULL,NULL),(40,'teacherken@gmail.com','studentjon@example.com',NULL,NULL),(41,'teacherken@gmail.com','student_only_under_teacher_ken@gmail.com',NULL,NULL),(42,'teacherken@gmail.com','studentjon@example.com',NULL,NULL),(43,'teachertest@gmail.com','studenttestA@gmail.com',NULL,NULL),(44,'teachertest@gmail.com','studenttestB@example.com',NULL,NULL),(45,'teachertest@gmail.com','studenttestA@gmail.com',NULL,NULL),(46,'teachertest@gmail.com','studenttestB@example.com',NULL,NULL),(47,'teachertest@gmail.com','studenttestA@gmail.com',NULL,NULL),(48,'teachertest@gmail.com','studenttestB@example.com',NULL,NULL),(49,'teachertest@gmail.com','studenttestA@gmail.com',NULL,NULL),(50,'teachertest@gmail.com','studenttestB@example.com',NULL,NULL),(51,'teachertest@gmail.com','studenttestA@gmail.com',NULL,NULL),(52,'teachertest@gmail.com','studenttestB@example.com',NULL,NULL),(53,'teachertest@gmail.com','studenttestA@gmail.com',NULL,NULL),(54,'teachertest@gmail.com','studenttestB@example.com',NULL,NULL),(55,'teachertest@gmail.com','studenttestA@gmail.com',NULL,NULL),(56,'teachertest@gmail.com','studenttestB@example.com',NULL,NULL),(57,'teachertest@gmail.com','studenttestA@gmail.com',NULL,NULL),(58,'teachertest@gmail.com','studenttestB@example.com',NULL,NULL),(59,'teacherken@gmail.com','student_only_under_teacher_ken@gmail.com',NULL,NULL),(61,'teacherjim@gmail.com','studentnell@example.com',NULL,NULL),(62,'teacherjim@gmail.com','student_only_under_teacher_jim@gmail.com',NULL,NULL);
/*!40000 ALTER TABLE `registeration` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student` (
  `STUDENT_EMAIL` varchar(256) NOT NULL,
  `STUDENT_UID` int NOT NULL AUTO_INCREMENT,
  `STUDENT_NAME` varchar(256) DEFAULT NULL,
  `STUDENT_STATUS` varchar(45) DEFAULT 'ENROLLED',
  PRIMARY KEY (`STUDENT_EMAIL`),
  UNIQUE KEY `STUDENT_EMAIL_UNIQUE` (`STUDENT_EMAIL`),
  UNIQUE KEY `STUDENT_UID_UNIQUE` (`STUDENT_UID`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student`
--

LOCK TABLES `student` WRITE;
/*!40000 ALTER TABLE `student` DISABLE KEYS */;
INSERT INTO `student` VALUES ('student_only_under_teacher_jim@gmail.com',19,NULL,'ENROLLED'),('student_only_under_teacher_ken@gmail.com',16,NULL,'ENROLLED'),('studentagnes@example.com',23,NULL,'ENROLLED'),('studenthon@example.com',12,NULL,'ENROLLED'),('studentjack@example.com',13,NULL,'SUSPENDED'),('studentjill@example.com',14,NULL,'ENROLLED'),('studentjon@example.com',11,NULL,'ENROLLED'),('studentnell@example.com',15,NULL,'ENROLLED'),('studenttestA@gmail.com',17,NULL,'ENROLLED'),('studenttestB@example.com',18,NULL,'SUSPENDED');
/*!40000 ALTER TABLE `student` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subject`
--

DROP TABLE IF EXISTS `subject`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subject` (
  `subject_id` int NOT NULL AUTO_INCREMENT,
  `subject_title` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`subject_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subject`
--

LOCK TABLES `subject` WRITE;
/*!40000 ALTER TABLE `subject` DISABLE KEYS */;
INSERT INTO `subject` VALUES (1,'English'),(2,'Math'),(3,'Science');
/*!40000 ALTER TABLE `subject` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teacher`
--

DROP TABLE IF EXISTS `teacher`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teacher` (
  `TEACHER_EMAIL` varchar(256) NOT NULL,
  `TEACHER_UID` int NOT NULL AUTO_INCREMENT,
  `TEACHER_NAME` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`TEACHER_EMAIL`),
  UNIQUE KEY `teacher_UID_UNIQUE` (`TEACHER_UID`),
  UNIQUE KEY `TEACHER_EMAIL_UNIQUE` (`TEACHER_EMAIL`)
) ENGINE=InnoDB AUTO_INCREMENT=123144 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teacher`
--

LOCK TABLES `teacher` WRITE;
/*!40000 ALTER TABLE `teacher` DISABLE KEYS */;
INSERT INTO `teacher` VALUES ('teacherjim@gmail.com',123141,NULL),('teacherken@gmail.com',123139,NULL),('teacherlam@gmail.com',123142,NULL),('teachertest@gmail.com',123143,NULL);
/*!40000 ALTER TABLE `teacher` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-06-19 22:05:44
