import { PinataSDK } from "pinata-web3";

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: process.env.NEXT_PUBLIC_GATEWAY_URL,
});

// 이미지 파일 업로드
export async function uploadImage(file: File): Promise<string> {
  const result = await pinata.upload.file(file);
  return `ipfs://${result.IpfsHash}`;
}

// NFT 메타데이터 JSON 업로드
export async function uploadMetadata(metadata: {
  name: string;
  description: string;
  image: string;
  attributes?: { trait_type: string; value: string | number }[];
}): Promise<string> {
  const result = await pinata.upload.json(metadata);
  return `ipfs://${result.IpfsHash}`;
}

// IPFS URI를 HTTP URL로 변환 (브라우저 표시용)
export function ipfsToHttp(ipfsUri: string): string {
  if (ipfsUri.startsWith("ipfs://")) {
    const cid = ipfsUri.replace("ipfs://", "");
    return `${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cid}`;
  }
  return ipfsUri;
}
