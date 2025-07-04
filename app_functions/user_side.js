
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