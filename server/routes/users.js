const express = require("express");
const session = require("express-session");
const mysql = require("mysql")
const router = express.Router();
const bodyParser = require("body-parser");
const _ = require("lodash");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Web3 = require("web3"); // 导入 Web3.js
const { randomBytes } = require('crypto'); // 用于生成随机私钥 

// 创建数据库连接
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'credit',
});

function createEthereumAccount() {
  const privateKey = '0x' + randomBytes(32).toString('hex'); // 随机生成私钥
  const account = Web3.eth.accounts.privateKeyToAccount(privateKey);
  return {
    address: account.address,
    privateKey: privateKey,
  };
}

const ethereumAccount = createEthereumAccount();
const ethereumAddress = ethereumAccount.address;
const ethereumPrivateKey = ethereumAccount.privateKey;

// 添加上述代码片段
router.use(bodyParser.json());

// 添加 express-session 中间件
router.use(session({
  secret: 'session-mykey', // 设置用于签名会话ID的密钥，请替换为您自己的密钥
  resave: false,
  saveUninitialized: true,
}));

const validatorInput = (data) => {
  let errors = {};
  if (validator.isEmpty(data.username)) {
    errors.username = "请填写用户名";
  }
  if (validator.isEmpty(data.address)) {
    errors.address = "请填写地址";
  }
  if (validator.isEmpty(data.password)) {
    errors.password = "请填写密码";
  }
  if (validator.isEmpty(data.passwordconfirm)) {
    errors.passwordconfirm = "请填写确认密码";
  }
  if (!validator.equals(data.password, data.passwordconfirm)) {
    errors.passwordconfirm = "两次密码不同";
  }
  return {
    errors,
    isValid: _.isEmpty(errors),
  };
}

const validatorInputPerson = (data) => {
  let errors = {};
  if (validator.isEmpty(data.oldpassword)) {
    errors.oldpassword = "请填写旧密码";
  }
  if (validator.isEmpty(data.newpassword)) {
    errors.newpassword = "请填写新密码";
  }
  if (validator.isEmpty(data.agnewpassword)) {
    errors.agnewpassword = "请再次填写新密码";
  }
  return {
    errors,
    isValid: _.isEmpty(errors),
  };
}

router.post("/register", async (req, res) => {
  const { errors, isValid } = validatorInput(req.body);

  if (!isValid) {
    res.status(400).json(errors);
  } else {
    // 用户注册逻辑
    const { username, password} = req.body;
     // 使用 bcrypt 进行密码哈希
   const saltRounds = 10;
   const hashedPassword = await bcrypt.hash(password, saltRounds);
    const sql = "INSERT INTO users (username, password, ethereumAddress, ethereumPrivateKey) VALUES (?,?, ?,?)";
    db.query(sql, [username, hashedPassword, ethereumAddress, ethereumPrivateKey], (err, result) => {
      if (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ error: "注册失败" });
      } else {
        if (result.affectedRows > 0) {
          return res.json({ message: "注册成功" });
        } else {
          return res.status(401).json({ error: "注册失败，用户名或密码错误" });
        }
      }
    });
  }
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  // 用户登录逻辑
  const sql = "SELECT * FROM users WHERE username = ?";
  db.query(sql, [username], async (err, results) => {
    if (err) {
      console.error('Error logging in:', err);
      res.status(500).json({ error: "登录失败" });
    } else {
      if (results.length > 0) {
        const storedHashedPassword = results[0].password;

        // 使用 bcrypt 验证密码
        const passwordMatch = await bcrypt.compare(password, storedHashedPassword);

        if (passwordMatch) {
           // 登录成功，将用户信息存储在会话中
           req.session.username = username;
           req.session.isLoggedIn = true;

          const token = jwt.sign({ username}, "jwtkey", { expiresIn: "1h" });
          console.log(username,password)
          return res.json({ message: "登录成功",token});
        } else {
          return res.status(401).json({ error: "登录失败，用户名或密码错误" });
        }
      } else {
        return res.status(401).json({ error: "登录失败，用户名或密码错误" });
      }
    }
  });
});

router.post('/updatePassword', async (req, res) => {
  const { errors, isValid } = validatorInputPerson(req.body);

  if (!isValid) {
    res.status(400).json(errors);
  } else {
    const { username, oldpassword, newpassword } = req.body;

    // 查询数据库以获取用户的哈希密码
    const sql = "SELECT password FROM users WHERE username = ?";
    db.query(sql, [username], async (err, results) => {
      if (err) {
        console.error('数据库错误:', err);
        res.status(500).json({ message: '内部服务器错误' });
      } else {
        if (results.length === 0) {
          res.status(404).json({ message: '用户不存在' });
        } else {
          const oldPasswordHash = results[0].password;

          // 使用 bcrypt.compare 来比较哈希密码
          const passwordMatch = await bcrypt.compare(oldpassword, oldPasswordHash);

          if (passwordMatch) {
            // 旧密码匹配，继续更新密码
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(newpassword, saltRounds);
            const updateSql = "UPDATE users SET password = ? WHERE username = ?";
            db.query(updateSql, [hashedPassword, username], (updateErr, updateResult) => {
              if (updateErr) {
                console.error('更新失败:', updateErr);
                res.status(500).json({ message: '密码更新失败' });
              } else {
                res.status(200).json({ message: '密码更新成功' });
              }
            });
          } else {
            res.status(400).json({ message: '错误的旧密码' });
          }
        }
      }
    });
  }
});


module.exports = router;
