CREATE DATABASE food;
USE food;
CREATE TABLE user(
    user_id INT PRIMARY KEY,
    email VARCHAR(200) NOT NULL ,
    username VARCHAR(300),
    password VARCHAR(200) NOT NULL,
    role ENUM('chef','customer')
);

