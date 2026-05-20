import { createWalletClient, custom } from "viem";
import { sepolia } from "viem/chains";

const MARKETPLACE_ABI_TYPED_DATA = {
  domain: {
    name: "NFT Marketplace",
    version: "1",
    chainId: sepolia.id,
    verifyingContract: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS as `0x${string}`,
  },
  types: {
    Bid: [
      { name: "tokenId", type: "uint256" },
      { name: "price", type: "uint256" },
      { name: "bidder", type: "address" },
      { name: "expiry", type: "uint256" },
    ],
  },
} as const;

export async function signBid(
  tokenId: bigint,
  price: bigint,
  bidder: `0x${string}`,
  expiry: bigint
) {
  const walletClient = createWalletClient({
    chain: sepolia,
    transport: custom(window.ethereum),
  });

  const signature = await walletClient.signTypedData({
    ...MARKETPLACE_ABI_TYPED_DATA,
    primaryType: "Bid",
    message: { tokenId, price, bidder, expiry },
    account: bidder,
  });

  return signature;
}
