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


//发送ETH到合约
async function depositFunds() {
  try {
    const amountToDeposit = 30; // 发送30 ETH
    const amountInWei = ethers.utils.parseEther(amountToDeposit.toString()); // 转换为 Wei

    // Call the deposit function in the contract
    const tx = await contract.deposit({
      value: amountInWei,
    });

    // Wait for transaction confirmation
    await tx.wait();

    console.log("转账信息:", tx);
    return { success: true, tx };
  } catch (error) {
    console.error(error);
    return { success: false, error: error.message };
  }
}

//调用get方法获取积分的详细信息
router.get("/all-list", async (req, res) => {
  try {
    // Call the getAllCreditCredentials function in the contract
    const allCreditDetails = await contract.getAllCreditCredentials();

    const pointsDetails = allCreditDetails.map((detail) => ({
      merchantId: detail.merchantId.toNumber(),
      username: detail.username,
      merchantAddress: detail.merchantAddress,
      creditScore: detail.creditScore.toNumber(),
    }));

    console.log("获取积分的详细信息:", pointsDetails);

    // 将 allCreditDetails 返回给前端
    res.json({ success: true, pointsDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

//使用积分兑换ETH
let hasDepositedFunds = false;
router.post("/exchange-points", async (req, res) => {
  try {
    const {creditAmount,merchantAddress } = req.body;

    // 确保所有参数都存在
    if (!merchantAddress || !creditAmount) {
      return res
        .status(400)
        .json({ success: false, message: "缺少必要的参数" });
    }
    // 如果尚未执行过 depositFunds，则执行
    if (!hasDepositedFunds) {
      await depositFunds();
      hasDepositedFunds = true;
    }
    // Call the contract function
    const tx = await contract.exchangeCreditsForETH(
      creditAmount,
      merchantAddress
    );

    // Wait for the transaction confirmation
    await tx.wait();

    res.json({ success: true, transactionHash: tx.hash });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

//拿到商户的eth余额
router.post("/getEthBalance", async (req, res) => {
  try {
    const {userAddress} = req.body;

    // 确保所有参数都存在
    if (!userAddress) {
      return res
        .status(400)
        .json({ success: false, message: "缺少必要的参数" });
    }
    // 如果尚未执行过 depositFunds，则执行
    if (!hasDepositedFunds) {
      await depositFunds();
      hasDepositedFunds = true;
    }
    // Call the contract function
    const ethbalance = await contract.getEthBalance(
      userAddress
    );
    const ethbalancenumber = ethers.utils.formatUnits(ethbalance, "ether");
    console.log("余额：",ethbalancenumber)

    res.json({ success: true, ethbalancenumber: ethbalancenumber });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
