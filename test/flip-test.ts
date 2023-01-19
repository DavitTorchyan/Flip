import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { doesNotMatch } from "assert";
import { expect, should } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import token1 from "/home/davit-coinstats/development/FlippingContract/artifacts/contracts/Token1.sol/Token1.json";
import token2 from "/home/davit-coinstats/development/FlippingContract/artifacts/contracts/Token2.sol/Token2.json";

describe("Flip", function () {

    async function deployTokenFixture() {
        
        const [owner, acc1, acc2, acc3] = await ethers.getSigners();
        const tk1 = new ethers.Contract("0xD00706d33E9779A4e4a87ceb77aD601470209d18", token1.abi, owner);
        const tk2 = new ethers.Contract("0x66593b8f5ABd59dA37d01D40201a65a0606451f3", token2.abi, owner);

        const Flip = await ethers.getContractFactory("Flip");
        const flip = await Flip.deploy(tk1.address, tk2.address);

        // const Swap = await ethers.getContractFactory("Swap");
        // const swap = await Swap.deploy(tk1.address, tk2.address);

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
            
            const tx1 = await tk1.connect(owner).mint(ethers.utils.parseEther("200"));
            const tx2 = await tk2.connect(owner).mint(ethers.utils.parseEther("400"));           
            
            await tk1.connect(owner).approve(flip.address, ethers.utils.parseEther("400"));
            await tk2.connect(owner).approve(flip.address, ethers.utils.parseEther("800"));

            const tx3 = await flip.connect(owner).deposit(tk1.address, ethers.utils.parseEther("100"));
            const tx4 = await flip.connect(owner).deposit(tk2.address, ethers.utils.parseEther("200"));
            
            console.log("POOL BEFORE", await flip.pool());
            
            console.log(await tk1.balanceOf(flip.address));
            console.log(await tk2.balanceOf(flip.address));

            const router = await flip.UNISWAP_V2_ROUTER();
            console.log("msg.sender token1 balance: ", await tk1.balanceOf(owner.address));
            console.log("msg.sender token2 balance: ", await tk2.balanceOf(owner.address));
            
            console.log("router token1 balance: ", await tk1.balanceOf(router));
            console.log("router token2 balance: ", await tk2.balanceOf(router));
            
            // console.log("router address: ", router);
            // console.log("owner address: ", owner.address);
            
            // await tk1.connect(owner).approve(router, ethers.utils.parseEther("100"));
            // await tk2.connect(owner).approve(router, ethers.utils.parseEther("200"));
            await flip.connect(owner).flip();

            console.log("POOL AFTER", await flip.pool());


            // await tx2.wait();
            // expect((await flip.pool()).token1TotalAmount).to.eq(ethers.utils.parseEther("100"));
            // const txTime = (await ethers.provider.getBlock(tx1.blockNumber as number)).timestamp;
            // expect((await flip.pool()).creationTime).to.eq(txTime);
        })
    })

})