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

import {
  add_data,
  check_email,
  find_role,
  get_food_menu,
  add_order_table,
  find_customer_id,
  chef_id_free,
  add_ordered_items,
  find_order_id,
  get_ordered_items,
  find_chef_orders,
  find_chef_id,
  complete_ordered_items,
  status_order_id,
  get_order_chef_id,
  total_payment,
  add_payment_table,
  get_payment_table,
  update_payment_table,
  get_payment_id,
  get_payment_status,
  get_payment_table_2
} from "./database_queries/database.js";

import { customer_home,customer_menu,chef_home,chef_order,chef_complete_item } from "./app_functions/user_side.js";
import { admin } from "./app_functions/admin.js";
import { auth_checker } from "./app_functions/food.js";

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
      message: "Some problem in signing up please try again after some time",
    });
  }
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.post("/login_add", async (req, res) => {
  const { email, password } = req.body;
  console.log(email);
  console.log(password);
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

app.get("/auth_reidrect", async (req, res) => {
  console.log("I am in");
    const token = req.cookies.token;
    console.log("token in auth redirect = " + token)
  const payload = jwt.verify(token, secret);
  console.log(payload);
  if (payload.role == "chef") {
    res.redirect("/chef");
  } else if (payload.role == "customer") {
    const customer_id = await find_customer_id(payload.email);
    const payment_status = await get_payment_status(customer_id);
    if (payment_status.length > 0) {
      res.redirect(`/payment?customer_id=${customer_id}`);
    }
    else {
      res.redirect("/customer");
    }
  }
  else if (payload.role == "admin") {
    res.redirect("/admin");
    }
    
  else {
    res.status(500).json({
      success: false,
      message: "Some error with authentication",
    });
  }
});

app.get("/admin",auth_checker,admin, (req, res) => {
  res.render("admin.ejs");
})
app.post("/admin_working",auth_checker,admin, (req, res) => {
  const order_id = req.body.order_id;
  const order_id_2 = req.body.order_id_2;
  const customer_id = req.body.customer_id;
  if (order_id != undefined) {
    res.redirect(`/order?order_id=${order_id}`);
  }
  else if (order_id_2 != undefined) {
    res.redirect(`/payment?order_id=${order_id_2}&customer_id=${customer_id}`);
  }
})

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
  const quant = req.body.quant;
  console.log(quant);
  const food_id = req.body.food_id;
  console.log(food_id);
  const total_price = await total_payment(quant, food_id);
  console.log("The total price that I am getting = " + total_price);
  const special_instructions = req.body.special_instructions;
  // res.send(quant);
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
    console.log("Data has been added successfully inside the order table");
    let order_id;
    for (let i = 0; i < quant.length ; i++){
      if (quant[i] != 0) {
        order_id = await find_order_id(customer_id, chef_id);
        console.log(order_id);
        await add_ordered_items(food_id[i], quant[i], special_instructions[i], order_id);
      }
      else {
        console.log("It was a 0");
      }
    }
    await add_payment_table(total_price, order_id, customer_id);
    res.redirect(`/waiting_page?order_id=${order_id}`)
  }
});

app.get("/waiting_page", async (req, res) => {
  try {
    const token = req.cookies.token;
    console.log("token in auth redirect = " + token);
    const payload = jwt.verify(token, secret);
    const customer_id = await find_customer_id(payload.email);
    console.log(customer_id);
    const {order_id} = req.query;
    const num_order_id = parseInt(order_id);
    console.log(num_order_id);
    const data = await get_ordered_items(num_order_id);
    console.log(data)
    if (data.length > 0) {
      console.log("Just before render = " + num_order_id);
      res.render("waiting_page.ejs", { data ,num_order_id});
    }
    else {
      const token = req.cookies.token;
      console.log("token in auth redirect = " + token);
      const payload = jwt.verify(token, secret);
      const customer_id = await find_customer_id(payload.email);
      console.log(customer_id);
      const { order_id } = req.query;
      const num_order_id = parseInt(order_id);
      res.redirect(`/payment?order_id=${num_order_id}`);
    }
  } catch (error) {
    res.json({
      success: false,
      message: error
    })
  }
});

