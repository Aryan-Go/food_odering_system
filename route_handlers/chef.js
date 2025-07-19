import dotenv from "dotenv";
dotenv.config();
const secret = process.env.secret;



import {
  get_ordered_items,
  find_chef_orders,
  find_chef_id,
  complete_ordered_items,
  status_order_id,
  get_food_item_name,
} from "../database_queries/database.js";



import jwt from "jsonwebtoken";


export const render_chef = (req, res) => {
  res.render("chef.ejs");
};

export const render_order = async (req, res) => {
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

      res.render("order.ejs", { food_name, data });
    } else {
      if (data == null || data == undefined) {
        const error = "There is no such order";
        res.render("error_page.ejs", { error });
      } else {
        const error = "The order has been completed";
        res.render("success_page.ejs", { error });
      }
    }
  } else {
    const token = req.cookies.token;
    const payload = jwt.verify(token, secret);
    const email = payload.email;
    console.log(email);
    const chef_data = await find_chef_id(email);
    console.log(chef_data[0].user_id);
    const order_id = await find_chef_orders(chef_data[0].user_id);
    console.log(order_id);
    let data;
    if (order_id != -1) {
      data = await get_ordered_items(order_id);
      console.log(data);
      const check = await status_order_id(order_id);
      let food_name = [];
      for (let i = 0; i < data.length; i++) {
        const [data2] = await get_food_item_name(data[i].food_id);
        console.log("This is data2.food_name", data2.food_name);
        food_name.push(data2.food_name);
      }
      res.render("order.ejs", { data, food_name });
    } else {
      data = [];
      res.render("empty_order.ejs")
    }
  }
};

export const complete_orderf = async (req, res) => {
  // res.send(req.body);
  await complete_ordered_items(
    req.body.order_id,
    req.body.food_id,
    req.body.completed
  );
  console.log("This order id has been turned to completed in ordered table");
  res.redirect("/order");
};