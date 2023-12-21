// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Nft1155.sol";

abstract contract Base is Nft1155 {
    constructor() {
        // 设置兑换汇率
        exchangeRates[COIN] = 100; // 100积分兑换一个COIN
        exchangeRates[BOIN] = 200; // 200积分兑换一个BOIN
        exchangeRates[KOIN] = 300; // 300积分兑换一个KOIN
        // 构造函数，在合约部署时执行
        // 创建并分配初始 NFT
        _mint(msg.sender, COIN, 10 * 1000, "");
        _mint(msg.sender, BOIN, 6 * 1000, "");
        _mint(msg.sender, KOIN, 6 * 1000, "");
        owners = msg.sender;
    }

    // 信用凭证
    struct CreditCredentials {
        uint256 merchantId; // 商户ID
        string username; // 商户名字
        address merchantAddress; // 商户地址
        string creditRating; // 信用评级
        string customerReview; // 客户评价
        string financialStatement; // 财务陈述
        string ipfsHash; // 上传文件的哈希值
        uint256 creditScore; // 信用分数
    }

    mapping(address => CreditCredentials) public credits;
    mapping(address => uint256) public ethBalances;
    
    function transfer(address payable recipient, uint256 amount)
        external
        onlyOwner
    {
        require(recipient != address(0), "Invalid recipient address");
        require(
            amount > 0 && amount <= address(this).balance,
            "Invalid amount"
        );

        recipient.transfer(amount);
    }

    function deposit() external payable {}

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    uint256 public exchangeRate = 100;

    // 获取商户积分余额
    function getMerchantBalance(address merchantAddress)
        public
        view
        returns (uint256)
    {
        require(merchantAddress != address(0), "Invalid merchant address");
        return credits[merchantAddress].creditScore;
    }

    // 积分兑换ETH的方法
    function exchangeCreditsForETH(
        uint256 creditAmount,
        address merchantAddress
    ) external {
        uint256 userCredit = getMerchantBalance(merchantAddress);
        require(userCredit >= creditAmount, "Insufficient credits");

        uint256 ethAmount = (creditAmount * exchangeRate) * (10**14);
        require(
            address(this).balance >= ethAmount,
            "Insufficient contract balance"
        );

        credits[merchantAddress].creditScore -= creditAmount;
        ethBalances[merchantAddress] += ethAmount;
        payable(merchantAddress).transfer(ethAmount);
    }
    //获取商户的余额eth
    function getEthBalance(address userAddress) external view returns (uint256) {
        return ethBalances[userAddress];
    }

    // 兑换积分为 NFT
    function exchangeCreditsForNFT(
        uint256 id,
        uint256 amount, //代币数量
        uint256 creditAmount, //商户积分
        address merchantAddress, //商户地址
        string memory tokenURI
    ) external {
        uint256 usercredit = credits[merchantAddress].creditScore;
        require(usercredit >= creditAmount, "Insufficient credits");
        require(exchangeRates[COIN] > 0, "Invalid exchange rate for NFT");
        require(exchangeRates[BOIN] > 0, "Invalid exchange rate for NFT");
        require(exchangeRates[KOIN] > 0, "Invalid exchange rate for NFT");
        require(credits[merchantAddress].creditScore >= creditAmount,"Insufficient credits");

        // 调用赠送NFT的方法
        giftNFTForMerchant(merchantAddress, id, amount, tokenURI);

        credits[merchantAddress].creditScore -= creditAmount;
    }


    // 提取 ETH 余额
    function withdraw(address payable to, uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "Insufficient balance");
        to.transfer(amount);
    }

    // 合约接受 ETH 资金
    receive() external payable {}
}
