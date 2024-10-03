const mysql = require("mysql");

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "rentitout",
  port: 3306, // Default MySQL port
});



// Test the connection
pool.getConnection((err, connection) => {
  if (err) {
    console.log("Error connecting to database:", err);
  } else {
    console.log("Connected to database");
    connection.release(); // Release the connection back to the pool
  }
});

module.exports = pool;
