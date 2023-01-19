// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Token1.sol";
import "./Token2.sol";
import "./Swap.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

contract Flip is Swap {
    // address public constant UNISWAP_V2_ROUTER =
    //     0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    Token1 public tokena;
    Token2 public tokenb;


    struct Pool {
        uint256 token1TotalAmount;
        uint256 token2TotalAMount;
        uint256 creationTime;
    }

    event Data(uint256 winProb1, uint256 winProb2, uint256 randomNumber); 

    Pool public pool;
    // IUniswapV2Router02 public router = IUniswapV2Router02(UNISWAP_V2_ROUTER);

    constructor(Token1 _tokena, Token2 _tokenb) Swap(_tokena, _tokenb) {
        tokena = _tokena;
        tokenb = _tokenb;
        // require(
        //     address(_token1) != address(0) && address(_token2) != address(0),
        //     "Token address can not be address zero!"
        // );
        // token1 = _token1;
        // token2 = _token2;
    }

    function deposit(address token, uint256 amount) public {
        require(
            token == address(token1) || token == address(token2),
            "Deposited token must be either token1 or token2!"
        );

        if (pool.token1TotalAmount == 0 && pool.token2TotalAMount == 0) {
            pool.creationTime = block.timestamp;
        }

        if (token == address(token1)) {
            // token1.approve(address(this), amount);
            console.log("deposit token1");
            token1.transferFrom(msg.sender, address(this), amount);
            pool.token1TotalAmount += amount;
        } else {
            // token2.approve(address(router), amount);
            console.log("deposit token2");
            token2.transferFrom(msg.sender, address(this), amount);
            pool.token2TotalAMount += amount;
        }
    }

    function flip() public {
        require(
            pool.token1TotalAmount > 0 && pool.token2TotalAMount > 0,
            "Pool needs to have two types of tokens!"
        );
        // require(
        //     block.timestamp - pool.creationTime >= 1 days,
        //     "You have to wait till a day is passed!"
        // );

        token1.approve(UNISWAP_V2_ROUTER, pool.token1TotalAmount * 2);
        token2.approve(UNISWAP_V2_ROUTER, pool.token2TotalAMount * 2);

        console.log("allowance token1 BEFORE owner => router", token1.allowance(address(this), UNISWAP_V2_ROUTER));
        console.log("allowance token2 BEFORE owner => router", token2.allowance(address(this), UNISWAP_V2_ROUTER));


        uint256 randomNumber = (
            uint256(
                keccak256(
                    abi.encodePacked(msg.sender, block.number, block.timestamp)
                )
            )
        ) % 100;

        uint256 token1WinProb = (pool.token1TotalAmount * 100) /
            (pool.token1TotalAmount + pool.token2TotalAMount);

        router.addLiquidity(
            address(token1),
            address(token2),
            pool.token1TotalAmount,
            pool.token2TotalAMount,
            10,
            10,
            address(this),
            block.timestamp + 1 days
        );

        console.log("allowance token1 AFTER owner => router", token1.allowance(address(this), UNISWAP_V2_ROUTER));
        console.log("allowance token2 AFTER owner => router", token2.allowance(address(this), UNISWAP_V2_ROUTER));

        address[] memory path1;
        address[] memory path2;
        path1 = new address[](2);
        path2 = new address[](2);
        path1[0] = address(token1);
        path1[1] = address(token2);
        path2[0] = address(token2);
        path2[1] = address(token1);

        if (randomNumber <= token1WinProb) {
            console.log("token1 won");
            // console.log(msg.sender);
            // token1.approve(UNISWAP_V2_ROUTER, pool.token1TotalAmount);
            // token1.transferFrom(msg.sender, UNISWAP_V2_ROUTER, pool.token1TotalAmount);

            // router.swapExactTokensForTokens(
            //     pool.token2TotalAMount / 2,
            //     0,
            //     path1,
            //     address(this),
            //     block.timestamp + 300
            // );
            swap(address(token1),
                pool.token1TotalAmount,
                0,
                path1,
                address(this),
                block.timestamp + 300);
            emit Data(token1WinProb, 100 - token1WinProb, randomNumber);
        } else {
            console.log("token2 won");
            // console.log(msg.sender);
            // token2.approve(UNISWAP_V2_ROUTER, pool.token2TotalAMount);
            // token2.transferFrom(msg.sender, UNISWAP_V2_ROUTER, pool.token2TotalAMount);
            
            // router.swapExactTokensForTokens(
            //     pool.token1TotalAmount / 2,
            //     0,
            //     path2,
            //     address(this),
            //     block.timestamp + 300
            // );
            swap(address(token2),
                pool.token2TotalAMount,
                0,
                path2,
                address(this),
                block.timestamp + 300);
            emit Data(100 - token1WinProb, token1WinProb, randomNumber);
        }

        pool.token1TotalAmount = 0;
        pool.token2TotalAMount = 0;
        pool.creationTime = 0;
    }
}
