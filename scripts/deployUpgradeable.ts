import { ethers, upgrades } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  // V1 배포
  const MyTokenV1 = await ethers.getContractFactory("MyTokenV1");
  const proxy = await upgrades.deployProxy(MyTokenV1, [deployer.address], {
    kind: "uups",
  });
  await proxy.waitForDeployment();
  console.log("Proxy deployed to:", await proxy.getAddress());

  // V2로 업그레이드
  const MyTokenV2 = await ethers.getContractFactory("MyTokenV2");
  const upgraded = await upgrades.upgradeProxy(
    await proxy.getAddress(),
    MyTokenV2
  );
  console.log("Upgraded to V2. Proxy address:", await upgraded.getAddress());
}

main().catch(console.error);
