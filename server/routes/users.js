const express = require("express");
const session = require("express-session");
const mysql = require("mysql");
const router = express.Router();
const bodyParser = require("body-parser");
const _ = require("lodash");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ethers } = require("ethers"); //导入ethers.js
const ABI = require("../../src/abi.json");
const { randomBytes } = require("crypto"); // 用于生成随机私钥

// 创建数据库连接
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "credit",
});

//随机生成地址
function createEthereumAccount() {
  // 生成随机的 32 字节私钥
  const privateKeyBuffer = ethers.utils.randomBytes(32);
  const privateKey = ethers.utils.hexlify(privateKeyBuffer);

  // 使用 ethers.js 生成地址
  const wallet = new ethers.Wallet(privateKey);

  return {
    address: wallet.address,
    privateKey: privateKey,
  };
}

// 添加上述代码片段
router.use(bodyParser.json());

// 添加 express-session 中间件
router.use(
  session({
    secret: "session-mykey", // 设置用于签名会话ID的密钥，请替换为您自己的密钥
    resave: false,
    saveUninitialized: true,
  })
);

const validatorInput = (data) => {
  let errors = {};
  if (validator.isEmpty(data.username)) {
    errors.username = "请填写用户名";
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
};

const validatorInputPerson = (data) => {
  let errors = {};
  if (validator.isEmpty(data.username)) {
    errors.username = "请填写用户名";
  }
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
};

// 合约地址和abi
const contractAddress = "0x0C6f0F826de7a69A0688528A5ff8C58A16C0F46b";
//私钥
const privateKey =
  "a8c712ec57d869a942f2200875c7fc851dd06df40f7181d92bd45b9751235181";
const ETHEREUM_NODE_URL = "http://127.0.0.1:7545";

//连接以太坊节点
const provider = new ethers.providers.JsonRpcProvider(ETHEREUM_NODE_URL);
//内置钱包进行签名交易
const wallet = new ethers.Wallet(privateKey, provider);

const contract = new ethers.Contract(contractAddress, ABI, wallet);

router.post("/register", async (req, res) => {
  const ethereumAccount = createEthereumAccount();
  const ethereumAddress = ethereumAccount.address;
  const ethereumPrivateKey = ethereumAccount.privateKey;

  console.log("Address:", ethereumAddress);
  console.log("Private Key:", ethereumPrivateKey);

  const { errors, isValid } = validatorInput(req.body);
  console.log();

  if (!isValid) {
    res.status(400).json(errors);
  } else {
    // 用户注册逻辑
    const { username, password } = req.body;
    // 使用 bcrypt 进行密码哈希
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 调用合约的注册函数
    const registerTransaction = await contract.registerMerchant(
      username,
      ethereumAddress
    );
    await registerTransaction.wait();

    console.log("Transaction Receipt:", registerTransaction);

    const sql =
      "INSERT INTO users (username, password, ethereumAddress, ethereumPrivateKey) VALUES (?,?, ?,?)";
    db.query(
      sql,
      [username, hashedPassword, ethereumAddress, ethereumPrivateKey],
      (err, result) => {
        if (err) {
          console.error("Error registering user:", err);
          res.status(500).json({ error: "注册失败" });
        } else {
          if (result.affectedRows > 0) {
            return res.json({ message: "注册成功" });
          } else {
            return res
              .status(401)
              .json({ error: "注册失败，用户名或密码错误" });
          }
        }
      }
    );
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // 用户登录逻辑
  const sql = "SELECT * FROM users WHERE username = ?";
  db.query(sql, [username], async (err, results) => {
    if (err) {
      console.error("Error logging in:", err);
      res.status(500).json({ error: "登录失败" });
    } else {
      if (results.length > 0) {
        const storedHashedPassword = results[0].password;
        // 提取 Ethereum 地址
        const ethereumAddress = results[0].ethereumAddress;
        console.log("商户地址：", ethereumAddress);

        // 使用 bcrypt 验证密码
        const passwordMatch = await bcrypt.compare(
          password,
          storedHashedPassword
        );

        if (passwordMatch) {
          // 登录成功，将用户信息存储在会话中
          req.session.username = username;
          req.session.isLoggedIn = true;

          const token = jwt.sign({ username }, "jwtkey", { expiresIn: "1h" });
          console.log("用户名、密码", username, password);

          return res.json({ message: "登录成功", token });
        } else {
          return res.status(401).json({ error: "登录失败，用户名或密码错误" });
        }
      } else {
        return res.status(401).json({ error: "登录失败，用户名或密码错误" });
      }
    }
  });
});

router.post("/updatePassword", async (req, res) => {
  const { errors, isValid } = validatorInputPerson(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { username, oldpassword, newpassword, agnewpassword } = req.body;
  console.log("返回值:", {
    username,
    oldpassword,
    newpassword,
    agnewpassword,
  });

  // 查询数据库以获取用户的哈希密码
  const sql = "SELECT password FROM users WHERE username = ?";

  db.query(sql, [username], async (err, results) => {
    if (err) {
      console.error("Error logging in:", err);
      res.status(500).json({ err });
    } else {
      if (results.length > 0) {
        const oldPasswordHash = results[0].password;

        // 使用 bcrypt 验证密码
        // 使用 bcrypt.compare 来比较哈希密码
        const passwordMatch = await bcrypt.compare(
          oldpassword,
          oldPasswordHash
        );

        if (passwordMatch) {
          // 旧密码匹配，继续更新密码
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(newpassword, saltRounds);
          const updateSql = "UPDATE users SET password = ? WHERE username = ?";
          await db.query(updateSql, [hashedPassword, username]);

          return res.status(200).json({ message: "密码更新成功" });
        } else {
          return res.status(400).json({ message: "错误的旧密码" });
        }
      }
    }
  });
});

router.get("/getIcon", (req, res) => {
  const username = req.query.username;

  if (!username) {
    return res.status(400).json({ success: false, message: "未提供用户名" });
  }

  const sql = "SELECT filePath FROM users WHERE username = ?";
  db.query(sql, [username], (err, result) => {
    if (err) {
      console.error("获取头像路径出错：", err);
      res.status(500).json({ success: false, message: "内部服务器错误" });
    } else {
      if (result.length > 0) {
        const filePath = result[0].filePath;
        res.json({ success: true, avatarUrl: filePath });
      } else {
        res.json({ success: false, message: "未找到用户头像" });
      }
    }
  });
});

router.get("/getInfo", (req, res) => {
  const username = req.query.username;

  if (!username) {
    return res.status(400).json({ success: false, message: "未提供用户名" });
  }

  const sql = "SELECT ethereumAddress FROM users WHERE username = ?";
  db.query(sql, [username], (err, result) => {
    if (err) {
      console.error("获取地址出错：", err);
      res.status(500).json({ success: false, message: "内部服务器错误" });
    } else {
      if (result.length > 0) {
        const ethereumAddress = result[0].ethereumAddress;
        res.json({ success: true, address: ethereumAddress });
      } else {
        res.json({ success: false, message: "未找到用户地址" });
      }
    }
  });
});

module.exports = router;
