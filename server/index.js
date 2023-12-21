const express = require("express");
const cors = require('cors');
const mysql = require('mysql');
const app = express();
const users = require("./routes/users");
const uploadimage = require("./routes/uplodImage")
const credit = require("./routes/credit")
const marking = require("./routes/marking")
const points = require("./routes/points")
const nft = require("./routes/nft")
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
    console.error('连接数据库失败: ' + err.stack);
    return;
  }
  console.log('已连接数据库');
});

app.use("/api/users",users);
app.use("/api/image",uploadimage);
app.use("/api/credit",credit);
app.use("/api/marking",marking);
app.use("/api/points",points);
app.use("/api/nft",nft);


  
app.listen(port,() =>{
    debug("服务器在8080上")
})