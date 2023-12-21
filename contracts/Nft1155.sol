// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

abstract contract Nft1155 is ERC1155, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    uint256 public constant COIN = 1;
    uint256 public constant BOIN = 2;
    uint256 public constant KOIN = 3;
    address public owners;

    //代币
    struct NFT {
    uint256 id;
    uint256 amount;
    string tokenURI;
    }

    // NFT id对元数据的映射
    mapping(uint256 => string) public  _tokenURIs;
    // 兑换汇率映射
    mapping(uint256 => uint256) public exchangeRates;
    mapping(address => NFT[]) public merchantNFTs;

    constructor()
        ERC1155(
            "ipfs://bafybeidm2abuj7ycnnp6wmxivy3vh6kh2lymhbyv7ivg3pzdwecsr2bzxi/{id}.json"
        )
        Ownable()
    {
        // 设置兑换汇率
        exchangeRates[COIN] = 100; // 100积分兑换一个COIN
        exchangeRates[BOIN] = 200; // 200积分兑换一个BOIN
        exchangeRates[KOIN] = 300; // 300积分兑换一个KOIN
        // 构造函数，在合约部署时执行
        // 创建并分配初始 NFT
        _mint(msg.sender, COIN, 10 * 1000, "");
        _mint(msg.sender, BOIN, 6 * 1000, "");
        _mint(msg.sender, BOIN, 6 * 1000, "");
        owners = msg.sender;
    }

    // 赠送一个新的 NFT，并分配给商户
    function giftNFTForMerchant(
        address to,
        uint256 id,
        uint256 amount, //代币数量
        string memory tokenURI
    ) public onlyOwner {
        _mintNFT(to, id, amount, tokenURI);
    }

    function setaa() external {
        setApprovalForAll(address(this), true);
        safeTransferFrom(owners, address(this), COIN, 10 * 1000, "");
        safeTransferFrom(owners, address(this), BOIN, 6 * 1000, "");
        safeTransferFrom(owners, address(this), BOIN, 6 * 1000, "");
    }

    function _mintNFT(
        address to,
        uint256 id,
        uint256 amount,
        string memory tokenURI
    ) internal {
        // 铸造新的 NFT，并分配给指定地址
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _tokenURIs[newItemId] = tokenURI; // 关联 NFT ID 和元数据 URI
        // 创建 NFT 结构体
        NFT memory newNFT = NFT({
            id: id,
            amount: amount,
            tokenURI: tokenURI
        });

        // 更新商户的 NFT 列表
        merchantNFTs[to].push(newNFT);

        // 更新相应代币的余额
        if (id == COIN) {
            safeTransferFrom(owners, to, COIN, amount, ""); // 铸造相应数量的 COIN 给合约地址
        } else if (id == BOIN) {
            safeTransferFrom(owners, to, BOIN, amount, ""); // 铸造相应数量的 BOIN 给合约地址
        } else if (id == KOIN) {
            safeTransferFrom(owners, to, KOIN, amount, ""); // 铸造相应数量的 KOIN 给合约地址
        }
    }

        //获取指定商户的所有代币信息
    function getMerchantNFTs(address merchant) public view returns (NFT[] memory) {
        return merchantNFTs[merchant];
    }

    
}
