import token1 from "/home/davit-coinstats/development/FlippingContract/artifacts/contracts/Token1.sol/Token1.json";
import token2 from "/home/davit-coinstats/development/FlippingContract/artifacts/contracts/Token2.sol/Token2.json";
import flipContract from "/home/davit-coinstats/development/FlippingContract/artifacts/contracts/Flip.sol/Flip.json";
import * as dotenv from "dotenv";
import { ethers, BigNumber } from "ethers";
import { Bytes, FunctionFragment } from "ethers/lib/utils";
dotenv.config();

const PRIV_KEY = process.env.DEV_PRIVKEY;
const provider = new ethers.providers.JsonRpcProvider("https://goerli.infura.io/v3/742f343587964019b49762859344f231");
// const signer = new ethers.Wallet(PRIV_KEY as string, provider);



async function main() {
  
  const provider = new ethers.providers.JsonRpcProvider("https://goerli.infura.io/v3/742f343587964019b49762859344f231");

  const signer = new ethers.Wallet(PRIV_KEY as string, provider);

  const tk1 = new ethers.Contract("0xb0552E29796FE0dE936dC97e61eD56A51E6e3f27", token1.abi, signer);
  const tk2 = new ethers.Contract("0x96b059535bcfc291e766F5a0a4895B1759C91680", token2.abi, signer);
  const flip = new ethers.Contract("0x6850832D05C67AC00F17EB59F2Ac1EaeadBc476c", flipContract.abi, signer);
  console.log("BALANCE 1 BEFORE: ", (await tk1.balanceOf(signer.address)).toString());
  const tx1 = await tk1.connect(signer).mint(ethers.utils.parseEther("1000"));
  console.log("BALANCE 1 AFTER: ", (await tk1.balanceOf(signer.address)).toString());


//   console.log("BALANCE 2 BEFORE: ", (await tk1.balanceOf(acc2.address)).toString())
//   console.log("BALANCE 3 BEFORE: ", (await tk1.balanceOf(acc3.address)).toString())

  // const tx1 = await fungibleToken.connect(signer).mint({value: ethers.utils.parseEther("0.000001")});
  // tx1.wait();
  // const balance1: BigNumber = await fungibleToken.balanceOf(signer.address);
  // console.log(BigNumber.from(balance));
  // const tx2 = await fungibleToken.connect(acc2).transfer(signer.address, ethers.utils.parseEther("0.0000001"), {gasLimit: 5000000});
  // tx2.wait();
  // console.log(balance1.toString());
  // const balance2: BigNumber = await fungibleToken.balanceOf(acc2.address);
  // console.log(balance2.toString());
//   const value = ethers.utils.parseEther("0.0000001");

//   const tx3 = await tk1.connect(signer).approve(acc2.address, value);
//   await tx3.wait();

  // const tx4 = await fungibleToken.connect(acc2).transferFrom(signer.address, acc3.address, value, {gasLimit: 5000000})

//   // console.log(await acc2.getBalance());
//   const tx4 = await fungibleToken.connect(acc2).transferFrom(signer.address, acc3.address, value);
//   await tx4.wait();

//   // console.log(tx4)


//   const balance3: BigNumber = await fungibleToken.balanceOf(acc3.address);
//   console.log("BALANCE 1 AFTER: ", (await fungibleToken.balanceOf(signer.address)).toString())
//   console.log("BALANCE 2 AFTER: ", (await fungibleToken.balanceOf(acc2.address)).toString())
//   console.log("BALANCE 3 AFTER: ", (await fungibleToken.balanceOf(acc3.address)).toString())
}

main().catch((error) => {
  console.log(error);
  process.exitCode = 1;
});
