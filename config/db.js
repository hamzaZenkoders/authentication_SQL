const mysql = require('mysql');

const pool = mysql.createPool({
    host: 'DESKTOP-LRMSUM0',
    user: 'root@localhost',
    password: 'dxtx998',
    database: 'user',
    port: '3306',
  });


  
  module.exports = pool;