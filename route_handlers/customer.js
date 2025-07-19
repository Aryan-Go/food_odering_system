

import bcrypt from "bcrypt";

import dotenv from "dotenv";
dotenv.config();
const secret = process.env.secret;

import {
  request_customer_chef,
} from "../middlewares/admin.js";

import {
  validate_email,
} from "../middlewares/user_side.js";


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
  total_payment,
  add_payment_table,
  get_payment_status,
  get_food_item_name,
  find_password,
  check_same_email,
} from "../database_queries/database.js";


import jwt from "jsonwebtoken";



export const render_signup = async(req, res) => {
  const token = req.cookies.token;
  if (token) {
    const payload = jwt.verify(token, secret);
    if (payload.role == "chef") {
      res.redirect("/chef");
    } else if (payload.role == "customer") {
      const customer_id = await find_customer_id(payload.email);
      const payment_status = await get_payment_status(customer_id);
      if (payment_status.length > 0) {
        res.redirect(`/payment?customer_id=${customer_id}`);
      } else {
        res.redirect("/customer");
      }
    } else if (payload.role == "admin") {
      res.redirect("/admin");
    } else {
      res.render("error_page.ejs", { error });
    }
  }
  else {
    const { username, email, password, password2, role } = req.query;
    if (
      email == undefined ||
      username == undefined ||
      password == undefined ||
      password2 == undefined ||
      role == undefined
    ) {
      res.render("signup.ejs");
    } else {
      try {
        if (signup_nullity_check(username, email, password, role) == false) {
          if (validate_email(email)) {
            if (await check_same_email(email)) {
              const error = " Email already exists, please log in";
              res.render("signup_error.ejs", {
                error,
                username,
                email,
                password,
                password2,
                role,
              });
            } else {
              if (password == password2) {
                let points = checkStrength(password);
                if (points > 4) {
                  const hash = await bcrypt.hash(password, 10);
                  add_data(username, role, hash, email);
                  res.redirect("/login");
                } else {
                  const error =
                    "The password is not strong enough. Atleast 8 characters with upper case , lower case , special charaacters and digits";
                  res.render("signup_error.ejs", {
                    error,
                    username,
                    email,
                    password,
                    password2,
                    role,
                  });
                }
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
          } else {
            const error = "Your email id is not valid";
            res.render("signup_error.ejs", {
              error,
              username,
              email,
              password,
              password2,
              role,
            });
          }
        } else {
          const error =
            "One or many of the required fields while signing up were empty. Please fill all of them";
          res.render("signup_error.ejs", {
            error,
            username,
            email,
            password,
            password2,
            role,
          });
        }
      } catch (err) {
        res.render("error_page.ejs", { err });
      }
    }
  }
};



export const render_login = async (req, res) => {
  const { email, password } = req.query;
  if (password == undefined || email == undefined) {
    res.render("login.ejs");
  }
  else {
    const { email, password } = req.query;
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
              "Invalid Credentials. Please check";
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
  }
};

// export const login_addf = async (req, res) => {
  
// }

export const logoutf = (req, res) => {
  res.clearCookie("token");
  console.log(req.cookies);
  console.log("Person has been logged out successfully");
  res.redirect("/login");
};

export const auth_redirectf = async (req, res) => {
  try {
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
  }
  catch (err) {
    res.redirect("/")
  }
}

export const render_customer = (req, res) => {
  res.render("customer.ejs");
};

export const customer_cheff = async (req, res) => {
    const token = req.cookies.token;
    console.log("token in auth redirect = " + token);
    const payload = jwt.verify(token, secret);
    const customer_id = await find_customer_id(payload.email);
    await request_customer_chef(customer_id);
    res.render("customer_chef.ejs");
}

export const render_menu = async (req, res) => {
  const starters = await get_food_menu(1);
  const main_course = await get_food_menu(2);
  const dessert = await get_food_menu(3);
  console.log(starters);
  console.log(main_course);
  console.log(dessert);
  res.render("menu.ejs" , {starters,main_course,dessert});
}

export const food_items_addedf = async (req, res) => {
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
    let count = 0;
    for (let i = 0; i < quant.length; i++){
      if (quant[i] == 0) {
        count++;
      }
    }
    if (count == quant.length) {
      const error = "Please put some quantity of food"
      res.render("error_page.ejs" , {error})
    }
    await add_order_table(customer_id, "left", chef_id);
    console.log("Data has been added successfully inside the order table");
    let order_id;
      for (let i = 0; i < quant.length ; i++){
        if (quant[i] != 0) {
          order_id = await find_order_id(customer_id, chef_id);
          console.log(order_id);
          await add_ordered_items(food_id[i], quant[i], special_instructions[i], order_id);
          await add_payment_table(total_price, order_id, customer_id);
          res.redirect(`/waiting_page?order_id=${order_id}`)
        }
        else {
          console.log("It was a 0");
        }
    }
  }
}

export const render_waiting = async (req, res) => {
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
}

const signup_nullity_check = (username, email, password, role) => {
  if (
    username == null ||
    username == undefined ||
    email == null ||
    email == undefined ||
    password == null ||
    password == undefined ||
    role == null ||
    role == undefined
  ) {
    return true;
  }
  return false;
};

const checkStrength = (enteredPassword) => {
  var length = /(.{8,})/;
  var upperCase = /(.*[A-Z])/;
  var lowerCase = /(.*[a-z])/;
  var digit = /(.*[0-9].*[0-9])/;
  var specialChar = /([^A-Za-z0-9])/;
  var points = 0;
  if (length.test(enteredPassword)) {
    points++;
  }
  if (upperCase.test(enteredPassword)) {
    points++;
  }
  if (lowerCase.test(enteredPassword)) {
    points++;
  }
  if (digit.test(enteredPassword)) {
    points++;
  }
  if (specialChar.test(enteredPassword)) {
    points++;
  }
  return points;
}