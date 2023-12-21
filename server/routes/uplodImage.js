const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const mysql = require("mysql");
const router = express.Router();
const pinataSDK = require("@pinata/sdk");
const streamifier = require('streamifier');

// 创建数据库连接
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "credit",
});

router.use(bodyParser.json());

//使用pinata的key secret
const key = "c2df5ccda303c2b9186d";
const secret = "b2dfe1c2d7a263d2b8220b10b4079a40f118898eb612e76531a7bf416ba55881";
// 使用 Pinata API 密钥连接到 Pinata 服务
const pinata = new pinataSDK(key, secret);

// 配置文件上传
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/upload", upload.single("file"), async (req, res) => {
  // 获取文件上传后的信息
  const username1 = req.headers.username; // 从请求头中获取 username
  const username = decodeURIComponent(username1);
  console.log("1111111",username)

  if (!username) {
    // 如果没有 username，返回错误
    return res.status(400).json({ success: false, message: "未提供用户名" });
  }


  const fileBuffer = req.file.buffer;
  const readableStream = streamifier.createReadStream(fileBuffer);

  try {
    // 将文件上传到 Pinata
    const pinataOptions = {
      pinataMetadata: {
        name: req.file.originalname,
      },
    };
    const pinataFile = await pinata.pinFileToIPFS(readableStream, pinataOptions);
    // 获取 Pinata 中的文件路径
    const filePath = pinataFile.IpfsHash;
    const pinataFileUrl = `https://gateway.pinata.cloud/ipfs/${filePath}`;
    console.log("用户名:", username);
    console.log("上传头像的路径id:", filePath);
    console.log("上传图片的url:",pinataFileUrl)

    const sql = "UPDATE users SET filePath = ? WHERE username = ?";
    db.query(sql, [pinataFileUrl, username], (err, result) => {
      if (err) {
        console.log("更新头像出错：", err);
        res.status(500).send("内部服务器错误");
      } else {
        console.log("结果：", result);
        res.json({
          success: true,
          pinataFileUrl: pinataFileUrl,
          message: "头像更新成功",
        });
      }
    });
  } catch (error) {
    console.error("Error uploading to Pinata:", error);
    res.status(500).send("上传到 Pinata 失败");
  }
});

module.exports = router;
