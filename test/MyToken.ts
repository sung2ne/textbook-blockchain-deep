import { expect } from "chai";
import { ethers } from "hardhat";

describe("MyToken", function () {
  async function deployFixture() {
    const [owner, alice, bob] = await ethers.getSigners();
    const MyToken = await ethers.getContractFactory("MyToken");
    const token = await MyToken.deploy(owner.address);
    return { token, owner, alice, bob };
  }

  it("초기 발행량이 owner에게 지급된다", async function () {
    const { token, owner } = await deployFixture();
    const balance = await token.balanceOf(owner.address);
    expect(balance).to.equal(ethers.parseUnits("100000", 18));
  });

  it("transfer가 잔액을 정확히 이동시킨다", async function () {
    const { token, owner, alice } = await deployFixture();
    await token.transfer(alice.address, ethers.parseUnits("1000", 18));
    expect(await token.balanceOf(alice.address)).to.equal(
      ethers.parseUnits("1000", 18)
    );
  });

  it("approve/transferFrom 흐름이 작동한다", async function () {
    const { token, owner, alice, bob } = await deployFixture();
    const amount = ethers.parseUnits("500", 18);

    await token.connect(alice).approve(bob.address, amount);
    expect(await token.allowance(alice.address, bob.address)).to.equal(amount);

    await token.transfer(alice.address, amount);
    await token.connect(bob).transferFrom(alice.address, bob.address, amount);
    expect(await token.balanceOf(bob.address)).to.equal(amount);
  });

  it("cap을 초과하면 revert된다", async function () {
    const { token, owner } = await deployFixture();
    const cap = await token.cap();
    await expect(
      token.mint(owner.address, cap + 1n)
    ).to.be.revertedWithCustomError(token, "ERC20ExceededCap");
  });
});
