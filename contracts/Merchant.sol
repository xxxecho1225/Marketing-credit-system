// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Base.sol";

contract Merchant is Base {
    constructor() {}

    address[] public merchantIndex; //存储所有商户的地址的数组

    // 营销信息
    struct MerchantInfo {
        uint256 merchantId; // 商户ID
        string username; // 商户名字
        address merchantAddress; // 商户地址
        string productname; //产品名字
        string description; //产品描述
        string promotions; //推广活动名字
        string ipfsHashMerchant; //上传文件的哈希
        uint256 creditScore; // 信用分数
    }
            // 上传信用凭证的事件
    event CreditUploaded(
        uint256 merchantId,
        string username,
        address indexed merchantAddress,
        string creditRating,
        string customerReview,
        string financialStatement,
        string ipfsHash,
        uint256 creditScore
    );

    // 上传营销信息的事件
    event MarketingInfoUploaded(
        uint256 merchantId,
        string username,
        address indexed merchantAddress,
        string productname,
        string description,
        string promotions,
        string ipfsHashMerchant
    );

    // 用于通知前端新的信用凭证已上传的事件
    event AllCreditCredentials(CreditCredentials[] allCredentials);

    mapping(address => MerchantInfo) public merchants;
    mapping(uint256 => CreditCredentials) public creditCredentials;


    // 注册商户的函数
    function registerMerchant(string memory _username, address _merchantAddress)
        external
    {
        require(_merchantAddress != address(0), "Invalid merchant address");
        require(
            credits[_merchantAddress].merchantId == 0,
            "Merchant already registered"
        );

        require(
            merchants[_merchantAddress].merchantId == 0,
            "Merchant already registered"
        );

        uint256 merchantId = merchantIndex.length + 1; // 分配唯一的商户ID
        merchants[_merchantAddress] = MerchantInfo({
            merchantId: merchantId,
            username: _username,
            merchantAddress: _merchantAddress,
            productname: "",
            description: "",
            promotions: "",
            ipfsHashMerchant: "",
            creditScore: 0
        });
        merchantIndex.push(_merchantAddress);
    }

    // 获取商户数量的方法
    function getMerchantsCount() public view returns (uint256) {
        return merchantIndex.length;
    }

    // 上传信用凭证的方法
    function uploadCreditCredentials(
        string memory _username,
        address _merchantAddress,
        string memory creditRating,
        string memory customerReview,
        string memory financialStatement,
        string memory ipfsHash
    ) external {
        // 上传凭证奖励200积分
        uint256 creditEarned = 400;
        credits[_merchantAddress].creditScore += creditEarned;
        uint256 merchantId = credits[msg.sender].merchantId;

        // 更新 merchants 映射的信息
        CreditCredentials storage merchantCredits = credits[_merchantAddress];
        merchantCredits.username = _username;
        merchantCredits.merchantAddress = _merchantAddress;
        merchantCredits.creditRating = creditRating;
        merchantCredits.customerReview = customerReview;
        merchantCredits.financialStatement = financialStatement;

        emit CreditUploaded(
            merchantId,
            _username,
            msg.sender,
            creditRating,
            customerReview,
            financialStatement,
            ipfsHash,
            merchantCredits.creditScore
        );
    }

    // 获取所有上传信用凭证信息
    function getAllCreditCredentials()
        external
        view
        returns (CreditCredentials[] memory)
    {
        uint256 merchantsCount = getMerchantsCount(); // 使用获取商户数量的方法

        CreditCredentials[] memory allCredentials = new CreditCredentials[](
            merchantsCount
        );

        for (uint256 i = 0; i < merchantsCount; i++) {
            address merchantAddress = merchantIndex[i];
            CreditCredentials storage merchantCredits = credits[
                merchantAddress
            ];

            // 填充 allCredentials 数组
            allCredentials[i] = CreditCredentials({
                merchantId: merchantCredits.merchantId,
                username: merchantCredits.username,
                merchantAddress: merchantCredits.merchantAddress,
                creditRating: merchantCredits.creditRating,
                customerReview: merchantCredits.customerReview,
                financialStatement: merchantCredits.financialStatement,
                ipfsHash: creditCredentials[merchantCredits.merchantId].ipfsHash,
                creditScore: merchantCredits.creditScore
            });
        }

        return allCredentials;
    }

    // 上传营销信息
    function uploadMarketingInfo(
        string memory _username,
        address _merchantAddress,
        string memory _productname,
        string memory _description,
        string memory _promotions,
        string memory _ipfsHashMerchant
    ) external {
        uint256 merchantId = merchants[msg.sender].merchantId;

        // 更新 merchants 映射的信息
        merchants[_merchantAddress].username = _username;
        merchants[_merchantAddress].merchantAddress = _merchantAddress;
        merchants[_merchantAddress].productname = _productname;
        merchants[_merchantAddress].description = _description;
        merchants[_merchantAddress].promotions = _promotions;
        merchants[_merchantAddress].ipfsHashMerchant = _ipfsHashMerchant;

        emit MarketingInfoUploaded(
            merchantId,
            _username,
            _merchantAddress,
            _productname,
            _description,
            _promotions,
            _ipfsHashMerchant
        );
    }

    //获取所有上传的营销信息
    function getAllMarketingInfo()
        external
        view
        returns (MerchantInfo[] memory)
    {
        uint256 merchantsCount = getMerchantsCount(); // 使用获取商户数量的方法

        MerchantInfo[] memory allMarketingInfo = new MerchantInfo[](
            merchantsCount
        );

        for (uint256 i = 0; i < merchantsCount; i++) {
            address merchantAddress = merchantIndex[i];
            MerchantInfo storage merchant = merchants[merchantAddress];

            // 填充 allMarketingInfo 数组
            allMarketingInfo[i] = MerchantInfo({
                merchantId: merchant.merchantId,
                username: merchant.username,
                merchantAddress: merchant.merchantAddress,
                productname: merchant.productname,
                description: merchant.description,
                promotions: merchant.promotions,
                ipfsHashMerchant: merchant.ipfsHashMerchant,
                creditScore: merchant.creditScore
            });
        }

        return allMarketingInfo;
    }
    
}
