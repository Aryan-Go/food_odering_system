

export const admin = async (req, res, next) => {
  if (req.user.role == "admin") {
    next();
  } else {
    const error =
      "You are not authorised to enter as this is a protected route and your are logged in as admin";
    res.render("error_page.ejs" , {error})
  }
};

export let customer_chef = []
export const request_customer_chef = (customer_id) => {
  customer_chef.push(customer_id);
}