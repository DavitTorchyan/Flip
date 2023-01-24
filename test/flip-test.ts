import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import _factory from "../uniswapFactoriABI.json";
import _router from "../routerABI.json";

describe("Flip", function () {
    async function deployFlipFixture() {
        const [owner, acc1, acc2, acc3] = await ethers.getSigners();

        const Token1 = await ethers.getContractFactory("Token1");
        const tk1 = await Token1.deploy();
        const Token2 = await ethers.getContractFactory("Token2");
        const tk2 = await Token2.deploy();

        const factory = new ethers.Contract(
            "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
            _factory.abi,
            owner
        );
        const router = new ethers.Contract(
            "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
            _router.abi,
            owner
        );

        const Flip = await ethers.getContractFactory("Flip");
        const flip = await Flip.deploy(tk1.address, tk2.address);

        return { flip, router, factory, tk1, tk2, owner, acc1, acc2, acc3 };
    }

    describe("Deployment", () => {
        it("Should deploy with correct args.", async () => {
            const { flip, tk1, tk2 } = await loadFixture(deployFlipFixture);

            expect(await flip.token1()).to.eq(tk1.address);
            expect(await flip.token2()).to.eq(tk2.address);
        });
    });

    describe("Deposit", () => {
        it("Should deposit correctly.", async () => {
            const { flip, tk1, tk2, owner } = await loadFixture(
                deployFlipFixture
            );
            await tk1.connect(owner).mint(ethers.utils.parseEther("100"));
            await tk2.connect(owner).mint(ethers.utils.parseEther("100"));

            await tk1
                .connect(owner)
                .approve(flip.address, ethers.utils.parseEther("10"));
            await tk2
                .connect(owner)
                .approve(flip.address, ethers.utils.parseEther("10"));

            await flip
                .connect(owner)
                .deposit(tk1.address, ethers.utils.parseEther("10"));
            await flip
                .connect(owner)
                .deposit(tk2.address, ethers.utils.parseEther("10"));

            expect((await flip.pool()).token1TotalAmount).to.eq(
                ethers.utils.parseEther("10")
            );
            expect((await flip.pool()).token2TotalAMount).to.eq(
                ethers.utils.parseEther("10")
            );
        });

        it("Should revert when trying to deposit another token.", async () => {
            const { flip, tk1, tk2, owner } = await loadFixture(
                deployFlipFixture
            );
            await expect(flip.connect(owner).deposit(ethers.constants.AddressZero, 100)).to.be.revertedWith("Deposited token must be either token1 or token2!");
        })

    });

    describe("Adding Liquidity", () => {
        it("Should add liquidity correctly.", async () => {
            const { flip, factory, tk1, tk2, owner } = await loadFixture(
                deployFlipFixture
            );

            const tx1 = await tk1
                .connect(owner)
                .mint(ethers.utils.parseEther("1000"));
            const tx2 = await tk2
                .connect(owner)
                .mint(ethers.utils.parseEther("1000"));
            await tk1
                .connect(owner)
                .transfer(flip.address, ethers.utils.parseEther("500"));
            await tk2
                .connect(owner)
                .transfer(flip.address, ethers.utils.parseEther("500"));
            await tk1
                .connect(owner)
                .approve(flip.address, ethers.utils.parseEther("500"));
            await tk2
                .connect(owner)
                .approve(flip.address, ethers.utils.parseEther("500"));

            await flip
                .connect(owner)
                .addLiquidity(
                    tk1.address,
                    tk2.address,
                    ethers.utils.parseEther("500"),
                    ethers.utils.parseEther("500"),
                    0,
                    0,
                    flip.address,
                    1682301189
                );

            const pair = await factory.getPair(tk1.address, tk2.address);
            expect(await tk1.balanceOf(pair)).to.eq(ethers.utils.parseEther("500"));
            expect(await tk2.balanceOf(pair)).to.eq(ethers.utils.parseEther("500"));
        })  
    })

    describe("Flip", () => {
        it.only("Should flip correctly.", async () => {
            const { flip, factory, tk1, tk2, owner } = await loadFixture(
                deployFlipFixture
            );

            const tx1 = await tk1
                .connect(owner)
                .mint(ethers.utils.parseEther("1000"));
            const tx2 = await tk2
                .connect(owner)
                .mint(ethers.utils.parseEther("1000"));
            await tk1
                .connect(owner)
                .transfer(flip.address, ethers.utils.parseEther("500"));
            await tk2
                .connect(owner)
                .transfer(flip.address, ethers.utils.parseEther("500"));
            await tk1
                .connect(owner)
                .approve(flip.address, ethers.utils.parseEther("500"));
            await tk2
                .connect(owner)
                .approve(flip.address, ethers.utils.parseEther("500"));

            await flip
                .connect(owner)
                .addLiquidity(
                    tk1.address,
                    tk2.address,
                    ethers.utils.parseEther("500"),
                    ethers.utils.parseEther("500"),
                    0,
                    0,
                    flip.address,
                    1682301189
                );

            await flip
                .connect(owner)
                .deposit(tk1.address, ethers.utils.parseEther("50"));
            await flip
                .connect(owner)
                .deposit(tk2.address, ethers.utils.parseEther("75"));

            const pair = await factory.getPair(tk1.address, tk2.address);

            await tk1
                .connect(owner)
                .approve(flip.address, ethers.utils.parseEther("200"));
            await tk2
                .connect(owner)
                .approve(flip.address, ethers.utils.parseEther("200"));

            await flip.connect(owner).flip();
            const poolToken1Balance = await tk1.balanceOf(pair);
            const poolToken2Balance = await tk2.balanceOf(pair);
            console.log("poolToken1Balance: ", poolToken1Balance.toString());
            console.log("poolToken2Balance: ", poolToken2Balance.toString());
        });

    });
});
