"use client";

import { useReadContract } from "wagmi";
import { useAccount } from "wagmi";
import { formatUnits } from "viem";

const ERC20_ABI = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

const TOKEN_ADDRESS = "0x..." as `0x${string}`;

export function TokenBalance() {
  const { address } = useAccount();

  const { data: balance, isLoading, error } = useReadContract({
    address: TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  if (isLoading) return <p>로딩 중...</p>;
  if (error) return <p>오류: {error.message}</p>;

  return (
    <p>잔액: {balance !== undefined ? formatUnits(balance, 18) : "0"} MTK</p>
  );
}
