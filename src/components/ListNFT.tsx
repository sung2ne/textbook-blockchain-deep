"use client";

import { useState } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { MARKETPLACE_ADDRESS, NFT_ADDRESS, MARKETPLACE_ABI, NFT_ABI } from "@/lib/contracts";

export function ListNFT({ tokenId }: { tokenId: bigint }) {
  const { address } = useAccount();
  const [price, setPrice] = useState("");
  const [step, setStep] = useState<"approve" | "list">("approve");

  // 현재 approval 상태 확인
  const { data: isApproved } = useReadContract({
    address: NFT_ADDRESS,
    abi: NFT_ABI,
    functionName: "isApprovedForAll",
    args: address ? [address, MARKETPLACE_ADDRESS] : undefined,
    query: { enabled: !!address },
  });

  const { writeContract: approveAll, data: approveHash } = useWriteContract();
  const { writeContract: listNFT, data: listHash } = useWriteContract();

  const { isLoading: isApproving, isSuccess: approveSuccess } =
    useWaitForTransactionReceipt({ hash: approveHash });

  const { isLoading: isListing, isSuccess: listSuccess } =
    useWaitForTransactionReceipt({ hash: listHash });

  function handleApprove() {
    approveAll({
      address: NFT_ADDRESS,
      abi: NFT_ABI,
      functionName: "setApprovalForAll",
      args: [MARKETPLACE_ADDRESS, true],
    });
  }

  function handleList() {
    if (!price) return;
    listNFT({
      address: MARKETPLACE_ADDRESS,
      abi: MARKETPLACE_ABI,
      functionName: "listNFT",
      args: [NFT_ADDRESS, tokenId, parseEther(price)],
    });
  }

  if (listSuccess) {
    return <p className="text-green-500">NFT #{tokenId.toString()} 리스팅 완료!</p>;
  }

  return (
    <div className="space-y-4 border p-4 rounded">
      <h3 className="font-bold">NFT #{tokenId.toString()} 판매 등록</h3>

      {!isApproved && step === "approve" && (
        <div>
          <p className="text-sm text-gray-600 mb-2">
            마켓플레이스가 NFT를 이전할 수 있도록 허가해야 합니다.
          </p>
          <button
            onClick={handleApprove}
            disabled={isApproving}
            className="bg-yellow-500 text-white px-4 py-2 rounded"
          >
            {isApproving ? "허가 중..." : "마켓플레이스 허가"}
          </button>
        </div>
      )}

      {(isApproved || approveSuccess) && (
        <div className="space-y-2">
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="판매 가격 (ETH)"
            className="border p-2 w-full"
          />
          <button
            onClick={handleList}
            disabled={isListing || !price}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {isListing ? "등록 중..." : "판매 등록"}
          </button>
        </div>
      )}
    </div>
  );
}
