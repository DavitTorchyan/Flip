import { ethers } from "hardhat";

async function main() {
  
  const Token1 = await ethers.getContractFactory("Token1");
  const Token2 = await ethers.getContractFactory("Token2");
  const token1 = await Token1.deploy();
  const token2 = await Token2.deploy();

  await token1.deployed();
  await token2.deployed();
  console.log(`Token1 deployed to ${token1.address}`);
  console.log(`Token2 deployed to ${token2.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

