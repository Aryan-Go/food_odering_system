import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();
const host = process.env.host;
const user = process.env.user;
const password = process.env.password;



const db = await mysql.createConnection({
    host: host,
    password: password,
    user: user,
    database:"food"
});

export const add_data = async (username, role, password, email) => {
    await db.query(`INSERT INTO user (email,username,password,role) VALUES (?,?,?,?)`, [email, username, password, role]);
}

export const check_email = async (email) => {
    const [number] = await db.query(
      `SELECT COUNT(*) as count FROM user WHERE email = (?);`,
      [email]
    );
    if (number[0].count == 0) {
        return 0;
    }
    else {
        return 1;
    }
}

export const check_same_email = async (email) => {
  const [number] = await db.query(
    `SELECT COUNT(*) as count FROM user WHERE email = (?);`,
    [email]
  );
  if (number[0].count > 0) {
    return true;
  } else {
    return false;
  }
};

export const find_role = async (email) => {
    const [data] = await db.query(
        `SELECT * FROM user WHERE email = (?);`, [email]);
    return data[0].role;
}

export const find_customer_id = async (email) => {
  const [data] = await db.query(`SELECT * FROM user WHERE email = (?);`, [
    email,
  ]);
  return data[0].user_id;
};

export const find_password = async (email) => {
  const [data] = await db.query(`SELECT * FROM user WHERE email = (?);`, [
    email,
  ]);
  return data[0].password;
};

export const get_food_menu = async (category_id) => {
    const [data] = await db.query(`SELECT * FROM food_menu WHERE category_id=(?)`, [category_id]);
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
};


export const find_chef_id = async (email) => {
    const [data] = await db.query(`SELECT * FROM user WHERE email = ?;` , [email]);
    return data;
};

export const chef_id_free = async() => {
  const role = "chef"
  const comp_lef  = "left"
  const [data] = await db.query(`SELECT user_id  
                                FROM user
                                WHERE role = ? AND NOT EXISTS
                                (SELECT *  
                                FROM  order_table
                                WHERE order_table.food_status = ? AND order_table.chef_id = user.user_id);` , [role, comp_lef]);
  if (data.length > 0) {
    return data[0].user_id
  }
  else {
    return -1;
  }
  
}

export const add_ordered_items = async (food_id,quantity,special_instructions,order_id) => {
    const food_status = "left";
    await db.query(`INSERT INTO ordered_items VALUES (?,?,?,?,?)`, [food_id, quantity, special_instructions, order_id, food_status]);
}

export const find_order_id = async (customer_id, chef_id) => {
    const food_status = "left";
    const [data] = await db.query(`SELECT * FROM order_table WHERE customer_id = (?) AND chef_id = (?) AND food_status = (?)`, [customer_id, chef_id, food_status]);
    return data[0].order_id;
}

export const find_chef_orders = async (chef_id) => {
    const food_status = "left";
    const [data] = await db.query(
      `SELECT * FROM order_table WHERE chef_id = ? AND food_status = ?`,
      [chef_id, food_status]
    );

    if (data.length != 0) {
        
        return data[0].order_id;
    }
    else {
        return -1;
    }
}

export const get_ordered_items = async (order_id) => {
    const food_status = "left";
    const [data] = await db.query(`SELECT * FROM ordered_items WHERE order_id = ? AND food_status = ?`, [order_id, food_status]);
    return data;
}

export const complete_ordered_items = async (order_id,food_id,food_status) => {
  const [data] = await db.query(
    `UPDATE ordered_items SET food_status = ? WHERE order_id = ? AND food_id = ?;`,
    [food_status, order_id, food_id]
  );
  return data;
};

export const status_order_id = async (order_id) => {
    const [data] = await db.query(`SELECT * FROM ordered_items WHERE order_id = ?`, [order_id]);
    for(const data_row of data){
        if (data_row.food_status == "left") {
            return data;
        }
    }
    const food_status = "completed";
    await db.query(
      `UPDATE order_table SET food_status = ? WHERE order_id = ? `,[food_status,order_id]
    );
    return 0;
}
export const get_order_chef_id = async (customer_id) => {
    const food_status = "left";
    const [data] = await db.query(`SELECT * FROM order_table WHERE customer_id = ? AND food_status = ?`, [customer_id, food_status]);
    return data;
}

export const total_payment = async (quant, food_id) => {
    let total_price = 0;
    for (let i = 0; i < quant.length ; i++) {
        const [data_row] = await db.query(`SELECT * FROM food_menu WHERE food_id = ?`, [food_id[i]]);
        total_price = total_price + (quant[i] * data_row[0].price);
    }
    return total_price;
}

export const add_payment_table = async (total_price,order_id, customer_id) => {
    const payment_status = "left";
    await db.query(
      `INSERT INTO payment_table (total_price,payment_status,order_id,customer_id) VALUES (?,?,?,?)`,
      [total_price, payment_status, order_id, customer_id]
    );
}

export const get_payment_table = async (customer_id) => {
    const payment_status = "left";
    
  const [data] = await db.query(
    `SELECT * FROM payment_table WHERE customer_id = ? AND payment_status = ?`,
    [customer_id,payment_status]
  );
    return data;
};

export const get_payment_table_2 = async (order_id) => {
  const payment_status = "left";

  const [data] = await db.query(
    `SELECT * FROM payment_table WHERE order_id = ? AND payment_status = ?`,
    [order_id, payment_status]
  );
  return data;
};

export const get_payment_id = async (customer_id, order_id) => {
    const [data] = await db.query(`SELECT * FROM payment_table WHERE customer_id = ? AND order_id = ?`, [customer_id, order_id]);
    return data
}
export const get_payment_status = async (customer_id) => {
    const payment_status = "left";
  const [data] = await db.query(
    `SELECT * FROM payment_table WHERE customer_id = ? and payment_status = ?`,
    [customer_id, payment_status]
  );
  return data;
};
export const update_payment_table = async (customer_id,payment_id) => {
  const payment_status_2 = "completed";
  const payment_status_1 = "left";

    await db.query(
    `UPDATE payment_table SET payment_status = ? WHERE customer_id = ? AND payment_status = ? AND payment_id = ?`,
    [payment_status_2,customer_id, payment_status_1,payment_id]
  );
};

export const get_food_item_name = async (food_id) => {
  const [data] = await db.query(`SELECT * FROM food_menu WHERE food_id = ?`, [food_id]);
  return data;
}

export const get_incomplete_food_id = async () => {
  const status = "left";
  const [data] = await db.query(`SELECT * FROM order_table WHERE food_status=?`, [status]);
  return data;
}

export const get_unpaid_food_id = async () => {
  const status = "left";
  const [data] = await db.query(
    `SELECT * FROM payment_table WHERE payment_status=?`,
    [status]
  );
  return data;
};

export const convert_customer_chef = async (customer_id) => {
  const role = "chef"
  await db.query(`UPDATE user SET role=? WHERE user_id=?;` , [role, customer_id])
}

export const check_order_status = async (customer_id, order_id) => {
  const order_status = "completed"
  const data = await db.query(`SELECT * FROM order_table WHERE order_id = ? AND customer_id = ? AND food_status = ?;`, [order_id, customer_id, order_status])
  if (data[0] == null || data[0] == undefined) {
    return false;
  }
  else {
    return true;
  }
}