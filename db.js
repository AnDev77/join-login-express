
const mysql = require('mysql2')
const conn = mysql.createConnection({
  host : 'localhost',
  user: 'root',
  password : '0828',
  database: 'youtube',
  dateStrings : true

});

// SELECT
conn.query('SELECT * FROM `users`', (_err, rows) => {
  console.log(rows[3].created_at);
  
});
