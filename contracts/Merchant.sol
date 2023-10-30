// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./MyERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Merchant is Ownable,MyERC1155{
    //商户
    struct MerchantInfo {
        string name; // 商户名字
        // address merchantAddress;
        // uint256 password;
        string creditCredentials; // 信用凭证
        uint256 creditScore; // 积分
    }

    mapping(address => MerchantInfo) public merchants;

    // event MerchantRegistered(address indexed merchantAddress, string name);
    event CreditUploaded(address indexed merchantAddress, string creditCredentials, uint256 creditEarned);


     // 上传信用凭证
    function uploadCreditCredentials(string memory creditCredentials) external {
        // require(bytes(merchants[msg.sender].name).length > 0, "Merchant not registered");
        merchants[msg.sender].creditCredentials = creditCredentials;
        // 奖励100积分
        uint256 creditEarned = 100;
        merchants[msg.sender].creditScore += creditEarned;
        emit CreditUploaded(msg.sender, creditCredentials, creditEarned);
    }

    // 获取商户积分余额
    function getMerchantBalance(address merchantAddress) external view returns (uint256) {
        require(merchantAddress != address(0), "transfer to the zero address");
        require(bytes(merchants[merchantAddress].name).length > 0, "Merchant not registered");
        return merchants[merchantAddress].creditScore;
    }

    // 兑换积分为 NFT
    function exchangeCreditsForNFT(uint256 creditAmount, address recipient) external {
        uint256 usercredit = merchants[msg.sender].creditScore;
        // require(usercredit >= creditAmount * 100);
        require(usercredit >= creditAmount, "Insufficient credits");
        require(exchangeRates[COIN] > 0, "Invalid exchange rate for NFT");
        require(exchangeRates[BOIN] > 0, "Invalid exchange rate for NFT");
        require(exchangeRates[KOIN] > 0, "Invalid exchange rate for NFT");
        require(merchants[msg.sender].creditScore >= creditAmount, "Insufficient credits");
        // 确保接收地址有效
        require(recipient != address(0), "Invalid recipient address");
       _safeTransferFrom(address(this),msg.sender,COIN,creditAmount,"");
       _safeTransferFrom(address(this),msg.sender,BOIN,creditAmount,"");
       _safeTransferFrom(address(this),msg.sender,KOIN,creditAmount,"");
        
        merchants[msg.sender].creditScore -= creditAmount;
    }



    // 提取 ETH 余额
    function withdraw(address payable to, uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "Insufficient balance");
        to.transfer(amount);
    }

    // 合约接受 ETH 资金
    receive() external payable {}

}