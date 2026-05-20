import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const HelloToken = await ethers.getContractFactory("HelloToken");
  const token = await HelloToken.deploy();
  await token.waitForDeployment();

  const address = await token.getAddress();
  console.log("HelloToken deployed to:", address);

  const balance = await token.balanceOf(deployer.address);
  console.log("Deployer balance:", ethers.formatUnits(balance, 18), "HLO");
}

main().catch(console.error);
