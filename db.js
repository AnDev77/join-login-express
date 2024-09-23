const mysql = require('mysql2')
const conn = mysql.createConnection({
  host : '127.0.0.1',
  user: 'root',
  password : '0828',
  database: 'youtube',
  dateStrings : true //time zone 설정

});

// SELECT

module.exports = conn
