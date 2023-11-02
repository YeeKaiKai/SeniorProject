CREATE TABLE RESTAURANT
(
  RestaurantName VARCHAR(30) NOT NULL,
  RestaurantName_zh_tw VARCHAR(50) NOT NULL,
  Address VARCHAR(60) NOT NULL,
  PRIMARY KEY (RestaurantName)
);

CREATE TABLE `TABLE`
(
  TableNumber CHAR(3) NOT NULL,
  TableAmount INT NOT NULL,
  RestaurantName VARCHAR(30) NOT NULL,
  PRIMARY KEY (TableNumber, RestaurantName),
  FOREIGN KEY (RestaurantName) REFERENCES RESTAURANT(RestaurantName)
);

CREATE TABLE MENU
(
  Food VARCHAR(30) NOT NULL,
  Description VARCHAR(100) NOT NULL,
  Quantity INT NOT NULL,
  Category VARCHAR(20) NOT NULL,
  Ingredient VARCHAR(100) NOT NULL,
  Price INT NOT NULL,
  RestaurantName VARCHAR(30) NOT NULL,
  PRIMARY KEY (Food, RestaurantName),
  FOREIGN KEY (RestaurantName) REFERENCES RESTAURANT(RestaurantName)
);

CREATE TABLE FOOD_CUSTOM
(
  Custom VARCHAR(20) NOT NULL,
  MinOption INT NOT NULL,
  MaxOption INT NOT NULL,
  RestaurantName VARCHAR(30) NOT NULL,
  PRIMARY KEY (Custom, RestaurantName),
  FOREIGN KEY (RestaurantName) REFERENCES RESTAURANT(RestaurantName)
);

CREATE TABLE CUSTOM_OPTION
(
  `Option` VARCHAR(20) NOT NULL,
  Custom VARCHAR(20) NOT NULL,
  RestaurantName VARCHAR(30) NOT NULL,
  OptionPrice INT NULL,
  PRIMARY KEY (`Option`, Custom, RestaurantName),
  FOREIGN KEY (Custom, RestaurantName) REFERENCES FOOD_CUSTOM(Custom, RestaurantName)
  ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE CUSTOMIZE
(
  Custom VARCHAR(20) NOT NULL,
  Food VARCHAR(30) NOT NULL,
  RestaurantName VARCHAR(30) NOT NULL,
  PRIMARY KEY (Custom, Food, RestaurantName),
  FOREIGN KEY (Custom, RestaurantName) REFERENCES FOOD_CUSTOM(Custom, RestaurantName),
  FOREIGN KEY (Food, RestaurantName) REFERENCES MENU(Food, RestaurantName)
);

CREATE TABLE CUSTOMER
(
  ForHere BOOLEAN NULL,
  CustomerID INT NOT NULL,
  TableNumber CHAR(3) NULL,
  RestaurantName VARCHAR(30) NULL,
  PRIMARY KEY (CustomerID),
  FOREIGN KEY (TableNumber, RestaurantName) REFERENCES `TABLE`(TableNumber, RestaurantName)
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
  OrderID INT NOT NULL,
  TotalSum INT NOT NULL,
  RestaurantName VARCHAR(30) NOT NULL,
  OrderDate VARCHAR(20) NOT NULL,
  OrderTime VARCHAR(20) NOT NULL,
  PRIMARY KEY (OrderID, RestaurantName),
  FOREIGN KEY (RestaurantName) REFERENCES RESTAURANT(RestaurantName)
);

CREATE TABLE CART
(
  Amount INT NOT NULL,
  CustomerID INT NOT NULL,
  Food VARCHAR(30) NOT NULL,
  CustomID INT NOT NULL,
  RestaurantName VARCHAR(30) NOT NULL,
  Note VARCHAR(100) NULL,
  Confirmed BOOLEAN NOT NULL DEFAULT FALSE,
  OrderID INT NULL,
  PRIMARY KEY (CustomerID, Food, CustomID, RestaurantName),
  FOREIGN KEY (CustomerID) REFERENCES CUSTOMER(CustomerID),
  FOREIGN KEY (Food, RestaurantName) REFERENCES MENU(Food, RestaurantName),
  FOREIGN KEY (OrderID, RestaurantName) REFERENCES `ORDER`(OrderID, RestaurantName)
);

CREATE TABLE CART_CUSTOMIZE
(
  CustomerID INT NOT NULL,
  Food VARCHAR(30) NOT NULL,
  CustomID INT NOT NULL,
  `Option` VARCHAR(20) NOT NULL,
  Custom VARCHAR(20) NOT NULL,
  RestaurantName VARCHAR(30) NOT NULL,
  PRIMARY KEY (CustomerID, Food, CustomID, `Option`, Custom, RestaurantName),
  FOREIGN KEY (CustomerID, Food, CustomID, RestaurantName) REFERENCES `CART`(CustomerID, Food, CustomID, RestaurantName),
  FOREIGN KEY (`Option`, Custom, RestaurantName) REFERENCES CUSTOM_OPTION(`Option`, Custom, RestaurantName)
);