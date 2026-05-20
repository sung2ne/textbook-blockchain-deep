"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useQuery } from "urql";
import { BuyNFT } from "@/components/BuyNFT";
import { ipfsToHttp } from "@/lib/ipfs";

const ACTIVE_LISTINGS_QUERY = `
  query GetActiveListings {
    listed: marketplaceListeds(
      where: { active: true }
      orderBy: blockTimestamp
      orderDirection: desc
      first: 20
    ) {
      tokenId
      seller
      price
      token {
        uri
      }
    }
  }
`;

export default function MarketplacePage() {
  const [{ data, fetching }] = useQuery({ query: ACTIVE_LISTINGS_QUERY });

  return (
    <div className="min-h-screen p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">NFT Marketplace</h1>
        <ConnectButton />
      </header>

      {fetching ? (
        <p>로딩 중...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data?.listed.map((item: {
            tokenId: string;
            seller: string;
            price: string;
            token: { uri: string };
          }) => (
            <div key={item.tokenId} className="border rounded-lg overflow-hidden">
              <img
                src={ipfsToHttp(item.token?.uri || "")}
                alt={`NFT #${item.tokenId}`}
                className="w-full aspect-square object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold">NFT #{item.tokenId}</h3>
                <BuyNFT tokenId={BigInt(item.tokenId)} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
