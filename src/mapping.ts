import { Transfer as TransferEvent } from "../generated/MyNFT/MyNFT";
import { Token, Transfer, User } from "../generated/schema";
import { BigInt } from "@graphprotocol/graph-ts";

export function handleTransfer(event: TransferEvent): void {
  const tokenId = event.params.tokenId.toString();

  // Token 엔티티 생성 또는 업데이트
  let token = Token.load(tokenId);
  if (!token) {
    token = new Token(tokenId);
    token.tokenId = event.params.tokenId;
  }
  token.owner = event.params.to;
  token.save();

  // Transfer 엔티티 생성
  const transferId = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
  const transfer = new Transfer(transferId);
  transfer.token = tokenId;
  transfer.from = event.params.from;
  transfer.to = event.params.to;
  transfer.timestamp = event.block.timestamp;
  transfer.blockNumber = event.block.number;
  transfer.transactionHash = event.transaction.hash;
  transfer.save();
}
