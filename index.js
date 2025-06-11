import express from "express";
const app = express();

import cookie_parser from "cookie-parser";
app.use(cookie_parser())

import bcrypt from "bcrypt";

import dotenv from "dotenv";
dotenv.config();
const port = process.env.port
const secret = process.env.secret;

import { fileURLToPath } from "url";
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import { add_data,check_email,find_role,get_food_menu,add_order_table,find_customer_id,chef_id_free } from "./config/database.js";

import jwt from "jsonwebtoken";

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("home.ejs");
})

app.get("/signup", (req, res) => {
    res.render("signup.ejs");
})

app.post("/signup_add", async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    add_data(username, role, hash, email);
    res.redirect("/login");
    
  } catch (error) {
    res.json({
      success: false,
      message: "Some problem in signing up please try again after some time"
    })
  }
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.post("/login_add", async (req, res) => {
    const { email, password } = req.body;
    try {
      const payload = {
        email: email,
        role: await find_role(email),
      }
      if (await check_email(email)) {
        const token = await jwt.sign(payload, secret, { expiresIn: 2 * 60 * 60 });
        console.log(token);
        res.cookie("token", token);
        res.redirect("/auth_reidrect")
      }
      
    } catch (error) {
      res.json({
        success: false,
        message: "Some problem in verifying the user. If not signed up then please do once"
      });
      }
});

app.get("/auth_reidrect", (req, res) => {
  console.log("I am in");
    const token = req.cookies.token;
    console.log("token in auth redirect = " + token)
  const payload = jwt.verify(token, secret);
  console.log(payload);
  if (payload.role == "chef") {
    res.redirect("/chef");
  } else if (payload.role == "customer") {
    res.redirect("/customer");
  } else {
    res.status(500).json({
      success: false,
      message: "Some error with authentication",
    });
  }
});

const auth_checker = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log("token in auth redirect = " + token);
    const payload = jwt.verify(token, secret);
    console.log(payload);
    req.user = payload;
    next();
  } catch (error) {
    res.json({
      success: false,
      message: "You are not authorised. Please login once more"
    });
  }
}

const customer_home = async (req, res, next) => {
  if (req.user.role == "customer") {
    next();
  }
  else {
    res.json({
      success: false,
      message: "You are not authorised to enter as this is a protected route",
    });
  }
}

const customer_menu = async (req, res, next) => {
  if (req.user.role == "customer") {
    next();
  } else {
    res.json({
      success: false,
      message: "You are not authorised to enter as this is a protected route",
    });
  }
};

const chef_home = async (req, res, next) => {
  if (req.user.role == "chef") {
    next();
  } else {
    res.json({
      success: false,
      message: "You are not authorised to enter as this is a protected route",
    });
  }
};

app.get("/chef", auth_checker, chef_home ,(req, res) => {
    res.render("chef.ejs");
})

app.get("/customer", auth_checker, customer_home ,(req, res) => {
  res.render("customer.ejs");
});

app.get("/menu", auth_checker, customer_menu, async (req, res) => {
  const starters = await get_food_menu(1);
  const main_course = await get_food_menu(2);
  const dessert = await get_food_menu(3);
  console.log(starters);
  console.log(main_course);
  console.log(dessert);
  res.render("menu.ejs" , {starters,main_course,dessert});
})

app.post("/food_items_added", async (req, res) => {
  const quant = req.body;
  // 1. Add the data into the order table to generate order id
  // 2. Then you now have the food id and the order id so now add all the food items into the ordered items table
  const token = req.cookies.token;
  console.log("token in auth redirect = " + token);
  const payload = jwt.verify(token, secret);
  const customer_id = await find_customer_id(payload.email);
  const chef_id = await chef_id_free();
  console.log("IN index.js = " + chef_id);
  if (chef_id == -1) {
    res.status(400).json({
      success: false,
      message: "No chef is available at this moment"
    });
  }
  else {
    await add_order_table(customer_id, "left", chef_id);
    res.send("Data has been added successfully inside the order table");
  }
});

app.listen(port, (err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(`This server is on port ${port}`);
    }
})