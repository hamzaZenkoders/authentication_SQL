const mysql = require("mysql2/promise");

const pool = mysql
  .createPool({
    host: "localhost",
    user: "root",
    password: "dxtx998",
    database: "user",
  })


  module.exports = {pool};

/*const getConnection = async () => {
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
 */