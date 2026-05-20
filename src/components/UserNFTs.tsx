"use client";

import { useQuery } from "urql";
import { useAccount } from "wagmi";
import { USER_NFTS_QUERY, graphqlClient } from "@/lib/graphql";
import { Provider } from "urql";

function NFTList() {
  const { address } = useAccount();

  const [{ data, fetching, error }] = useQuery({
    query: USER_NFTS_QUERY,
    variables: { owner: address?.toLowerCase() },
    pause: !address,
  });

  if (fetching) return <p>로딩 중...</p>;
  if (error) return <p>오류: {error.message}</p>;

  return (
    <div className="grid grid-cols-4 gap-4">
      {data?.tokens.map((token: { id: string; tokenId: string; uri: string }) => (
        <div key={token.id} className="border rounded p-2">
          <p className="font-bold">#{token.tokenId}</p>
          <p className="text-sm text-gray-500">{token.uri}</p>
        </div>
      ))}
    </div>
  );
}

export function UserNFTs() {
  return (
    <Provider value={graphqlClient}>
      <NFTList />
    </Provider>
  );
}
