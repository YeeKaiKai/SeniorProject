CREATE TABLE RESTAURANT
(
  RestaurantID CHAR(3) NOT NULL,
  RestaurantName VARCHAR(30) NOT NULL,
  Address VARCHAR(60) NOT NULL,
  PRIMARY KEY (RestaurantID)
);

CREATE TABLE `TABLE`
(
  TableNumber CHAR(3) NOT NULL,
  TableAmount INT NOT NULL,
  RestaurantID CHAR(3) NOT NULL,
  PRIMARY KEY (TableNumber, RestaurantID),
  FOREIGN KEY (RestaurantID) REFERENCES RESTAURANT(RestaurantID)
);

CREATE TABLE MENU
(
  Food VARCHAR(30) NOT NULL,
  Description VARCHAR(100) NOT NULL,
  Quantity INT NOT NULL,
  Category VARCHAR(20) NOT NULL,
  Ingredient VARCHAR(100) NOT NULL,
  Price INT NOT NULL,
  RestaurantID CHAR(3) NOT NULL,
  PRIMARY KEY (Food, RestaurantID),
  FOREIGN KEY (RestaurantID) REFERENCES RESTAURANT(RestaurantID)
);

CREATE TABLE FOOD_CUSTOM
(
  Custom VARCHAR(20) NOT NULL,
  MinOption INT NOT NULL,
  MaxOption INT NOT NULL,
  RestaurantID CHAR(3) NOT NULL,
  PRIMARY KEY (Custom, RestaurantID),
  FOREIGN KEY (RestaurantID) REFERENCES RESTAURANT(RestaurantID)
);

CREATE TABLE CUSTOM_OPTION
(
  `Option` VARCHAR(20) NOT NULL,
  Custom VARCHAR(20) NOT NULL,
  RestaurantID CHAR(3) NOT NULL,
  Price INT NULL,
  PRIMARY KEY (`Option`, Custom, RestaurantID),
  FOREIGN KEY (Custom, RestaurantID) REFERENCES FOOD_CUSTOM(Custom, RestaurantID)
  ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE CUSTOMIZE
(
  Custom VARCHAR(20) NOT NULL,
  Food VARCHAR(30) NOT NULL,
  RestaurantID CHAR(3) NOT NULL,
  PRIMARY KEY (Custom, Food, RestaurantID),
  FOREIGN KEY (Custom, RestaurantID) REFERENCES FOOD_CUSTOM(Custom, RestaurantID),
  FOREIGN KEY (Food, RestaurantID) REFERENCES MENU(Food, RestaurantID)
);

CREATE TABLE CUSTOMER
(
  CustomerName VARCHAR(20) NOT NULL,
  ForHere BOOLEAN NOT NULL,
  CustomerID INT NOT NULL AUTO_INCREMENT,
  TableNumber CHAR(3) NULL,
  RestaurantID CHAR(3) NOT NULL,
  PRIMARY KEY (CustomerID),
  FOREIGN KEY (TableNumber, RestaurantID) REFERENCES `TABLE`(TableNumber, RestaurantID)
);

CREATE TABLE DIALOGUE
(
  Content VARCHAR(200) NOT NULL,
  DialogueID INT NOT NULL AUTO_INCREMENT,
  CustomerID INT NOT NULL,
  PRIMARY KEY (DialogueID, CustomerID),
  FOREIGN KEY (CustomerID) REFERENCES CUSTOMER(CustomerID)
);

CREATE TABLE `ORDER`
(
  Amount INT NOT NULL,
  CustomerID INT NOT NULL,
  Food VARCHAR(30) NOT NULL,
  CustomID INT NOT NULL,
  RestaurantID CHAR(3) NOT NULL,
  Note VARCHAR(100) NULL,
  Confirmed BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (CustomerID, Food, CustomID, RestaurantID),
  FOREIGN KEY (CustomerID) REFERENCES CUSTOMER(CustomerID),
  FOREIGN KEY (Food, RestaurantID) REFERENCES MENU(Food, RestaurantID)
);

CREATE TABLE ORDER_CUSTOMIZE
(
  CustomerID INT NOT NULL,
  Food VARCHAR(30) NOT NULL,
  CustomID INT NOT NULL,
  `Option` VARCHAR(20) NOT NULL,
  Custom VARCHAR(20) NOT NULL,
  RestaurantID CHAR(3) NOT NULL,
  PRIMARY KEY (CustomerID, Food, CustomID, `Option`, Custom, RestaurantID),
  FOREIGN KEY (CustomerID, Food, CustomID, RestaurantID) REFERENCES `ORDER`(CustomerID, Food, CustomID, RestaurantID),
  FOREIGN KEY (`Option`, Custom, RestaurantID) REFERENCES CUSTOM_OPTION(`Option`, Custom, RestaurantID)
);