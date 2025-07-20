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
  if (payload.role == "admin") {
    const order_id = req.query.order_id;
    const ordered_items = await get_ordered_items(order_id);
    const check = await status_order_id(order_id);
    if (ordered_items.length > 0) {
      let food_name = [];
      for (let i = 0; i < ordered_items.length; i++) {
        const [food_Name] = await get_food_item_name(ordered_items[i].food_id);
        food_name.push(food_Name.food_name);
      }

      res.render("order.ejs", { food_name, ordered_items });
    } else {
      if (ordered_items == null || ordered_items == undefined) {
        const error = "There is no such order";
        res.render("error_page.ejs", { error });
      } else {
        const error = "The order has been completed";
        res.render("success_page.ejs", { error });
      }
    }
  } else {
    const email = payload.email;
    const chef_data = await find_chef_id(email);
    const order_id = await find_chef_orders(chef_data[0].user_id);
    let ordered_items;
    if (order_id != -1) {
      ordered_items = await get_ordered_items(order_id);
      const check = await status_order_id(order_id);
      let food_name = [];
      for (let i = 0; i < ordered_items.length; i++) {
        const [food_Name] = await get_food_item_name(ordered_items[i].food_id);
        food_name.push(food_Name.food_name);
      }
      res.render("order.ejs", { ordered_items, food_name });
    } else {
      ordered_items = [];
      res.render("empty_order.ejs")
    }
  }
};

export const complete_orderf = async (req, res) => {
  if (req.body == null || req.body == undefined) {
    const error = "There is no valid request for this page please go back and check once more"
    res.render("error_page.ejs" , {error})
  }
  else {
    await complete_ordered_items(
      req.body.order_id,
      req.body.food_id,
      req.body.completed
    );
    res.redirect("/order");
  }
};