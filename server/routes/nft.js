const express = require("express");
const router = express.Router();
const { ethers } = require("ethers");
const bodyParser = require("body-parser");
const ABI = require("../../src/abi.json");

//JSON requests
router.use(bodyParser.json());

// 合约地址和abi
const contractAddress = "0x0C6f0F826de7a69A0688528A5ff8C58A16C0F46b";
//私钥
const privateKey =
  "a8c712ec57d869a942f2200875c7fc851dd06df40f7181d92bd45b9751235181";
const ETHEREUM_NODE_URL = "http://127.0.0.1:7545";

//连接以太坊节点
const provider = new ethers.providers.JsonRpcProvider(ETHEREUM_NODE_URL);
const wallet = new ethers.Wallet(privateKey, provider);

const contract = new ethers.Contract(contractAddress, ABI, wallet);

router.post("/exchange", async (req, res) => {
  try {
    const { id, amount, creditAmount, merchantAddress, tokenURI } = req.body;

    // 确保所有参数都存在
    if (!id || !amount || !merchantAddress || !creditAmount || !tokenURI) {
      return res
        .status(400)
        .json({ success: false, message: "缺少必要的参数" });
    }
    // Call the contract function
    const tx = await contract.exchangeCreditsForNFT(
      id,
      amount,
      creditAmount,
      merchantAddress,
      tokenURI,
      { gasLimit: 500000 }
    );

    // Wait for the transaction confirmation
    await tx.wait();

    res.json({ success: true, transactionHash: tx.hash });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

//获取商户的代币信息
router.post("/getMerchantNFT", async (req, res) => {
  try {
    const {merchant} = req.body;

    // 确保所有参数都存在
    if (!merchant ) {
      return res
        .status(400)
        .json({ success: false, message: "缺少必要的参数" });
    }
    // Call the contract function
    const nftData  = await contract.getMerchantNFTs(merchant);

    const nftdataDetails = nftData.map(detail => ({
      id: detail.id.toNumber(),
      amount: detail.amount.toNumber(),
      tokenURI: detail.tokenURI,
    }));

    console.log("nftdataDetails:",nftdataDetails)

    res.json({ success: true, nftdataDetails: nftdataDetails  });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
