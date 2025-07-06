CREATE DATABASE food;
USE food;
CREATE TABLE user(
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(200) NOT NULL ,
    username VARCHAR(300),
    password VARCHAR(200) NOT NULL,
    role ENUM('chef','customer','admin')
);
INSERT INTO user (email,username,password,role) VALUES("admin@gmail.com","admin","$2a$10$szHaFxbefg73iCmJmxm3J.wiQvhLKPtsUUSgTILi7lZraS8y1y72y","admin");
INSERT INTO user (email,username,password,role) VALUES("chef@gmail.com","chef","$2a$10$CjFpMrh7fguKKVLqeB.a6uZ1dacrq.vmMTFH6MG8CG0WLh8PQc4IG","chef");

CREATE TABLE category(
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(100) NOT NULL,
    category_desc VARCHAR(400) NOT NULL
);
-- DROP TABLE category;
SELECT * FROM category;
-- TRUNCATE TABLE category;
INSERT INTO category (category_name,category_desc) VALUES ("starters","A tempting medley of crispy, spicy, and savory bites that ignite your appetite and set the perfect tone for the feast ahead.");
INSERT INTO category (category_name,category_desc) VALUES ("main course","A hearty and flavorful spread of rich curries, sizzling stir-fries, and comforting classics crafted to satisfy every craving and steal the spotlight.");
INSERT INTO category (category_name,category_desc) VALUES ("desert","An indulgent finale of sweet delights, where every bite melts in your mouth and leaves a lingering taste of bliss.");

CREATE TABLE food_menu(
	food_id INT PRIMARY KEY AUTO_INCREMENT,
    food_name VARCHAR(200) NOT NULL,
    description VARCHAR(400),
    price DECIMAL NOT NULL,
    category_id INT,
    FOREIGN KEY (category_id) REFERENCES category(category_id)
);
-- SET FOREIGN_KEY_CHECKS = 0;
-- DROP TABLE food_menu;
-- SET FOREIGN_KEY_CHECKS = 1;
SELECT * FROM food_menu;
-- SET FOREIGN_KEY_CHECKS = 0;
-- TRUNCATE TABLE food_menu;
-- SET FOREIGN_KEY_CHECKS = 1;
INSERT INTO food_menu (food_name,description,price,category_id) VALUES ("Paneer Tikka" , "Paneer Tikka is a popular Indian appetizer made from marinated paneer cubes grilled or roasted to perfection with spices and vegetables.",300.00,1);
INSERT INTO food_menu (food_name,description,price,category_id) VALUES ("Dahi Kebab" , "Dahi Kebab is a soft and creamy North Indian snack made from hung curd, paneer, and mild spices, lightly pan-fried for a crispy outer layer.",250.00,1);
INSERT INTO food_menu (food_name,description,price,category_id) VALUES ("Sushi" , "Sushi is a traditional Japanese dish made with vinegared rice, often paired with raw or cooked seafood, vegetables, and wrapped in seaweed.",450.00,1);

INSERT INTO food_menu (food_name,description,price,category_id) VALUES ("Thai Curry momos" , "Veg Thai curry momos are soft dumplings stuffed with seasoned vegetables, served in a creamy, mildly spiced Thai curry made with coconut milk, lemongrass, and herbs—a perfect fusion of comfort and flavor.",400.00,2);
INSERT INTO food_menu (food_name,description,price,category_id) VALUES ("Fajitas" , "Veg fajitas are a sizzling Tex-Mex dish made with sautéed bell peppers, onions, and spiced vegetables, served with warm tortillas and toppings like salsa, guacamole, and cheese for a flavorful wrap experience.",500.00,2);
INSERT INTO food_menu (food_name,description,price,category_id) VALUES ("Napolean Pizza" , "Neapolitan pizza (also spelled Napoleon pizza) is a traditional Italian pizza known for its thin, soft, and chewy crust, topped with fresh tomato sauce, mozzarella cheese, basil, and a drizzle of olive oil—baked quickly at high heat for a perfect char.",500.00,2);

INSERT INTO food_menu (food_name,description,price,category_id) VALUES ("Hot Chocolate foutain + icecream" , "A Hot Chocolate Fountain with Ice Cream is an indulgent dessert experience where warm, flowing chocolate is paired with scoops of creamy ice cream—perfect for dipping, drizzling, or just enjoying the rich contrast of hot and cold in every bite.",200.00,3);
INSERT INTO food_menu (food_name,description,price,category_id) VALUES ("Gulab Jamun" , "Gulab Jamun is a classic Indian dessert made of soft, deep-fried milk solids soaked in fragrant sugar syrup, known for its rich sweetness and melt-in-the-mouth texture.",200.00,3);
INSERT INTO food_menu (food_name,description,price,category_id) VALUES ("Kulfi Faluda" , "Kulfi Faluda is a traditional Indian dessert that combines creamy, dense kulfi (frozen milk-based treat) with sweet, chewy faluda noodles, basil seeds, rose syrup, and chilled milk — offering a refreshing and indulgent experience.",150.00,3);

CREATE TABLE order_table(
	order_id INT PRIMARY KEY auto_increment,
    customer_id INT NOT NULL,
    food_status ENUM('completed','left') NOT NULL,
    chef_id INT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES user(user_id),
    FOREIGN KEY (chef_id) REFERENCES user(user_id)
);

CREATE TABLE ordered_items(
	food_id INT NOT NULL,
    quantity INT NOT NULL,
    special_instructions VARCHAR(400),
    order_id INT NOT NULL,
    food_status ENUM('completed','left') NOT NULL,
    PRIMARY KEY (food_id,order_id),
    FOREIGN KEY (food_id) REFERENCES food_menu(food_id),
    FOREIGN KEY (order_id) REFERENCES order_table(order_id)
);

CREATE TABLE payment_table(
	total_price DECIMAL,
    tip DECIMAL,
    payment_status ENUM('completed','left') NOT NULL,
    order_id INT NOT NULL,
    customer_id INT NOT NULL,
    payment_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    FOREIGN KEY (customer_id) REFERENCES user(user_id),
    FOREIGN KEY (order_id) REFERENCES order_table(order_id)
);