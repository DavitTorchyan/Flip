// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Token1.sol";
import "./Token2.sol";
import "./Swap.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";

contract Flip {
    address public constant UNISWAP_V2_ROUTER =
        0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    address public constant UNISWAP_V2_FACTORY =
        0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;

    Token1 public token1;
    Token2 public token2;

    struct Pool {
        uint256 token1TotalAmount;
        uint256 token2TotalAMount;
        uint256 creationTime;
    }

    event Data(uint256 winProb1, uint256 winProb2, uint256 randomNumber);

    Pool public pool;
    IUniswapV2Router02 public router = IUniswapV2Router02(UNISWAP_V2_ROUTER);
    IUniswapV2Factory public factory = IUniswapV2Factory(UNISWAP_V2_FACTORY);

    constructor(Token1 _token1, Token2 _token2) {
        require(
            address(_token1) != address(0) && address(_token2) != address(0),
            "Token address can not be address zero!"
        );
        token1 = _token1;
        token2 = _token2;
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
            token1.transferFrom(msg.sender, address(this), amount);
            pool.token1TotalAmount += amount;
        } else {
            token2.transferFrom(msg.sender, address(this), amount);
            pool.token2TotalAMount += amount;
        }
    }

    function addLiquidity(
        address _token1,
        address _token2,
        uint256 token1Amount,
        uint256 token2Amount,
        uint256 minToken1AAmount,
        uint256 minToken2Amount,
        address to,
        uint256 timeout
    ) public {
        factory.createPair(_token1, _token2);
        token1.approve(UNISWAP_V2_ROUTER, 1000 * 10e18);
        token2.approve(UNISWAP_V2_ROUTER, 1000 * 10e18);
        router.addLiquidity(
            address(_token1),
            address(_token2),
            token1Amount,
            token2Amount,
            minToken1AAmount,
            minToken2Amount,
            to,
            timeout
        );
    }

    function flip() external {
        _flip();
    }

    function _flip() internal {
        require(
            pool.token1TotalAmount > 0 && pool.token2TotalAMount > 0,
            "Pool needs to have two types of tokens!"
        );

        token1.approve(UNISWAP_V2_ROUTER, pool.token1TotalAmount);
        token2.approve(UNISWAP_V2_ROUTER, pool.token2TotalAMount);

        uint256 randomNumber = (
            uint256(
                keccak256(
                    abi.encodePacked(msg.sender, block.number, block.timestamp)
                )
            )
        ) % 100;

        uint256 token1WinProb = (pool.token1TotalAmount * 100) /
            (pool.token1TotalAmount + pool.token2TotalAMount);

        console.log("RANDOM NUMBER: ", randomNumber);
        console.log("TOKEN1 WIN PROB: ", token1WinProb);
        console.log("TOKEN2 WIN PROB: ", 100 - token1WinProb);

        address[] memory path = new address[](2);
        if (randomNumber <= token1WinProb) {
            console.log("token1 won");
            path[0] = address(token2);
            path[1] = address(token1);
            router.swapExactTokensForTokens(
                pool.token2TotalAMount,
                0,
                path,
                msg.sender,
                block.timestamp
            );
            emit Data(token1WinProb, 100 - token1WinProb, randomNumber);
        } else {
            console.log("token2 won");
            path[0] = address(token1);
            path[1] = address(token2);
            router.swapExactTokensForTokens(
                pool.token1TotalAmount,
                0,
                path,
                msg.sender,
                block.timestamp
            );
            emit Data(100 - token1WinProb, token1WinProb, randomNumber);
        }

        pool.token1TotalAmount = 0;
        pool.token2TotalAMount = 0;
        pool.creationTime = 0;
    }
}
