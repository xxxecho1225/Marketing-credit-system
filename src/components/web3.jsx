import React, { useState, useEffect } from "react";
import Web3 from "web3";
import abi from "../abis/abi.json";

const MyWeb3 = () => {
  const [recipient, setRecipient] = useState(null); //定义数据库拿到的账户
  const [userAccount, setUserAccount] = useState(null); //定义发送者的账户
  const contractAddress = "0xd9145CCE52D386f254917e481eB44e9943F39138"; // 智能合约地址，根据您的部署值进行替换
  const [creditCredentials, setCreditCredentials] = useState(""); // 定义信用凭证数据

  // 初始化 Web3 和获取用户账户
  const initializeWeb3 = () => {
    if (window.ethereum) {
      const provider = window.ethereum;
      const web3 = new Web3(provider);

      web3.eth.getAccounts().then(function (accounts) {
        setUserAccount(accounts[0]);
      });
      return web3;
    }
  };

  // 上传信用凭证
  const uploadCreditCredentials = () =>{
    const web3 = initializeWeb3();
    if (web3) {
      const contract = new web3.eth.Contract(abi.abi, contractAddress);
      contract.methods
        .uploadCreditCredentials(creditCredentials)
        .send({
          from: userAccount,
        })
        .on("transactionHash", function (hash) {
          // Transaction hash sent
        })
        .on("receipt", function (receipt) {
          // Transaction confirmed
        })
        .on("error", function (error) {
          // Error occurred
        });
    }
  };

  // 获取商户余额
  const getMerchantBalance = () => {
    const web3 = initializeWeb3();
    if (web3) {
      const contract = new web3.eth.Contract(abi.abi, contractAddress);
      contract.methods
        .getMerchantBalance("MerchantAddress")
        .call()
        .then((balance) => {
          // 处理返回的余额
        })
        .catch((error) => {
          // 处理错误
        });
    }
  };

  // 兑换积分为 NFT
  const exchangeCreditsForNFT = (creditAmount,recipient) => {
    const web3 = initializeWeb3();
    if (web3) {
      const contract = new web3.eth.Contract(abi.abi, contractAddress);
      contract.methods
        .exchangeCreditsForNFT(creditAmount)
        .send({
          from: userAccount,
        })
        .on("transactionHash", function (hash) {
          // 交易哈希已发送
        })
        .on("receipt", function (receipt) {
          // 交易已确认
        })
        .on("error", function (error) {
          // 发生错误
        });
    }
  };
};

export default MyWeb3;
