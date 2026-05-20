"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits } from "viem";

const ERC20_ABI = [
  {
    name: "transfer",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;

export function TransferForm({ tokenAddress }: { tokenAddress: `0x${string}` }) {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");

  const { writeContract, data: hash, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  function handleTransfer() {
    writeContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: "transfer",
      args: [to as `0x${string}`, parseUnits(amount, 18)],
    });
  }

  return (
    <div className="space-y-4">
      <input
        value={to}
        onChange={(e) => setTo(e.target.value)}
        placeholder="수신자 주소"
        className="border p-2 w-full"
      />
      <input
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="수량"
        className="border p-2 w-full"
      />
      <button
        onClick={handleTransfer}
        disabled={isPending || isConfirming}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {isPending ? "서명 대기 중..." : isConfirming ? "확인 중..." : "전송"}
      </button>
      {isSuccess && <p className="text-green-500">전송 완료!</p>}
      {hash && (
        <p>
          트랜잭션:{" "}
          <a
            href={`https://sepolia.etherscan.io/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            {hash.slice(0, 10)}...
          </a>
        </p>
      )}
    </div>
  );
}
