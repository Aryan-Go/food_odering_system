import express from "express";
const app = express();

import cookie_parser from "cookie-parser";
app.use(cookie_parser())

import bcrypt from "bcrypt";

import dotenv from "dotenv";
dotenv.config();
const port = process.env.port
const secret = process.env.secret;

import { fileURLToPath } from "url";
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import { add_data,check_email,find_role } from "./config/database.js";

import jwt from "jsonwebtoken";

// import session from "express-session";
// app.set("trust proxy", 1); // trust first proxy
// app.use(
//   session({
//     secret: secret,
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: true },
//   })
// );

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("home.ejs");
})

app.get("/signup", (req, res) => {
    res.render("signup.ejs");
})

app.post("/signup_add", async (req, res) => {
    //   res.send(req.body);
    const { username, email, password, role } = req.body;
    const hash = await bcrypt.hash(password, 10);
    add_data(username, role, hash, email);
    res.redirect("/login");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.post("/login_add", async (req, res) => {
    const { email, password } = req.body;
    const payload = {
        email: email,
        role: await find_role(email),
    }
    if (await check_email(email)) {
      const token = await jwt.sign(payload, secret, { expiresIn: 2 * 60 * 60 });
      console.log(token);
      res.cookie("token", token);
      res.redirect("/auth_reidrect")
    }
    else {
        res.status(400).json({
            success: false,
            message: "User is not signed in",
        });
    }
});

app.get("/auth_reidrect", (req, res) => {
  console.log("I am in");
    const token = req.cookies.token;
    console.log("token in auth redirect = " + token)
  const payload = jwt.verify(token, secret);
  console.log(payload);
  if (payload.role == "chef") {
    res.redirect("/chef");
  } else if (payload.role == "customer") {
    res.redirect("/customer");
  } else {
    res.status(500).json({
      success: false,
      message: "Some error with authentication",
    });
  }
});

app.get("/chef", (req, res) => {
    res.send("This is the chef portal");
})

app.get("/customer", (req, res) => {
  res.send("This is the customer portal");
});

app.listen(port, (err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(`This server is on port ${port}`);
    }
})