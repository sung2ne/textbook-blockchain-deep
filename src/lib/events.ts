import { createPublicClient, http, parseAbi, parseAbiItem } from "viem";
import { sepolia } from "viem/chains";

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(process.env.NEXT_PUBLIC_RPC_URL),
});

const TRANSFER_EVENT = parseAbiItem(
  "event Transfer(address indexed from, address indexed to, uint256 value)"
);

// 특정 주소가 받은 모든 전송 이벤트 조회
export async function getReceivedTransfers(
  tokenAddress: `0x${string}`,
  recipient: `0x${string}`,
  fromBlock: bigint = 0n
) {
  const logs = await publicClient.getLogs({
    address: tokenAddress,
    event: TRANSFER_EVENT,
    args: {
      to: recipient,  // indexed 파라미터로 필터링
    },
    fromBlock,
    toBlock: "latest",
  });

  return logs.map((log) => ({
    from: log.args.from,
    to: log.args.to,
    value: log.args.value,
    blockNumber: log.blockNumber,
    transactionHash: log.transactionHash,
  }));
}
