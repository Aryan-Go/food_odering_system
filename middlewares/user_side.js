import {get_food_item_name} from "../database_queries/database.js";
export const customer_home = async (req, res, next) => {
  if (req.user.role == "customer" || req.user.role == "admin") {
    next();
  } else {
    res.json({
      success: false,
      message:
        "You are not authorised to enter as this is a protected route and your are logged in as chef",
    });
  }
};

export const customer_menu = async (req, res, next) => {
  if (req.user.role == "customer" || req.user.role == "admin") {
    next();
  } else {
    res.json({
      success: false,
      message:
        "You are not authorised to enter as this is a protected route and your are logged in as chef",
    });
  }
};

export const chef_home = async (req, res, next) => {
  if (req.user.role == "chef" || req.user.role == "admin") {
    next();
  } else {
    res.json({
      success: false,
      message:
        "You are not authorised to enter as this is a protected route and your are logged in as customer",
    });
  }
};

export const chef_order = async (req, res, next) => {
  if (req.user.role == "chef" || req.user.role == "admin") {
    next();
  } else {
    res.json({
      success: false,
      message:
        "You are not authorised to enter as this is a protected route and your are logged in as customer",
    });
  }
};

export const chef_complete_item = async (req, res, next) => {
  if (req.user.role == "chef" || req.user.role == "admin") {
    next();
  } else {
    res.json({
      success: false,
      message:
      "You are not authorised to enter as this is a protected route and your are logged in as customer",
    });
  }
};

export const signup_nullity_check = (username,email,password,role) => {
  if (username == null || username == undefined || email == null || email == undefined || password == null || password == undefined || role == null || role == undefined) {
    return true;
  }
  return false;
}

export const validate_email = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

