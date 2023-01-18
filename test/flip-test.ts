import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect, should } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import token1 from "/home/davit-coinstats/development/FlippingContract/artifacts/contracts/Token1.sol/Token1.json";
import token2 from "/home/davit-coinstats/development/FlippingContract/artifacts/contracts/Token2.sol/Token2.json";

describe("Flip", function () {

    const PRIV_KEY = process.env.DEV_PRIVKEY;
    const provider = new ethers.providers.JsonRpcProvider("https://goerli.infura.io/v3/742f343587964019b49762859344f231");
    const signer = new ethers.Wallet(PRIV_KEY as string, provider);


    async function deployTokenFixture() {
        
        const [owner, acc1, acc2, acc3] = await ethers.getSigners();
        const tk1 = new ethers.Contract("0xb0552E29796FE0dE936dC97e61eD56A51E6e3f27", token1.abi, owner);
        const tk2 = new ethers.Contract("0x96b059535bcfc291e766F5a0a4895B1759C91680", token2.abi, owner);

        const Flip = await ethers.getContractFactory("Flip");
        const flip = await Flip.deploy(tk1.address, tk2.address);

        return { flip, tk1, tk2, owner, acc1, acc2, acc3 };
    }

    describe("Deployment", () => {
        
        it("Should deploy with correct args.", async () => {
            const{ flip, tk1, tk2 } = await loadFixture(deployTokenFixture);
            
            expect(await flip.token1()).to.eq(tk1.address);
            expect(await flip.token2()).to.eq(tk2.address);
        })

    })

    describe("Deposit", () => {
        it.only("Should deposit correctly.", async () => {
            const{ flip, tk1, tk2, owner, acc1, acc2 } = await loadFixture(deployTokenFixture);
            const amount = 10;
            await tk1.connect(signer).mint(ethers.utils.parseEther("1000"));
            // console.log(await tk1.totalSupply());
            // console.log(signer.address);
            
            await tk1.connect(signer).approve(flip.address, amount)
            
            const tx = await flip.connect(signer).deposit(tk1.address, amount);
            console.log(await tk1.balanceOf(signer.address));
            expect((await flip.pool()).token1TotalAmount).to.eq(amount);
            const txTime = (await ethers.provider.getBlock(tx.blockNumber as number)).timestamp;
            expect((await flip.pool()).creationTime).to.eq(txTime);
        })
    })

})