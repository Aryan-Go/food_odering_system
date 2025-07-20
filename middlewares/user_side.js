import {get_food_item_name} from "../database_queries/database.js";
export const customer_home = async (req, res, next) => {
  if (req.user.role == "customer") {
    next();
  } else {
    const error = "You are not authorised to enter as this is a protected route and your are logged in as chef or admin";
    res.render("error_page.ejs", { error })
  }
};

export const customer_menu = async (req, res, next) => {
  if (req.user.role == "customer") {
    next();
  } else {
    const error =
      "You are not authorised to enter as this is a protected route and your are logged in as chef or admin";
    res.render("error_page.ejs", { error });
  }
};

export const chef_home = async (req, res, next) => {
  if (req.user.role == "chef") {
    next();
  } else {
    const error =
      "You are not authorised to enter as this is a protected route and your are logged in as customer or admin";
    res.render("error_page.ejs", { error });
    
  }
};

export const chef_order = async (req, res, next) => {
  if (req.user.role == "chef") {
    next();
  } else {
    const error =
      "You are not authorised to enter as this is a protected route and your are logged in as customer or admin";
    res.render("error_page.ejs", { error });
    
  }
};

export const chef_complete_item = async (req, res, next) => {
  if (req.user.role == "chef" ) {
    next();
  } else {
    const error =
      "You are not authorised to enter as this is a protected route and your are logged in as customer or admin";
    res.render("error_page.ejs", { error });
    
  }
};


export const validate_email = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

