import { ethers } from "hardhat";

async function main() {
  const [signer] = await ethers.getSigners();
  const provider = signer.provider!;

  // 현재 네트워크 정보
  const network = await provider.getNetwork();
  const feeData = await provider.getFeeData();

  console.log("Chain ID:", network.chainId.toString());
  console.log("Base Fee:", ethers.formatUnits(feeData.gasPrice || 0n, "gwei"), "Gwei");

  // ETH 전송 가스 비용 추정
  const tx = {
    to: "0x0000000000000000000000000000000000000001",
    value: 0n,
  };
  const gasEstimate = await provider.estimateGas(tx);
  const cost = gasEstimate * (feeData.gasPrice || 0n);
  console.log("이더 전송 예상 비용:", ethers.formatEther(cost), "ETH");
}

main().catch(console.error);
