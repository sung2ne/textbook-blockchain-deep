import { createClient } from "urql";

const SUBGRAPH_URL = process.env.NEXT_PUBLIC_SUBGRAPH_URL!;

export const graphqlClient = createClient({
  url: SUBGRAPH_URL,
});

// 특정 사용자의 NFT 목록 조회
export const USER_NFTS_QUERY = `
  query GetUserNFTs($owner: Bytes!) {
    tokens(
      where: { owner: $owner }
      orderBy: tokenId
      orderDirection: asc
    ) {
      id
      tokenId
      uri
      transfers(first: 5, orderBy: timestamp, orderDirection: desc) {
        from
        to
        timestamp
        transactionHash
      }
    }
  }
`;

// 최근 전송 내역 조회
export const RECENT_TRANSFERS_QUERY = `
  query GetRecentTransfers($first: Int!) {
    transfers(
      first: $first
      orderBy: timestamp
      orderDirection: desc
    ) {
      id
      token { tokenId uri }
      from
      to
      timestamp
      transactionHash
    }
  }
`;
