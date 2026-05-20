"use client";

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { formatEther } from "viem";
import { MARKETPLACE_ADDRESS, NFT_ADDRESS, MARKETPLACE_ABI } from "@/lib/contracts";

export function BuyNFT({ tokenId }: { tokenId: bigint }) {
  const { data: listing } = useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: "listings",
    args: [NFT_ADDRESS, tokenId],
    query: {
      refetchInterval: 10000,  // 10초마다 갱신
    },
  });

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

  if (!listing || !listing[2]) {
    return <p className="text-gray-400">판매 중 아님</p>;
  }

  const [seller, price] = listing;

  function handleBuy() {
    writeContract({
      address: MARKETPLACE_ADDRESS,
      abi: MARKETPLACE_ABI,
      functionName: "buyNFT",
      args: [NFT_ADDRESS, tokenId],
      value: price,
    });
  }

  if (isSuccess) {
    return <p className="text-green-500">구매 완료!</p>;
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-500">
        판매자: {seller.slice(0, 8)}...
      </p>
      <p className="font-bold text-lg">{formatEther(price)} ETH</p>
      <button
        onClick={handleBuy}
        disabled={isPending || isLoading}
        className="w-full bg-green-500 text-white px-4 py-2 rounded"
      >
        {isPending ? "서명 대기..." : isLoading ? "구매 처리 중..." : "구매하기"}
      </button>
    </div>
  );
}
