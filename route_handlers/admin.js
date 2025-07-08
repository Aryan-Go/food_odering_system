import {
  get_incomplete_food_id,
  get_unpaid_food_id,
  convert_customer_chef
} from "../database_queries/database.js";

import {
  customer_chef,
} from "../middlewares/admin.js";

export const render_admin = async(req, res) => {
  const data = await get_incomplete_food_id();
  const data_2 = await get_unpaid_food_id();
  res.render("admin.ejs" , {data,data_2,customer_chef});
}

export const admin_working_f = (req, res) => {
  const order_id = req.body.order_id;
  const order_id_2 = req.body.order_id_2;
  const customer_id = req.body.customer_id;
  if (order_id != undefined) {
    res.redirect(`/order?order_id=${order_id}`);
  }
  else if (order_id_2 != undefined) {
    res.redirect(`/payment?order_id=${order_id_2}`);
  }
  else if (customer_id != undefined) {
    const error = "The customer has been converted into chef successfully"
    convert_customer_chef(customer_id);
    res.render("success_page.ejs" , {error})
  }
}