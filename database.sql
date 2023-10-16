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
  Food VARCHAR(30) NOT NULL,
  RestaurantID CHAR(3) NOT NULL,
  Custom VARCHAR(20) NOT NULL,
  PRIMARY KEY (Food, RestaurantID, Custom),
  FOREIGN KEY (Food, RestaurantID) REFERENCES MENU(Food, RestaurantID)
);

CREATE TABLE CUSTOM_OPTION
(
  Food VARCHAR(30) NOT NULL,
  RestaurantID CHAR(3) NOT NULL,
  Custom VARCHAR(20) NOT NULL,
  OptionName VARCHAR(20) NOT NULL,
  PRIMARY KEY (Food, RestaurantID, Custom, OptionName),
  FOREIGN KEY (Food, RestaurantID, Custom) REFERENCES FOOD_CUSTOM(Food, RestaurantID, Custom)
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
  RestaurantID CHAR(3) NOT NULL,
  Note VARCHAR(100) NULL,
  Confirmed BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (CustomerID, Food, RestaurantID),
  FOREIGN KEY (CustomerID) REFERENCES CUSTOMER(CustomerID),
  FOREIGN KEY (Food, RestaurantID) REFERENCES MENU(Food, RestaurantID)
);