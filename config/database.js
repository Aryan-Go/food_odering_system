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

export const find_customer_id = async (email) => {
  const [data] = await db.query(`SELECT * FROM user WHERE email = (?);`, [
    email,
  ]);
  // console.log(data);
  return data[0].user_id;
};
//ADMIN CONTROL OVER THE FOOD MENU
export const add_menu_items = async (food_name, description, price, category_id) => {
    await dq.query(`INSERT INTO food_menu (food_name,description,price,category_id) VALUES (? , ?,?,?);`, [food_name, description, price, category_id]);
    console.log("Data has been successfully added to food menu");
}

export const get_food_menu = async (category_id) => {
    const [data] = await db.query(`SELECT * FROM food_menu WHERE category_id=(?)`, [category_id]);
    // console.log(data);
    return data;
}

export const add_order_table = async (
  customer_id,
  food_status,
  chef_id
) => {
  await db.query(
    `INSERT INTO order_table (customer_id,food_status,chef_id) VALUES (?,?,?);`,
    [customer_id, food_status, chef_id]
  );
  console.log("Data has been successfully added to order table");
};


export const find_chef_id = async () => {
    const r = "chef";
    const [data] = await db.query(`SELECT * FROM user WHERE role = (?);` , [r]);
    // console.log(data);
    return data;
};
  
export const find_chef_free = async (chef_id) => {
    const [data] = await db.query(`SELECT * FROM order_table WHERE chef_id = (?);`, [chef_id]);
    console.log("Found the data");
    data.forEach((chef_row) => {
        console.log("Inside the data loop")
        if (chef_row.food_status == "completed") {
            return chef_row.chef_id;
        }
        else {
            return -1;
        }
    })
  // console.log(data);
  return data;
};

export const chef_id_free = async() => {
    //1. get chef id from the user done
    // 2. now check if the chef id is there in ordered_items or not
    // 3. If it is not there then return the chef id otherwise check if all the items have been completed or not
    // 4. If completed then return the chef id otherwise take a new chef id
    const data = await find_chef_id();
    console.log("Data has been acquired from the function find_chef_id");
    console.log(data);
    let chef_id;
    for(const chef of data){
        console.log("Inisde the data loop in chef_id_free");
        const [number] = await db.query(`SELECT COUNT(*) AS count FROM order_table WHERE chef_id = (?)`, [chef.user_id]);
        console.log(number);
        if (number[0].count == 0) {
            console.log(chef.user_id);
            chef_id = chef.user_id;
        }
        else {
            const check = await find_chef_free(chef.user_id);
            if (check !== -1) {
                chef_id = check;
            }
            else {
                console.log(`${chef.user_id} is not free so finding a new one`);
            }
        }
    }
    if (chef_id != 0) {
        console.log("I am returning value right now");
        console.log("Here chef id is = " + chef_id);
        return chef_id;
    }
    else {
        console.log(chef_id + "Outside the for loop");
        console.log("No chef is free at this moment");
    }
}