const express = require("express");
const router = express.Router();
const { ethers } = require("ethers");
const bodyParser = require("body-parser");
const pinataSDK = require("@pinata/sdk");
const multer = require("multer");
const streamifier = require("streamifier");
const ABI = require("../../src/abi.json");

//JSON requests
router.use(bodyParser.json());

// 配置文件上传
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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

// 调用合约中的uploadCreditCredentials方法
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const {
      username,
      merchantAddress,
      creditRating,
      customerReview,
      financialStatement,
      ipfsHash,
    } = req.body;

    // 确保所有参数都存在
    if (
      !username ||
      !merchantAddress ||
      !creditRating ||
      !customerReview ||
      !financialStatement ||
      !ipfsHash
    ) {
      return res
        .status(400)
        .json({ success: false, message: "缺少必要的参数" });
    }

    // Call the uploadCreditCredentials function
    const tx = await contract.functions.uploadCreditCredentials(
      username,
      merchantAddress,
      creditRating,
      customerReview,
      financialStatement,
      ipfsHash
    );

    // Wait for the transaction to be mined
    await tx.wait();

    res.json({ success: true, transactionHash: tx });
  } catch (error) {
    console.error(error);
    res.json({ success: false, error: error.message });
  }
});

//调用get方法获取所有信用凭证的详细信息
router.get("/all-list", async (req, res) => {
  try {
    // Call the getAllCreditCredentials function in the contract
    const allCreditDetails = await contract.getAllCreditCredentials();

    const processedCreditDetails = allCreditDetails.map(detail => ({
      merchantId: detail.merchantId.toNumber(),
      username: detail.username,
      merchantAddress: detail.merchantAddress,
      creditRating: detail.creditRating,
      customerReview: detail.customerReview,
      financialStatement: detail.financialStatement,
    }));

    console.log("所有信用凭证的详细信息:", processedCreditDetails);

    // 将 allCreditDetails 返回给前端
    res.json({ success: true, processedCreditDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});


//使用pinata的key secret
const key = "c2df5ccda303c2b9186d";
const secret =
  "b2dfe1c2d7a263d2b8220b10b4079a40f118898eb612e76531a7bf416ba55881";
// 使用 Pinata API 密钥连接到 Pinata 服务
const pinata = new pinataSDK(key, secret);

//上传信用凭证中文件的接口
router.post("/fileupload", upload.single("file"), async (req, res) => {
  const fileBuffer = req.file.buffer;
  const readableStream = streamifier.createReadStream(fileBuffer);

  try {
    // 将文件上传到 Pinata
    const pinataOptions = {
      pinataMetadata: {
        name: req.file.originalname,
      },
    };
    const pinataFile = await pinata.pinFileToIPFS(
      readableStream,
      pinataOptions
    );
    // 获取 Pinata 中的文件路径
    const filePath = pinataFile.IpfsHash;
    const pinataFileUrl = `https://gateway.pinata.cloud/ipfs/${filePath}`;
    console.log("上传文件的路径id:", filePath);
    console.log("上传文件的url:", pinataFileUrl);
    res.json({
      success: true,
      pinataFileUrl: pinataFileUrl,
      filePath: filePath,
      message: "上传文件成功",
    });
  } catch (error) {
    console.error("上传Pinata失败:", error);
    res.status(500).send("上传到 Pinata 失败");
  }
});

module.exports = router;
