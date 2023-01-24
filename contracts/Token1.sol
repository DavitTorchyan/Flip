// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./ERC20.sol";

contract Token1 is ERC20{
    constructor() ERC20("Token1", "T1") {
    }

    function _transfer(address sender, address spender, uint256 amount) internal override {
        super._transfer(sender, spender, amount);
    }

    function mint(uint256 amount) public {
        _mint(msg.sender, amount * 10 ** decimals());
    } 
}