import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  // NFT 컨트랙트 배포
  const MyNFT = await ethers.getContractFactory("MyNFT");
  const nft = await MyNFT.deploy(deployer.address, deployer.address);
  await nft.waitForDeployment();

  // 마켓플레이스 배포
  const Marketplace = await ethers.getContractFactory("NFTMarketplace");
  const marketplace = await Marketplace.deploy(deployer.address);
  await marketplace.waitForDeployment();

  console.log("MyNFT:", await nft.getAddress());
  console.log("Marketplace:", await marketplace.getAddress());
}

main().catch(console.error);
