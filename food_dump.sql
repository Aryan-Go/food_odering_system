-- MySQL dump 10.13  Distrib 9.3.0, for macos15.2 (arm64)
--
-- Host: localhost    Database: food
-- ------------------------------------------------------
-- Server version	9.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(100) NOT NULL,
  `category_desc` varchar(400) NOT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'starters','A tempting medley of crispy, spicy, and savory bites that ignite your appetite and set the perfect tone for the feast ahead.'),(2,'main course','A hearty and flavorful spread of rich curries, sizzling stir-fries, and comforting classics crafted to satisfy every craving and steal the spotlight.'),(3,'desert','An indulgent finale of sweet delights, where every bite melts in your mouth and leaves a lingering taste of bliss.');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `food_menu`
--

DROP TABLE IF EXISTS `food_menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `food_menu` (
  `food_id` int NOT NULL AUTO_INCREMENT,
  `food_name` varchar(200) NOT NULL,
  `description` varchar(400) DEFAULT NULL,
  `price` decimal(10,0) NOT NULL,
  `category_id` int DEFAULT NULL,
  PRIMARY KEY (`food_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `food_menu_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `food_menu`
--

LOCK TABLES `food_menu` WRITE;
/*!40000 ALTER TABLE `food_menu` DISABLE KEYS */;
INSERT INTO `food_menu` VALUES (1,'Dahi Kebab','Dahi Kebab is a soft and creamy North Indian snack made from hung curd, paneer, and mild spices, lightly pan-fried for a crispy outer layer.',250,1),(2,'Sushi','Sushi is a traditional Japanese dish made with vinegared rice, often paired with raw or cooked seafood, vegetables, and wrapped in seaweed.',450,1),(3,'Paneer Tikka','Paneer Tikka is a popular Indian appetizer made from marinated paneer cubes grilled or roasted to perfection with spices and vegetables.',300,1),(4,'Napolean Pizza','Neapolitan pizza (also spelled Napoleon pizza) is a traditional Italian pizza known for its thin, soft, and chewy crust, topped with fresh tomato sauce, mozzarella cheese, basil, and a drizzle of olive oil—baked quickly at high heat for a perfect char.',500,2),(5,'Fajitas','Veg fajitas are a sizzling Tex-Mex dish made with sautéed bell peppers, onions, and spiced vegetables, served with warm tortillas and toppings like salsa, guacamole, and cheese for a flavorful wrap experience.',500,2),(6,'Thai Curry momos','Veg Thai curry momos are soft dumplings stuffed with seasoned vegetables, served in a creamy, mildly spiced Thai curry made with coconut milk, lemongrass, and herbs—a perfect fusion of comfort and flavor.',400,2),(7,'Kulfi Faluda','Kulfi Faluda is a traditional Indian dessert that combines creamy, dense kulfi (frozen milk-based treat) with sweet, chewy faluda noodles, basil seeds, rose syrup, and chilled milk — offering a refreshing and indulgent experience.',150,3),(8,'Gulab Jamun','Gulab Jamun is a classic Indian dessert made of soft, deep-fried milk solids soaked in fragrant sugar syrup, known for its rich sweetness and melt-in-the-mouth texture.',200,3),(9,'Hot Chocolate foutain + icecream','A Hot Chocolate Fountain with Ice Cream is an indulgent dessert experience where warm, flowing chocolate is paired with scoops of creamy ice cream—perfect for dipping, drizzling, or just enjoying the rich contrast of hot and cold in every bite.',200,3);
/*!40000 ALTER TABLE `food_menu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_table`
--

DROP TABLE IF EXISTS `order_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_table` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int NOT NULL,
  `food_status` enum('completed','left') NOT NULL,
  `chef_id` int NOT NULL,
  PRIMARY KEY (`order_id`),
  KEY `customer_id` (`customer_id`),
  KEY `chef_id` (`chef_id`),
  CONSTRAINT `order_table_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `user` (`user_id`),
  CONSTRAINT `order_table_ibfk_2` FOREIGN KEY (`chef_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_table`
--

LOCK TABLES `order_table` WRITE;
/*!40000 ALTER TABLE `order_table` DISABLE KEYS */;
INSERT INTO `order_table` VALUES (1,3,'completed',2),(2,3,'completed',2),(3,3,'completed',2),(4,3,'completed',2),(5,3,'completed',2),(6,3,'completed',2),(7,3,'completed',2),(8,3,'completed',2),(9,3,'completed',2);
/*!40000 ALTER TABLE `order_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ordered_items`
--

DROP TABLE IF EXISTS `ordered_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ordered_items` (
  `food_id` int NOT NULL,
  `quantity` int NOT NULL,
  `special_instructions` varchar(400) DEFAULT NULL,
  `order_id` int NOT NULL,
  `food_status` enum('completed','left') NOT NULL,
  PRIMARY KEY (`food_id`,`order_id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `ordered_items_ibfk_1` FOREIGN KEY (`food_id`) REFERENCES `food_menu` (`food_id`),
  CONSTRAINT `ordered_items_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `order_table` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ordered_items`
--

LOCK TABLES `ordered_items` WRITE;
/*!40000 ALTER TABLE `ordered_items` DISABLE KEYS */;
INSERT INTO `ordered_items` VALUES (1,2,'jkdkhfkjsh',2,'completed'),(1,2,'jkdkhfkjsh',3,'completed'),(1,2,'jkdkhfkjsh',4,'completed'),(1,2,'wetwertwert',6,'completed'),(1,1,'This is some special instructions',7,'completed'),(1,2,'',8,'completed'),(1,2,'',9,'completed'),(2,2,'jkdkhfkjsh',1,'completed'),(2,2,'jkdkhfkjsh',2,'completed'),(3,2,'jkdkhfkjsh',3,'completed'),(4,2,'jkdkhfkjsh',4,'completed'),(4,2,'',8,'completed'),(5,2,'jkdkhfkjsh',1,'completed'),(7,2,'jkdkhfkjsh',4,'completed');
/*!40000 ALTER TABLE `ordered_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_table`
--

DROP TABLE IF EXISTS `payment_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_table` (
  `total_price` decimal(10,0) DEFAULT NULL,
  `tip` decimal(10,0) DEFAULT NULL,
  `payment_status` enum('completed','left') NOT NULL,
  `order_id` int NOT NULL,
  `customer_id` int NOT NULL,
  `payment_id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`payment_id`),
  KEY `customer_id` (`customer_id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `payment_table_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `user` (`user_id`),
  CONSTRAINT `payment_table_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `order_table` (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_table`
--

LOCK TABLES `payment_table` WRITE;
/*!40000 ALTER TABLE `payment_table` DISABLE KEYS */;
INSERT INTO `payment_table` VALUES (1900,NULL,'completed',1,3,1),(1400,NULL,'completed',2,3,2),(1100,NULL,'completed',3,3,3),(1800,NULL,'completed',4,3,4),(500,NULL,'completed',6,3,5),(250,NULL,'completed',7,3,6),(1500,NULL,'completed',8,3,7),(500,NULL,'completed',9,3,8);
/*!40000 ALTER TABLE `payment_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(200) NOT NULL,
  `username` varchar(300) DEFAULT NULL,
  `password` varchar(200) NOT NULL,
  `role` enum('chef','customer','admin') DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'admin@gmail.com','admin','admin','admin'),(2,'r@g.com','r','$2b$10$ZAHWzS.K52dLcFoCbv1s5.qKJ8b340H5wZ6wjm6240PB0uK/uUGpq','chef'),(3,'goyal.aryan@gmail.com','a','$2b$10$GGWuMAOrz9dJd1M0g0VWMe.eogHrnQpf7W.cetqtu3DZyMNtn.8ri','customer'),(4,'aayush@gmail.com','aayush','$2b$10$gI0b0nk1U52XthQ96QYII.Kn.0Sy4tONqyXYNn8zxW9Dr6vFgoBmG','customer'),(5,'goyal.aryan@gmail.com','a','$2b$10$JdQ/BvtOwvYuRKKBMLN9qu1h4FVEtnOKerlm/Emc3krIeJoV2sVGe','customer');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-04 17:32:30
