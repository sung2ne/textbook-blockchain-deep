import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("MyToken", function () {
  // 픽스처: 테스트마다 깨끗한 상태에서 시작
  async function deployFixture() {
    const [owner, alice, bob, attacker] = await ethers.getSigners();
    const MyToken = await ethers.getContractFactory("MyToken");
    const token = await MyToken.deploy(owner.address);
    return { token, owner, alice, bob, attacker };
  }

  describe("배포", function () {
    it("owner가 초기 발행량을 받는다", async function () {
      const { token, owner } = await loadFixture(deployFixture);
      expect(await token.balanceOf(owner.address)).to.equal(
        ethers.parseUnits("100000", 18)
      );
    });

    it("이름과 심볼이 올바르다", async function () {
      const { token } = await loadFixture(deployFixture);
      expect(await token.name()).to.equal("MyToken");
      expect(await token.symbol()).to.equal("MTK");
    });
  });

  describe("mint", function () {
    it("owner가 mint할 수 있다", async function () {
      const { token, owner, alice } = await loadFixture(deployFixture);
      const amount = ethers.parseUnits("1000", 18);
      await token.mint(alice.address, amount);
      expect(await token.balanceOf(alice.address)).to.equal(amount);
    });

    it("owner가 아니면 mint 실패", async function () {
      const { token, attacker, alice } = await loadFixture(deployFixture);
      await expect(
        token.connect(attacker).mint(alice.address, 1000n)
      ).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
    });
  });

  describe("이벤트", function () {
    it("transfer 시 Transfer 이벤트 발생", async function () {
      const { token, owner, alice } = await loadFixture(deployFixture);
      const amount = ethers.parseUnits("100", 18);
      await expect(token.transfer(alice.address, amount))
        .to.emit(token, "Transfer")
        .withArgs(owner.address, alice.address, amount);
    });
  });
});
