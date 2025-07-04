

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
