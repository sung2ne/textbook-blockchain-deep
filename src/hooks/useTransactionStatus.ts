import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";

type TxStatus = "pending" | "success" | "reverted" | null;

export function useTransactionStatus(hash?: `0x${string}`) {
  const publicClient = usePublicClient();
  const [status, setStatus] = useState<TxStatus>(null);
  const [confirmations, setConfirmations] = useState(0);

  useEffect(() => {
    if (!hash || !publicClient) return;

    setStatus("pending");

    publicClient.waitForTransactionReceipt({ hash }).then((receipt) => {
      setStatus(receipt.status === "success" ? "success" : "reverted");
    });

    // 확인 블록 수 추적
    const unwatch = publicClient.watchBlocks({
      onBlock: async () => {
        const receipt = await publicClient.getTransactionReceipt({ hash }).catch(() => null);
        if (receipt) {
          const latestBlock = await publicClient.getBlockNumber();
          setConfirmations(Number(latestBlock - receipt.blockNumber));
        }
      },
    });

    return () => unwatch();
  }, [hash, publicClient]);

  return { status, confirmations };
}
