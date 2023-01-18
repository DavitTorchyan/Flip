import { ethers } from "hardhat";

async function main() {
  
  const Flip = await ethers.getContractFactory("Flip");
  const flip = await Flip.deploy("0xb0552E29796FE0dE936dC97e61eD56A51E6e3f27", "0x96b059535bcfc291e766F5a0a4895B1759C91680");

  await flip.deployed();
  console.log(`Flip deployed to ${flip.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

