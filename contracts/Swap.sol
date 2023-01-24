// // SPDX-License-Identifier: UNLICENSED
// pragma solidity ^0.8.0;

// import "hardhat/console.sol";
// import "./Token1.sol";
// import "./Token2.sol";
// import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

// contract Swap {

//     // address public constant UNISWAP_V2_ROUTER =
//     //     0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;

//     // IUniswapV2Router02 public router = IUniswapV2Router02(UNISWAP_V2_ROUTER);

//     Token1 public token1;
//     Token2 public token2;

//     constructor(Token1 _token1, Token2 _token2) {
//         console.log("TOKEN1 ADDRESS: ", address(_token1));
//         console.log("TOKEN2 ADDRESS: ", address(_token2));
//         require(
//             address(_token1) != address(0) && address(_token2) != address(0),
//             "Token address can not be address zero!"
//         );
//         token1 = _token1;
//         token2 = _token2;
//     }

//     function swap(address token, uint256 amountIn, uint256 amountOut, address[] memory path, address to, uint256 deadline) internal {
//         if (token == address(token1)) {
//             token1.approve(UNISWAP_V2_ROUTER, amountIn * 2);
//             console.log("ALLOWANCE FLIP => ROUTER: ", token1.allowance(address(this), UNISWAP_V2_ROUTER));
//             // token1.transferFrom(msg.sender, UNISWAP_V2_ROUTER, amountIn);
//             router.swapExactTokensForTokens(amountIn, amountOut, path, to, deadline);
//         } else {
//             token2.approve(UNISWAP_V2_ROUTER, amountIn * 2);
//             console.log("ALLOWANCE FLIP => ROUTER: ", token1.allowance(address(this), UNISWAP_V2_ROUTER));
//             // token2.transferFrom(msg.sender, UNISWAP_V2_ROUTER, amountIn);
//             router.swapExactTokensForTokens(amountIn, amountOut, path, to, deadline);
//         }
//     }
// }