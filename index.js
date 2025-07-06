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
  get_payment_table_2,
  get_food_item_name,
  find_password,
  check_same_email,
  get_incomplete_food_id,
  get_unpaid_food_id
} from "./database_queries/database.js";

import { customer_home,customer_menu,chef_home,chef_order,chef_complete_item,signup_nullity_check,validate_email } from "./middlewares/user_side.js";
import { admin } from "./middlewares/admin.js";
import { auth_checker } from "./middlewares/food.js";

import jwt from "jsonwebtoken";

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("signup.ejs");
})

app.post("/signup_add", async (req, res) => {
  const { username, email, password, password2, role } = req.body;
  // console.log(username, email, password, password2, role);
  // console.log(signup_nullity_check(username, email, password, role))
  try {
    if (signup_nullity_check(username, email, password, role) == false) {
      if (validate_email(email)) {
        if (await check_same_email(email)) {
          const error =
            "You are already signed in, go to login page";
          res.render("signup_error.ejs", {
            error,
            username,
            email,
            password,
            password2,
            role,
          });
        }
        else {
          if (password == password2) {
            const hash = await bcrypt.hash(password, 10);
            add_data(username, role, hash, email);
            res.redirect("/login");
          } else {
            const error =
              "Your password and confirm password were not a match please signup again";
            res.render("signup_error.ejs", {
              error,
              username,
              email,
              password,
              password2,
              role,
            });
          }
        }
       
      }
      else {
        const error = "Your email id is not valid"
        res.render("signup_error.ejs" , {error,username,email,password,password2,role})
      }
      
    }
    else {
      const error =
        "One or many of the required fields while signing up were empty. Please fill all of them";
      res.render("signup_error.ejs", {error,username,email,password,password2,role,});
    }
  } catch (error) {
    // const e = "There has been some problem with sign up please che"
    res.render("error_page.ejs" , {error})
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
      if (await check_email(email)) {
        const hash_password = await find_password(email);
        console.log(hash_password);
        console.log(password);
        await bcrypt.compare(password, hash_password, async (err, result) => {
          if (result == true) {
            const payload = {
              email: email,
              role: await find_role(email),
            };
            const token = await jwt.sign(payload, secret, {
              expiresIn: 2 * 60 * 60,
            });
            console.log(token);
            res.cookie("token", token);
            res.redirect("/auth_reidrect");
          } else {
            const error =
              "The password is not matching our database, please check once";
            res.render("login_error.ejs", { error, email, password });
          }
        });
      } else {
        const error = "The user is not signed in please check once";
        res.render("login_error.ejs", { error, email, password });
      }
      
          
      
    } catch (error) {
      res.render("login_error.ejs", { error,email,password });
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
    res.render("error_page.ejs", { error });
  }
});

app.get("/admin", auth_checker, admin, async(req, res) => {
  const data = await get_incomplete_food_id();
  const data_2 = await get_unpaid_food_id();
  res.render("admin.ejs" , {data,data_2});
})
app.post("/admin_working",auth_checker,admin, (req, res) => {
  const order_id = req.body.order_id;
  const order_id_2 = req.body.order_id_2;
  if (order_id != undefined) {
    res.redirect(`/order?order_id=${order_id}`);
  }
  else if (order_id_2 != undefined) {
    res.redirect(`/payment?order_id=${order_id_2}`);
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
    const error="No chef is available at this moment"
    res.render("error_page.ejs" , {error})
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
      let food_name = [];
      for (let i = 0; i < data.length; i++) {
        const [data2] = await get_food_item_name(data[i].food_id);
        console.log("This is data2.food_name" , data2.food_name);
        food_name.push(data2.food_name);
      }
      console.log(food_name)
      console.log("Just before render = " + num_order_id);
      res.render("waiting_page.ejs", { food_name,data ,num_order_id});
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
    res.render("error_page.ejs", { error });
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
      // 1. Firstly make functions to add and subtract sum of money that is required to make give the total d-print-table-cell - done
      // 2. Now make 2 functions to insert data inside the databse and get the data
      // 3. bring it to an ejs file
      const data = await get_payment_table_2(num_order_id);
      console.log("The data for payment is = " + data);
      if (data.length > 0) {
        const customer_id = data[0].customer_id;
        console.log(customer_id);
        res.render("payment_admin.ejs", { data,customer_id }); 
      }
      else {
        const error = "The order has already been paid or completed"
        res.render("error_page.ejs", { error });
      }
    } catch (error) {
      res.render("error_page.ejs", { error });
    }
  }
})

app.post("/payment_done",auth_checker,customer_home,async (req, res) => {
  try {
    const num_order_id = req.body.order_id;
    console.log(num_order_id);
    console.log("Total = " + req.body.total);
    const t = req.body.total;
    const total = parseInt(req.body.total) + parseInt((req.body.tip / 100) * req.body.total);
    const token = req.cookies.token;
    console.log("token in auth redirect = " + token);
    const payload = jwt.verify(token, secret);
    const customer_id = await find_customer_id(payload.email);
    console.log(customer_id);
    const payment_id = await get_payment_id(customer_id, num_order_id)
    console.log(payment_id);
    await update_payment_table(customer_id,payment_id[0].payment_id);
    res.render("payment_success.ejs", {customer_id,total,num_order_id , t})
    
  } catch (error) {
    res.render("payment_error.ejs", {
      error,customer_id,
      total,
      num_order_id,
      t,
    });
  }
})

app.post("/payment_done_admin", auth_checker, customer_home, async (req, res) => {
  try {
    const num_order_id = req.body.order_id;
    console.log(num_order_id);
    console.log("Total = " + req.body.total);
    const t = req.body.total;
    const customer_id = req.body.customer_id;
    console.log(customer_id);
    const total = parseInt(req.body.total) + parseInt((req.body.tip / 100) * req.body.total);
    const payment_id = await get_payment_id(customer_id, num_order_id);
    console.log(payment_id);
    await update_payment_table(customer_id, payment_id[0].payment_id);
    res.render("payment_success.ejs", {total,customer_id,num_order_id , t})
  } catch (error) {
    const num_order_id = req.body.order_id;
    console.log(num_order_id);
    const customer_id = req.body.customer_id;
    console.log(customer_id);
    res.render("payment_error.ejs", { error,customer_id, num_order_id });
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
      let food_name = [];
      for (let i = 0; i < data.length; i++) {
        const [data2] = await get_food_item_name(data[i].food_id);
        console.log("This is data2.food_name", data2.food_name);
        food_name.push(data2.food_name);
      }
      console.log(food_name);
      
      res.render("order.ejs", {food_name, data });
    }
    else {
      if (data == null || data == undefined) {
        const error = "There is no such order";
        res.render("error_page.ejs", { error });
      }
      else {
        const error = "The order has been completed"
        res.render("success_page.ejs", { error });
      }
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
    let food_name = [];
    for (let i = 0; i < data.length; i++) {
      const [data2] = await get_food_item_name(data[i].food_id);
      console.log("This is data2.food_name", data2.food_name);
      food_name.push(data2.food_name);
    }
    res.render("order.ejs", { data,food_name });
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