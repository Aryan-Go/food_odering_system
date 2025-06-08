import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();
const localhost = process.env.localhost;
const user = process.env.user;
const password = process.env.password;

const db = await mysql.createConnection({
    localhost: localhost,
    password: password,
    user: user,
    database:"food"
});

export const add_data = async (username, role, password, email) => {
    await db.query(`INSERT INTO user (email,username,password,role) VALUES (?,?,?,?)`, [email, username, password, role]);
    console.log("Data addedd successfully");
}

export const check_email = async (email) => {
    const [number] = await db.query(
      `SELECT COUNT(*) as count FROM user WHERE email = (?);`,
      [email]
    );
    console.log(number[0].count);
    if (number[0].count == 0) {
        return 0;
    }
    else {
        return 1;
    }
}

export const find_role = async (email) => {
    const [data] = await db.query(
        `SELECT * FROM user WHERE email = (?);`, [email]);
    // console.log(data);
    return data[0].role;
}