const express = require("express");
const cors = require('cors');
const mysql = require('mysql');
const app = express();
const users = require("./routes/users");
const debug = require('debug') ("my-application")
const bodyParser =require('body-parser');
const port = 8080


app.use(cors(
  {
    origin: 'http://localhost:3000'
  }
));
app.use(bodyParser.json())

// 创建数据库连接
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'credit',
});

// 连接到数据库
db.connect((err) => {
  if (err) {
    console.error('Error connecting to database: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL database');
});

app.use("/api/users",users);

  
app.listen(port,() =>{
    debug("服务器在3050上")
})