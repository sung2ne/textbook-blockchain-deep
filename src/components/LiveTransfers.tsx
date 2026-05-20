"use client";

import { useState } from "react";
import { useWatchContractEvent } from "wagmi";
import { formatUnits } from "viem";

const TRANSFER_ABI = [
  {
    type: "event",
    name: "Transfer",
    inputs: [
      { name: "from", type: "address", indexed: true },
      { name: "to", type: "address", indexed: true },
      { name: "value", type: "uint256", indexed: false },
    ],
  },
] as const;

type Transfer = {
  from: string;
  to: string;
  value: bigint;
  timestamp: Date;
};

export function LiveTransfers({
  tokenAddress,
}: {
  tokenAddress: `0x${string}`;
}) {
  const [transfers, setTransfers] = useState<Transfer[]>([]);

  useWatchContractEvent({
    address: tokenAddress,
    abi: TRANSFER_ABI,
    eventName: "Transfer",
    onLogs: (logs) => {
      const newTransfers = logs.map((log) => ({
        from: log.args.from!,
        to: log.args.to!,
        value: log.args.value!,
        timestamp: new Date(),
      }));
      setTransfers((prev) => [...newTransfers, ...prev].slice(0, 50));
    },
  });

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">실시간 전송</h2>
      <div className="space-y-2">
        {transfers.map((tx, i) => (
          <div key={i} className="border p-2 rounded text-sm">
            <span className="text-gray-500">{tx.from.slice(0, 8)}...</span>
            {" → "}
            <span className="text-gray-500">{tx.to.slice(0, 8)}...</span>
            {" | "}
            <span className="font-bold">{formatUnits(tx.value, 18)} MTK</span>
          </div>
        ))}
        {transfers.length === 0 && (
          <p className="text-gray-400">이벤트 대기 중...</p>
        )}
      </div>
    </div>
  );
}
