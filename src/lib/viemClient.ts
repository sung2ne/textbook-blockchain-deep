import {
  createPublicClient,
  createWalletClient,
  custom,
  http,
  parseAbi,
  parseUnits,
} from "viem";
import { sepolia } from "viem/chains";

export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(process.env.NEXT_PUBLIC_RPC_URL),
});

// 브라우저 지갑(MetaMask 등) 연결
export function getWalletClient() {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask not installed");
  }
  return createWalletClient({
    chain: sepolia,
    transport: custom(window.ethereum),
  });
}

const ERC20_ABI = parseAbi([
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address, uint256) returns (bool)",
  "function approve(address, uint256) returns (bool)",
]);

// 토큰 전송 트랜잭션
export async function transferToken(
  tokenAddress: `0x${string}`,
  to: `0x${string}`,
  amount: string,
  decimals: number = 18
) {
  const walletClient = getWalletClient();
  const [account] = await walletClient.getAddresses();

  const hash = await walletClient.writeContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "transfer",
    args: [to, parseUnits(amount, decimals)],
    account,
  });

  // 트랜잭션 영수증 대기
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  return receipt;
}
