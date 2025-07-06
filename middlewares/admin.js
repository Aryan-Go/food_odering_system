

export const admin = async (req, res, next) => {
  if (req.user.role == "admin") {
    next();
  } else {
    res.json({
      success: false,
      message:
        "You are not authorised to enter as this is a protected route and your are logged in as admin",
    });
  }
};

export let customer_chef = []
export const request_customer_chef = (customer_id) => {
  customer_chef.push(customer_id);
  console.log("The request has been sent to the admin")
}