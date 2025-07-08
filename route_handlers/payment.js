import dotenv from "dotenv";
dotenv.config();
const secret = process.env.secret;



import {
  find_customer_id,
  get_payment_table,
  update_payment_table,
  get_payment_id,
  get_payment_table_2,
} from "../database_queries/database.js";


import jwt from "jsonwebtoken";

export const render_payment = async (req, res) => {
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
}

export const payment_donef = async (req, res) => {
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
}

export const payment_done_admin_f = async (req, res) => {
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
}