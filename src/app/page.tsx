"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useBalance, useChainId } from "wagmi";
import { formatEther } from "viem";

export default function Home() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: balance } = useBalance({ address });

  return (
    <main className="p-8">
      <ConnectButton />

      {isConnected && address && (
        <div className="mt-4 space-y-2">
          <p>주소: {address}</p>
          <p>체인 ID: {chainId}</p>
          <p>잔액: {balance ? formatEther(balance.value) : "0"} ETH</p>
        </div>
      )}
    </main>
  );
}
