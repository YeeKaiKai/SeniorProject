CREATE TABLE RESTAURANT
(
  RestaurantName VARCHAR(30) NOT NULL,
  RestaurantName_zh_tw VARCHAR(50) NOT NULL,
  Email VARCHAR(50) NOT NULL,
  `Password` VARCHAR(500) NOT NULL,
  BusinessHours VARCHAR(20) NOT NULL,
  Opening BOOLEAN NOT NULL DEFAULT FALSE,
  TEL VARCHAR(10) NOT NULL,
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
  ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE MENU_CATEGORY
(
  Category VARCHAR(20) NOT NULL,
  MenuAmount INT NULL,
  RestaurantName VARCHAR(30) NOT NULL,
  PRIMARY KEY (Category, RestaurantName),
  FOREIGN KEY (RestaurantName) REFERENCES RESTAURANT(RestaurantName)
  ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE MENU
(
  Food VARCHAR(30) NOT NULL,
  Description VARCHAR(100) NOT NULL,
  DefaultQuantity INT NOT NULL,
  Quantity INT NOT NULL,
  Ingredient VARCHAR(100) NOT NULL,
  Price INT NOT NULL,
  Category VARCHAR(20) NOT NULL,
  RestaurantName VARCHAR(30) NOT NULL,
  PRIMARY KEY (Food, Category, RestaurantName),
  FOREIGN KEY (Category, RestaurantName) REFERENCES MENU_CATEGORY(Category, RestaurantName)
  ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE FOOD_CUSTOM
(
  Custom VARCHAR(20) NOT NULL,
  MinOption INT NOT NULL,
  MaxOption INT NOT NULL,
  RestaurantName VARCHAR(30) NOT NULL,
  PRIMARY KEY (Custom, RestaurantName),
  FOREIGN KEY (RestaurantName) REFERENCES RESTAURANT(RestaurantName)
  ON DELETE CASCADE ON UPDATE CASCADE
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
  Category VARCHAR(20) NOT NULL,
  RestaurantName VARCHAR(30) NOT NULL,
  PRIMARY KEY (Custom, Food, Category, RestaurantName),
  FOREIGN KEY (Custom, RestaurantName) REFERENCES FOOD_CUSTOM(Custom, RestaurantName)
  ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (Food, Category, RestaurantName) REFERENCES MENU(Food, Category, RestaurantName)
  ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE CUSTOMER
(
  ForHere BOOLEAN NULL,
  CustomerID INT NOT NULL,
  TableNumber CHAR(3) NULL,
  RestaurantName VARCHAR(30) NULL,
  PRIMARY KEY (CustomerID),
  FOREIGN KEY (TableNumber, RestaurantName) REFERENCES `TABLE`(TableNumber, RestaurantName)
  ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE DIALOGUE
(
  Content VARCHAR(200) NOT NULL,
  DialogueID INT NOT NULL AUTO_INCREMENT,
  CustomerID INT NOT NULL,
  RestaurantName VARCHAR(30) NOT NULL,
  PRIMARY KEY (DialogueID, CustomerID, RestaurantName),
  FOREIGN KEY (CustomerID) REFERENCES CUSTOMER(CustomerID)
  ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (RestaurantName) REFERENCES RESTAURANT(RestaurantName)
  ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `ORDER`
(
  OrderID INT NOT NULL,
  TotalSum INT NOT NULL,
  RestaurantName VARCHAR(30) NOT NULL,
  OrderNote VARCHAR(100) NULL,
  OrderDate VARCHAR(20) NOT NULL,
  OrderTime VARCHAR(20) NOT NULL,
  ForHere BOOLEAN NOT NULL,
  TableNumber CHAR(3) NULL,
  PhoneNumber CHAR(10) NULL,
  Paid BOOLEAN NOT NULL DEFAULT FALSE,
  OwnerNote VARCHAR(100) NULL,
  PRIMARY KEY (OrderID, RestaurantName),
  FOREIGN KEY (RestaurantName) REFERENCES RESTAURANT(RestaurantName)
  ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE CART
(
  Amount INT NOT NULL,
  CustomerID INT NOT NULL,
  Food VARCHAR(30) NOT NULL,
  Category VARCHAR(20) NOT NULL,
  CustomID INT NOT NULL,
  Note VARCHAR(100) NOT NULL,
  RestaurantName VARCHAR(30) NOT NULL,
  Confirmed BOOLEAN NOT NULL DEFAULT FALSE,
  OrderID INT NULL,
  PRIMARY KEY (CustomerID, Food, Category, CustomID, Note, RestaurantName),
  FOREIGN KEY (CustomerID) REFERENCES CUSTOMER(CustomerID)
  ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (Food, Category, RestaurantName) REFERENCES MENU(Food, Category, RestaurantName)
  ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (OrderID, RestaurantName) REFERENCES `ORDER`(OrderID, RestaurantName)
  ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE CART_CUSTOMIZE
(
  CustomerID INT NOT NULL,
  Food VARCHAR(30) NOT NULL,
  Category VARCHAR(20) NOT NULL,
  CustomID INT NOT NULL,
  Note VARCHAR(100) NOT NULL,
  RestaurantName VARCHAR(30) NOT NULL,
  `Option` VARCHAR(20) NOT NULL,
  Custom VARCHAR(20) NOT NULL,
  PRIMARY KEY (CustomerID, Food, Category, CustomID, Note, RestaurantName, Custom, `Option`),
  FOREIGN KEY (CustomerID, Food, Category, CustomID, Note, RestaurantName) REFERENCES `CART`(CustomerID, Food, Category, CustomID, Note, RestaurantName)
  ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`Option`, Custom, RestaurantName) REFERENCES CUSTOM_OPTION(`Option`, Custom, RestaurantName)
  ON DELETE CASCADE ON UPDATE CASCADE
);