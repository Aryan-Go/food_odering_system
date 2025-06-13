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


export const find_chef_id = async (email) => {
    const [data] = await db.query(`SELECT * FROM user WHERE email = ?;` , [email]);
    // console.log(data);
    return data;
};
export const find_chef_id_2 = async () => {
    const r = "chef";
  const [data] = await db.query(`SELECT * FROM user WHERE role = ?;`, [r]);
  // console.log(data);
  return data;
};
  
export const find_chef_free = async (chef_id) => {
    const [data] = await db.query(`SELECT * FROM order_table WHERE chef_id = (?);`, [chef_id]);
    console.log("Found the data");
    let chef;
    for(const chef_row of data){
        console.log("Inside the data loop")
        if (chef_row.food_status == "completed") {
            chef = chef_row.chef_id;
        }
        else {
            chef = -1;
        }
    }
  // console.log(data);
  return chef;
};

export const chef_id_free = async() => {
    //1. get chef id from the user done
    // 2. now check if the chef id is there in ordered_items or not
    // 3. If it is not there then return the chef id otherwise check if all the items have been completed or not
    // 4. If completed then return the chef id otherwise take a new chef id
    const data = await find_chef_id_2();
    console.log("Data has been acquired from the function find_chef_id");
    console.log(data);
    let chef_id;
    if (data.length > 0) {
        for (const chef of data) {
          console.log("Inisde the data loop in chef_id_free");
          const [number] = await db.query(
            `SELECT COUNT(*) AS count FROM order_table WHERE chef_id = (?)`,
            [chef.user_id]
          );
          console.log(number);
          if (number[0].count == 0) {
            console.log(chef.user_id);
            chef_id = chef.user_id;
          } else {
            const check = await find_chef_free(chef.user_id);
            if (check !== -1) {
              chef_id = check;
            } else {
              console.log(`${chef.user_id} is not free so finding a new one`);
              chef_id = 0;
            }
          }
        }
    }
    else {
        chef_id = -1;
    }
    
    if (chef_id != 0) {
        console.log("I am returning value right now");
        console.log("Here chef id is = " + chef_id);
        return chef_id;
    }
    else {
        console.log(chef_id + "Outside the for loop");
        console.log("No chef is free at this moment");
        return -1;
    }
}

export const add_ordered_items = async (food_id,quantity,special_instructions,order_id) => {
    const food_status = "left";
    await db.query(`INSERT INTO ordered_items VALUES (?,?,?,?,?)`, [food_id, quantity, special_instructions, order_id, food_status]);
    console.log("Data has been successfully added in the ordered items table");
}

export const find_order_id = async (customer_id, chef_id) => {
    const food_status = "left";
    const [data] = await db.query(`SELECT * FROM order_table WHERE customer_id = (?) AND chef_id = (?) AND food_status = (?)`, [customer_id, chef_id, food_status]);
    return data[0].order_id;
}

export const find_chef_orders = async (chef_id) => {
    console.log("I am in find_chef_orders");
    const food_status = "left";
    const [data] = await db.query(
      `SELECT * FROM order_table WHERE chef_id = ? AND food_status = ?`,
      [chef_id, food_status]
    );

    if (data.length != 0) {
        console.log(data);
        console.log(data[0].order_id);
        
        return data[0].order_id;
    }
    else {
        return -1;
    }
}

export const get_ordered_items = async (order_id) => {
    const food_status = "left";
    const [data] = await db.query(`SELECT * FROM ordered_items WHERE order_id = ? AND food_status = ?`, [order_id, food_status]);
    console.log(data);
    return data;
}

export const complete_ordered_items = async (order_id,food_id,food_status) => {
  const [data] = await db.query(
    `UPDATE ordered_items SET food_status = ? WHERE order_id = ? AND food_id = ?;`,
    [food_status, order_id, food_id]
  );
    const check = await status_order_id(order_id);
  console.log(data);
  return data;
};

export const status_order_id = async (order_id) => {
    const [data] = await db.query(`SELECT * FROM ordered_items WHERE order_id = ?`, [order_id]);
    // console.log(data);
    for(const data_row of data){
        if (data_row.food_status == "left") {
            console.log("Chef is busy based on ordered item");
            return data;
        }
        else {
            console.log("This item has been completed by chef");
        }
    }
    const food_status = "completed";
    await db.query(
      `UPDATE order_table SET food_status = ? WHERE order_id = ? `,[food_status,order_id]
    );
    console.log("Data has been updated in the order_table");
    return 0;
}
const status_chef = async (chef_id) => {
    const [data] = db.query(`SELCT * FROM order_table where chef_id = ?`, [chef_id]);
    for (const data_row in data) {
        if (await data_row.food_status == "left") {
            console.log("Chef is busy based on order table")
            return -1;
        }
    }
    console.log("Chef is free based on order table")
    return chef_id;
}
export const get_order_chef_id = async (customer_id) => {
    console.log("I am inside get_chef_order_id");
    const food_status = "left";
    const [data] = await db.query(`SELECT * FROM order_table WHERE customer_id = ? AND food_status = ?`, [customer_id, food_status]);
    console.log(data);
    return data;
}

export const total_payment = async (quant, food_id) => {
    let total_price = 0;
    for (let i = 0; i < quant.length ; i++) {
        const [data_row] = await db.query(`SELECT * FROM food_menu WHERE food_id = ?`, [food_id[i]]);
        console.log("This the price = "+data_row[0].price);
        total_price = total_price + (quant[i] * data_row[0].price);
        console.log(total_price);
    }
    return total_price;
}

export const add_payment_table = async (total_price,order_id, customer_id) => {
    const payment_status = "left";
    await db.query(
      `INSERT INTO payment_table (total_price,payment_status,order_id,customer_id) VALUES (?,?,?,?)`,
      [total_price, payment_status, order_id, customer_id]
    );
    console.log("Data has been added in the payments table");
}

export const get_payment_table = async (customer_id) => {
    const payment_status = "left";
    
  const [data] = await db.query(
    `SELECT * FROM payment_table WHERE customer_id = ? AND payment_status = ?`,
    [customer_id,payment_status]
  );
    return data;
//   console.log("Data has been added in the payments table");
};

export const get_payment_id = async (customer_id, order_id) => {
    const [data] = await db.query(`SELECT * FROM payment_table WHERE customer_id = ? AND order_id = ?`, [customer_id, order_id]);
    return data
}

export const update_payment_table = async (customer_id,payment_id) => {
  const payment_status_2 = "completed";
  const payment_status_1 = "left";

    await db.query(
    `UPDATE payment_table SET payment_status = ? WHERE customer_id = ? AND payment_status = ? AND payment_id = ?`,
    [payment_status_2,customer_id, payment_status_1,payment_id]
  );
    console.log("Data has been successfully updates for payment table");
  //   console.log("Data has been added in the payments table");
};
// export const complete_order_table = async (
//   order_id,
//   chef_id
// ) => {
//     const food_status = "completed";
//   const [data] = await db.query(
//     `UPDATE ordered_items SET food_status = ? WHERE order_id = ? AND chef_id = ?;`,
//     [food_status,order_id, chef_id]
//   );
    
// };