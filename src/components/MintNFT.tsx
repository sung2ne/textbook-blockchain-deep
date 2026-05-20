"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { uploadImage, uploadMetadata } from "@/lib/ipfs";

const NFT_ABI = [
  {
    name: "mint",
    type: "function",
    stateMutability: "payable",
    inputs: [{ name: "metadataUri", type: "string" }],
    outputs: [],
  },
] as const;

export function MintNFT({ contractAddress }: { contractAddress: `0x${string}` }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  const { writeContract, data: hash } = useWriteContract();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

  async function handleMint() {
    if (!imageFile) return;

    try {
      setStatus("이미지 업로드 중...");
      const imageUri = await uploadImage(imageFile);

      setStatus("메타데이터 업로드 중...");
      const metadataUri = await uploadMetadata({
        name,
        description,
        image: imageUri,
      });

      setStatus("민팅 트랜잭션 전송 중...");
      writeContract({
        address: contractAddress,
        abi: NFT_ABI,
        functionName: "mint",
        args: [metadataUri],
        value: BigInt("50000000000000000"),  // 0.05 ETH
      });
    } catch (error) {
      setStatus(`오류: ${error}`);
    }
  }

  return (
    <div className="space-y-4">
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="NFT 이름" className="border p-2 w-full" />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="설명" className="border p-2 w-full" />
      <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
      <button onClick={handleMint} disabled={isLoading} className="bg-purple-500 text-white px-4 py-2 rounded">
        {isLoading ? "처리 중..." : "민팅"}
      </button>
      <p>{status}</p>
      {isSuccess && <p className="text-green-500">민팅 완료!</p>}
    </div>
  );
}
