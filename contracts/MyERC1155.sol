// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";  // 导入Ownable合约，用于权限管理

// 合约定义
abstract contract MyERC1155 is ERC1155, Ownable {
    // 代币类型
    uint256 public constant COIN = 1;
    uint256 public constant BOIN = 2;
    uint256 public constant KOIN = 3;
    address  userowner;

    // 兑换汇率映射
    mapping(uint256 => uint256) public exchangeRates;
    // 合约构造函数
    constructor()ERC1155("") {
        userowner = msg.sender;
        // 设置代币URI，用于获取代币元数据
        // 设置兑换汇率
        exchangeRates[COIN] = 100; // 100积分兑换一个COIN
        exchangeRates[BOIN] = 200; // 200积分兑换一个BOIN
        exchangeRates[KOIN] = 300; // 300积分兑换一个KOIN
        _mint(msg.sender, COIN, 10*1000, "");
        _mint(msg.sender, BOIN, 6*1000, "");
        _mint(msg.sender, KOIN, 6*1000, "");
        
    }

    // 批量发行新的代币
    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data) public onlyOwner {
        _mintBatch(to, ids, amounts, data);
    }

    // 撤销代币
    function burn(address account, uint256 id, uint256 amount) public onlyOwner {
        _burn(account, id, amount);
    }

    // 批量撤销代币
    function burnBatch(address account, uint256[] memory ids, uint256[] memory amounts) public onlyOwner {
        _burnBatch(account, ids, amounts);
    }
    
    function _url(uint256 tokenId) external pure returns (string memory) {
    // 将{tokenId}替换为实际的代币ID
    return string(abi.encodePacked("https://game.example/api/item/", uint2str(tokenId), ".json"));
}

    // 辅助函数，用于将uint256转换为字符串
    function uint2str(uint256 _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len - 1;
        while (_i != 0) {
            bstr[k--] = bytes1(uint8(48 + uint256(_i % 10)));
            _i /= 10;
        }
        return string(bstr);
    }

}
