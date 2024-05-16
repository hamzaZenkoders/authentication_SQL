const mysql = require("mysql2");

const pool = mysql
  .createPool({
    host: "localhost",
    user: "root",
    password: "123456",
    database: "user",
  })
  .promise();

const getConnection = async () => {
  try {
    const [rows, fields] = await pool.query("SELECT * FROM users");
    console.log(rows);
  } catch (err) {
    console.error("Error executing query:", err);
  } finally {
    pool.end();
  }
};

// Execute the function to test the connection and query
getConnection();
