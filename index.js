import express from "express";
const app = express();

import cookie_parser from "cookie-parser";
app.use(cookie_parser())


import dotenv from "dotenv";
dotenv.config();
const port = process.env.port


import { fileURLToPath } from "url";
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



import { customer_home,customer_menu,chef_home,chef_order,chef_complete_item } from "./middlewares/user_side.js";
import { admin,customer_chef,request_customer_chef } from "./middlewares/admin.js";
import { auth_checker } from "./middlewares/food.js";

app.set("view engine", "ejs");

import {
  render_signup,
  signup_addf,
  render_login,
  logoutf,
  auth_redirectf,
  render_customer,
  customer_cheff,
  render_menu,
  food_items_addedf,
    render_waiting
} from "./route_handlers/customer.js";

import { render_admin,admin_working_f} from "./route_handlers/admin.js"

import { render_chef,render_order,complete_orderf } from "./route_handlers/chef.js"

import { render_payment,payment_donef,payment_done_admin_f } from "./route_handlers/payment.js";

app.get("/", render_signup)

app.post("/signup_add", signup_addf);

app.get("/login", render_login);

// app.post("/login_add", login_addf);

app.get("/logout", logoutf)

app.get("/auth_reidrect",auth_redirectf);

app.get("/admin", auth_checker, admin, render_admin)
app.post("/admin_working",auth_checker,admin, admin_working_f)

app.get("/chef", auth_checker, chef_home ,render_chef)

app.get("/customer", auth_checker, customer_home ,render_customer);

app.get("/customer_chef", auth_checker, customer_home, customer_cheff);

app.get("/menu", auth_checker, customer_menu, render_menu)

app.post("/food_items_added", food_items_addedf);

app.get("/waiting_page", render_waiting);

app.get("/payment", auth_checker, customer_home, render_payment)

app.post("/payment_done",auth_checker,customer_home,payment_donef)

app.post("/payment_done_admin", auth_checker, customer_home, payment_done_admin_f);

app.get("/order", auth_checker, chef_order,render_order)

app.post("/complete_item",auth_checker,chef_complete_item ,complete_orderf)

app.listen(port, (err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(`This server is on port ${port}`);
    }
})