app.get("/payment", auth_checker, customer_home, async (req, res) => {
  const token = req.cookies.token;
  const payload = jwt.verify(token, secret);
  if (payload.role != "admin") {
    console.log("I am not a admin");
    const customer_id = req.query.customer_id;
    const data = await get_payment_table(customer_id);
    console.log("The data for payment is = " + data);
    res.render("payment.ejs", { data, customer_id });
  }
  else {
    try {
      const order_id = req.query.order_id;
      console.log(order_id);
      const num_order_id = parseInt(order_id);
      console.log(num_order_id);
      const customer_id = req.query.customer_id;
      console.log(customer_id);
      // 1. Firstly make functions to add and subtract sum of money that is required to make give the total d-print-table-cell - done
      // 2. Now make 2 functions to insert data inside the databse and get the data
      // 3. bring it to an ejs file
      const data = await get_payment_table_2(num_order_id);
      console.log("The data for payment is = " + data);
      if (data.length > 0) {
        res.render("payment_admin.ejs", { data,customer_id }); 
      }
      else {
        res.json({
          success: false,
          message: "The order has already been paid or completed",
        });
      }
    } catch (error) {
      res.json({
        success: false,
        message: "The order has already been paid or completed"
      })
    }
  }
})

app.post("/payment_done",auth_checker,customer_home,async (req, res) => {
  try {
    const num_order_id = req.body.order_id;
    console.log(num_order_id);
    console.log("Total = " + req.body.total);
    const total = parseInt(req.body.total) + parseInt((req.body.tip / 100) * req.body.total);
    const token = req.cookies.token;
    console.log("token in auth redirect = " + token);
    const payload = jwt.verify(token, secret);
    const customer_id = await find_customer_id(payload.email);
    console.log(customer_id);
    const payment_id = await get_payment_id(customer_id, num_order_id)
    console.log(payment_id);
    await update_payment_table(customer_id,payment_id[0].payment_id);
    res.json({
      success: true,
      message: "The total amount paid is = " + total
    });
    
  } catch (error) {
    res.json({
      success: false,
      message: error
    })
  }
})

app.post("/payment_done_admin", auth_checker, customer_home, async (req, res) => {
  try {
    const num_order_id = req.body.order_id;
    console.log(num_order_id);
    console.log("Total = " + req.body.total);
    const customer_id = req.body.customer_id;
    console.log(customer_id);
    const payment_id = await get_payment_id(customer_id, num_order_id);
    console.log(payment_id);
    await update_payment_table(customer_id, payment_id[0].payment_id);
    res.json({
      success: true,
      message: "The payment is done now",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error,
    });
  }
});

app.get("/order", auth_checker, chef_order, async (req, res) => {
  const token = req.cookies.token;
  const payload = jwt.verify(token, secret);
  // const email = payload.email;
  if (payload.role == "admin") {
    const order_id = req.query.order_id;
    console.log(order_id);
      const data = await get_ordered_items(order_id);
      console.log(data);
    const check = await status_order_id(order_id);
    if (data.length > 0) {
      res.render("order.ejs", { data });
    }
    else {
      res.json({
        success: false,
        message: "Either the order is completed or there is no such order id please check once"
      })
    }
  }
  else {
    const token = req.cookies.token;
    const payload = jwt.verify(token, secret);
    const email = payload.email;
    console.log(email);
    const chef_data = await find_chef_id(email)
    console.log(chef_data[0].user_id);
    const order_id = await find_chef_orders(chef_data[0].user_id);
    console.log(order_id);
    let data;
    if (order_id != -1) {
      data = await get_ordered_items(order_id);
      console.log(data);
      const check = await status_order_id(order_id);
    }
    else {
      data = [];
    }
    res.render("order.ejs", { data });
  }
})

app.post("/complete_item",auth_checker,chef_complete_item ,async (req, res) => {
  // res.send(req.body);
  await complete_ordered_items(req.body.order_id, req.body.food_id, req.body.completed);
  console.log("This order id has been turned to completed in ordered table");
  res.redirect("/order");
})

app.listen(port, (err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(`This server is on port ${port}`);
    }
})